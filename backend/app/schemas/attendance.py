from pydantic import BaseModel
from datetime import datetime
import uuid
from app.models.attendance import AttendanceStatus, RequestStatus

class AttendanceSessionCreate(BaseModel):
    subject_offering_id: uuid.UUID
    faculty_id: uuid.UUID
    session_date: datetime
    editing_window_closes_at: datetime

class AttendanceSessionResponse(AttendanceSessionCreate):
    id: uuid.UUID

    model_config = {"from_attributes": True}

class AttendanceRecordCreate(BaseModel):
    attendance_session_id: uuid.UUID
    student_id: uuid.UUID
    status: AttendanceStatus

class AttendanceRecordResponse(AttendanceRecordCreate):
    id: uuid.UUID

    model_config = {"from_attributes": True}

class CorrectionRequestCreate(BaseModel):
    attendance_record_id: uuid.UUID
    requested_by: uuid.UUID
    reason: str

class CorrectionRequestResponse(CorrectionRequestCreate):
    id: uuid.UUID
    status: RequestStatus

    model_config = {"from_attributes": True}