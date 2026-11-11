from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.core.security import verify_supabase_jwt
from app.models.identity import Profile, FacultyProfile

security_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> Profile:
    """
    Resolves authenticated user from Supabase JWT and links to local profiles table.
    """
    token = credentials.credentials
    payload = verify_supabase_jwt(token)
    
    user_email = payload.get("email")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: email missing"
        )

    result = await db.execute(select(Profile).where(Profile.email == user_email))
    user_profile = result.scalars().first()

    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User profile not provisioned in CoreSight."
        )

    return user_profile

async def get_current_faculty(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> FacultyProfile:
    """
    Ensures current user possesses a faculty profile.
    """
    if current_user.role_type != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to faculty accounts."
        )

    result = await db.execute(
        select(FacultyProfile).where(FacultyProfile.profile_id == current_user.id)
    )
    faculty_profile = result.scalars().first()

    if not faculty_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faculty institutional profile not found."
        )

    return faculty_profile