
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from app.models.assignments import OfferingStatus

# ============================================================
# SUBJECT CATALOGUE
# ============================================================

class SubjectCreate(BaseModel):
    department_id: UUID
    code: str
    name: str
    credits: int


class SubjectUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    credits: int | None = None


class SubjectResponse(BaseModel):
    id: UUID
    department_id: UUID
    code: str
    name: str
    credits: int
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# ACADEMIC SESSION SUBJECTS
# ============================================================

class AcademicSessionSubjectCreate(BaseModel):
    subject_ids: list[UUID]


class AcademicSessionSubjectResponse(BaseModel):
    id: UUID
    academic_session_id: UUID
    subject_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubjectOfferingSyncResponse(BaseModel):
    academic_session_id: UUID
    subjects_added: int
    offerings_created: int
    offerings_existing: int

# ============================================================
# SUBJECT OFFERING OPTIONS
# ============================================================

class SubjectOfferingOptionResponse(BaseModel):
    id: UUID

    subject_id: UUID
    subject_code: str
    subject_name: str

    section_id: UUID
    section_name: str

    academic_session_id: UUID
    semester_number: int

    status: OfferingStatus

    model_config = ConfigDict(from_attributes=True)

class SubjectOfferingStatusUpdate(BaseModel):
    status: OfferingStatus
# ============================================================
# TEACHING ASSIGNMENTS
# ============================================================

class TeachingAssignmentCreate(BaseModel):
    subject_offering_id: UUID
    faculty_id: UUID


class TeachingAssignmentResponse(BaseModel):
    id: UUID
    subject_offering_id: UUID
    faculty_id: UUID
    assigned_by: UUID
    is_active: bool
    ended_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TeachingAssignmentDetailResponse(BaseModel):
    id: UUID
    subject_offering_id: UUID
    faculty_id: UUID
    assigned_by: UUID

    subject_id: UUID
    subject_code: str
    subject_name: str

    section_id: UUID
    section_name: str

    academic_session_id: UUID
    semester_number: int

    is_active: bool
    ended_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
    
# ============================================================
# MENTORSHIP ASSIGNMENTS
# ============================================================

class SectionMentorAssignmentCreate(BaseModel):
    section_id: UUID
    faculty_id: UUID
    academic_session_id: UUID


class SectionMentorAssignmentResponse(BaseModel):
    id: UUID
    section_id: UUID
    faculty_id: UUID
    academic_session_id: UUID
    assigned_by: UUID
    is_active: bool
    ended_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

