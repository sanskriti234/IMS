
from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from uuid import UUID

from app.core.security import get_current_user
from app.models.identity import Profile, RoleType


router = APIRouter(prefix="/auth", tags=["Authentication"])


class CurrentUserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role_type: RoleType

    model_config = ConfigDict(from_attributes=True)


@router.get("/me", response_model=CurrentUserResponse)
async def get_authenticated_user(
    current_user: Profile = Depends(get_current_user),
):
    """
    Return the authenticated institutional user's profile.
    Role information comes from the database.
    """
    return current_user
