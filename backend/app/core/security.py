
import asyncio
import time
from uuid import UUID
import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.database.session import get_db
from app.models.identity import Profile, RoleType


bearer_scheme = HTTPBearer(auto_error=False)

# JWKS cache
_jwks_cache: dict | None = None
_jwks_cache_time: float = 0
_jwks_cache_lock = asyncio.Lock()

JWKS_CACHE_TTL = 300  # 5 minutes


def get_jwks_url() -> str:
    return (
        f"{settings.SUPABASE_URL.rstrip('/')}"
        "/auth/v1/.well-known/jwks.json"
    )


async def get_signing_key(kid: str, force_refresh: bool = False) -> dict:
    """
    Fetch and cache Supabase public signing keys.
    Select the ES256 key matching the JWT's kid.
    """
    global _jwks_cache, _jwks_cache_time

    async with _jwks_cache_lock:

        cache_expired = (
            _jwks_cache is None
            or time.monotonic() - _jwks_cache_time > JWKS_CACHE_TTL
        )

        if force_refresh or cache_expired:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(get_jwks_url())
                    response.raise_for_status()
                    jwks = response.json()

                if not isinstance(jwks.get("keys"), list):
                    raise ValueError("Invalid JWKS response.")

                _jwks_cache = jwks
                _jwks_cache_time = time.monotonic()

            except (httpx.HTTPError, ValueError) as exc:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Unable to retrieve authentication signing keys.",
                ) from exc

        for key in _jwks_cache["keys"]:
            if (
                key.get("kid") == kid
                and key.get("alg") == "ES256"
                and key.get("kty") == "EC"
                and key.get("crv") == "P-256"
                and key.get("use", "sig") == "sig"
            ):
                return key

        # Key may have rotated. Refresh JWKS once.
        if not force_refresh:
            return await get_signing_key(kid, force_refresh=True)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No matching Supabase signing key was found.",
        )


async def verify_supabase_jwt(token: str) -> dict:
    """
    Verify Supabase ES256 JWT using its public JWKS key.
    """
    issuer = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1"

    try:
        header = jwt.get_unverified_header(token)

        if header.get("alg") != "ES256":
            raise JWTError("Unexpected JWT signing algorithm.")

        kid = header.get("kid")

        if not kid:
            raise JWTError("JWT key identifier is missing.")

        signing_key = await get_signing_key(kid)

        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["ES256"],
            audience="authenticated",
            issuer=issuer,
            options={
                "verify_signature": True,
                "verify_exp": True,
                "verify_iss": True,
                "verify_aud": True,
                "require_exp": True,
                "require_sub": True,
            },
        )

        return payload

    except HTTPException:
        raise

    except JWTError as exc:
        print("JWT verification failed:", type(exc).__name__, str(exc))

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Profile:

    # DEVELOPMENT ONLY: bypass Supabase JWT verification.
    dev_auth_bypass = (
        settings.DEBUG
        and os.getenv("CORESIGHT_DEV_AUTH_BYPASS", "").lower() == "true"
    )

    if dev_auth_bypass:
        dev_user_id = os.getenv("CORESIGHT_DEV_USER_ID")

        if not dev_user_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Development user ID is not configured.",
            )

        try:
            user_id = UUID(dev_user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Invalid development user ID.",
            )

        result = await db.execute(
            select(Profile).where(Profile.id == user_id)
        )

        profile = result.scalar_one_or_none()

        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Development profile does not exist.",
            )

        return profile

    # NORMAL AUTHENTICATION
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials are required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = await verify_supabase_jwt(credentials.credentials)

    try:
        user_id = UUID(payload["sub"])
    except (ValueError, TypeError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user identity in authentication token.",
        )

    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )

    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No institutional profile is associated with this account.",
        )

    return profile


def require_role(*allowed_roles: RoleType):

    async def role_checker(
        current_user: Profile = Depends(get_current_user),
    ) -> Profile:

        if current_user.role_type not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return current_user

    return role_checker
