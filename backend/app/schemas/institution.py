
import uuid

from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


# ============================================================
# COMMON TYPES
# ============================================================

AcademicYearStatusType = Literal[
    "planned",
    "active",
    "completed",
]

AcademicSessionStatusType = Literal[
    "planned",
    "active",
    "completed",
    "cancelled",
]


# ============================================================
# ACADEMIC YEAR
# Represents the complete programme cohort.
# Example: 2023-27
# ============================================================

class AcademicYearCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=20,
    )

    start_date: date
    end_date: date

    status: AcademicYearStatusType = "planned"

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError(
                "end_date must be after start_date"
            )
        return self


class AcademicYearResponse(BaseModel):
    id: UUID
    name: str
    start_date: date
    end_date: date
    status: AcademicYearStatusType

    academic_session_count: int = 0

    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# ACADEMIC SESSION
# Represents one semester within a cohort.
# Example: Semester 1 of AIML 2023-27
#
# IMPORTANT:
# Admin supplies department_id.
# Backend resolves program_id and batch_id automatically.
# ============================================================

class AcademicSessionCreate(BaseModel):
    department_id: UUID
    academic_year_id: UUID

    semester_number: int = Field(
        ge=1,
        le=8,
    )

    start_date: date
    end_date: date

    status: AcademicSessionStatusType = "planned"

    @model_validator(mode="after")
    def validate_session(self):
        if self.end_date <= self.start_date:
            raise ValueError(
                "end_date must be after start_date"
            )

        return self


class AcademicSessionResponse(BaseModel):
    id: UUID
    academic_year_id: UUID

    batch_id: UUID
    semester_number: int

    start_date: date
    end_date: date

    status: AcademicSessionStatusType

    model_config = ConfigDict(from_attributes=True)


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

        return (
            value.strip().upper()
            if isinstance(value, str)
            else value
        )

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        if value is None:
            raise ValueError("Name cannot be null.")

        return (
            value.strip()
            if isinstance(value, str)
            else value
        )


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

        return (
            value.strip().upper()
            if isinstance(value, str)
            else value
        )

    @field_validator("name", mode="before")
    @classmethod
    def normalize_name(cls, value):
        if value is None:
            raise ValueError("Name cannot be null.")

        return (
            value.strip()
            if isinstance(value, str)
            else value
        )

    @model_validator(mode="after")
    def require_at_least_one_field(self):
        if not self.model_fields_set:
            raise ValueError(
                "At least one field must be provided."
            )

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
    id: UUID
    department_id: UUID
    code: str
    name: str
    total_semesters: int

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# BATCH
# Generated automatically by backend.
# ============================================================

class BatchResponse(BaseModel):
    id: UUID
    program_id: UUID

    start_year: int
    end_year: int

    name: str

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# SECTION
# ============================================================

class SectionResponse(BaseModel):
    id: UUID
    batch_id: UUID

    name: str
    capacity_informational: int

    model_config = ConfigDict(from_attributes=True)


class SectionCreate(BaseModel):
    batch_id: UUID

    name: str = Field(
        min_length=1,
        max_length=50,
    )

    capacity_informational: int = Field(
        default=60,
        ge=1,
    )

    @field_validator("name")
    @classmethod
    def normalize_section_name(cls, value: str) -> str:
        return value.strip().upper()


class SectionUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    capacity_informational: int | None = Field(
        default=None,
        ge=1,
    )

    @field_validator("name")
    @classmethod
    def normalize_section_name(cls, value):
        if value is None:
            raise ValueError("Section name cannot be null.")

        return value.strip().upper()

    @field_validator("capacity_informational")
    @classmethod
    def validate_capacity(cls, value):
        if value is None:
            raise ValueError("Capacity cannot be null.")

        return value

    @model_validator(mode="after")
    def require_at_least_one_field(self):
        if not self.model_fields_set:
            raise ValueError(
                "At least one field must be provided."
            )

        return self
