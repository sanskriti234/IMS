from pydantic import BaseModel
import uuid
from typing import Optional, Dict, Any

class AuditLogCreate(BaseModel):
    user_id: uuid.UUID
    action: str
    target_table: str
    changes: Optional[Dict[str, Any]] = None

class AuditLogResponse(AuditLogCreate):
    id: uuid.UUID

    model_config = {"from_attributes": True}

class MentorshipFollowUpCreate(BaseModel):
    student_id: uuid.UUID
    mentor_id: uuid.UUID
    concern_notes: str
    is_escalated_to_hod: Optional[bool] = False

class MentorshipFollowUpResponse(MentorshipFollowUpCreate):
    id: uuid.UUID

    model_config = {"from_attributes": True}

class NotificationResponse(BaseModel):
    id: uuid.UUID
    recipient_id: uuid.UUID
    title: str
    message: str
    is_read: bool

    model_config = {"from_attributes": True}