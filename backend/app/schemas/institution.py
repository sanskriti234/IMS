
import uuid
from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


# ============================================================
# DEPARTMENT MANAGEMENT
# ============================================================

class DepartmentCreate(BaseModel):
    code: str = Field(
        min_length=2,
        max_length=50,
        pattern=r"^[A-Z0-9][A-Z0-9_-]*$",
    )

    name: str = Field(
        min_length=2,
        max_length=255,
    )

    @field_validator("code", mode="before")
    @classmethod
    def normalize_code(cls, value):
        if value is None:
            raise ValueError("Code cannot be null.")

        return value.strip().upper() if isinstance(value, str) else value

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        if value is None:
            raise ValueError("Name cannot be null.")

        return value.strip() if isinstance(value, str) else value


class DepartmentUpdate(BaseModel):
    code: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
        pattern=r"^[A-Z0-9][A-Z0-9_-]*$",
    )

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    @field_validator("code", mode="before")
    @classmethod
    def normalize_code(cls, value):
        if value is None:
            raise ValueError("Code cannot be null.")

        return value.strip().upper() if isinstance(value, str) else value

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        if value is None:
            raise ValueError("Name cannot be null.")

        return value.strip() if isinstance(value, str) else value

    @model_validator(mode="after")
    def require_at_least_one_field(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be provided.")

        return self


class DepartmentStatusUpdate(BaseModel):
    is_active: bool


class DepartmentResponse(BaseModel):
    id: uuid.UUID
    code: str
    name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# PROGRAM
# ============================================================

class ProgramResponse(BaseModel):
    id: uuid.UUID
    department_id: uuid.UUID
    code: str
    name: str
    total_semesters: int

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# BATCH
# ============================================================

class BatchResponse(BaseModel):
    id: uuid.UUID
    program_id: uuid.UUID
    start_year: int
    end_year: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# SECTION
# ============================================================

class SectionResponse(BaseModel):
    id: uuid.UUID
    batch_id: uuid.UUID
    name: str
    capacity_informational: int

    model_config = ConfigDict(from_attributes=True)
