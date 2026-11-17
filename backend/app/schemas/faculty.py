
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class FacultyCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    employee_code: str = Field(min_length=1, max_length=50)
    designation: str = Field(min_length=2, max_length=100)
    department_id: UUID


class FacultyResponse(BaseModel):
    id: UUID
    profile_id: UUID
    full_name: str
    email: EmailStr
    employee_code: str
    designation: str
    department_id: UUID

    model_config = ConfigDict(from_attributes=True)
