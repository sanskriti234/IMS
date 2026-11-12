from pydantic import BaseModel
import uuid

class TeachingAssignmentResponse(BaseModel):
    id: uuid.UUID
    subject_offering_id: uuid.UUID
    faculty_id: uuid.UUID
    is_active: bool

    model_config = {"from_attributes": True}

class SectionMentorAssignmentResponse(BaseModel):
    id: uuid.UUID
    section_id: uuid.UUID
    faculty_id: uuid.UUID
    is_active: bool

    model_config = {"from_attributes": True}

class HODAssignmentResponse(BaseModel):
    id: uuid.UUID
    department_id: uuid.UUID
    faculty_id: uuid.UUID
    is_active: bool

    model_config = {"from_attributes": True}