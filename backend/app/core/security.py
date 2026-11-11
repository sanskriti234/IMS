from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.core.config import settings

def verify_supabase_jwt(token: str) -> dict:
    """
    Validates Supabase Auth JWT signature, expiration, and claims.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}  # Supabase tokens use 'authenticated' role
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )