from pydantic import BaseModel
import uuid
from typing import Dict, Any, Optional
from app.models.registration import SubmissionStatus

class RegistrationFormCreate(BaseModel):
    academic_session_id: uuid.UUID
    batch_id: uuid.UUID
    form_schema: Dict[str, Any]

class RegistrationFormResponse(RegistrationFormCreate):
    id: uuid.UUID

    model_config = {"from_attributes": True}

class SubmissionCreate(BaseModel):
    registration_form_id: uuid.UUID
    student_id: uuid.UUID
    submission_data: Dict[str, Any]

class SubmissionResponse(SubmissionCreate):
    id: uuid.UUID
    status: SubmissionStatus
    reviewed_by: Optional[uuid.UUID] = None
    review_notes: Optional[str] = None

    model_config = {"from_attributes": True}

class SubmissionReview(BaseModel):
    status: SubmissionStatus
    reviewed_by: uuid.UUID
    review_notes: Optional[str] = None