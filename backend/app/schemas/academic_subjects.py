
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SubjectCreate(BaseModel):
    department_id: UUID
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=255)
    credits: int = Field(gt=0)


class SubjectUpdate(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=50)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    credits: int | None = Field(default=None, gt=0)


class SubjectResponse(BaseModel):
    id: UUID
    department_id: UUID
    code: str
    name: str
    credits: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AcademicSessionSubjectCreate(BaseModel):
    subject_id: UUID


class AcademicSessionSubjectResponse(BaseModel):
    id: UUID
    academic_session_id: UUID
    subject_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubjectOfferingSyncResponse(BaseModel):
    academic_session_id: UUID
    sections_processed: int
    offerings_created: int
    offerings_already_existing: int
