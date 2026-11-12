from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database.session import get_db
from app.models.attendance import AttendanceSession, AttendanceRecord, AttendanceCorrectionRequest
from app.schemas.attendance import (
    AttendanceSessionCreate,
    AttendanceSessionResponse,
    AttendanceRecordCreate,
    AttendanceRecordResponse,
    CorrectionRequestCreate,
    CorrectionRequestResponse
)

router = APIRouter(prefix="/attendance", tags=["Attendance Management"])

@router.post("/sessions", response_model=AttendanceSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_attendance_session(session_in: AttendanceSessionCreate, db: AsyncSession = Depends(get_db)):
    """Create a new attendance session for an assigned subject offering."""
    db_session = AttendanceSession(**session_in.model_dump())
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

@router.get("/sessions/{session_id}/records", response_model=List[AttendanceRecordResponse])
async def list_session_records(session_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Retrieve attendance records for a specific session."""
    result = await db.execute(
        select(AttendanceRecord).where(AttendanceRecord.attendance_session_id == session_id)
    )
    return result.scalars().all()

@router.post("/records", response_model=AttendanceRecordResponse, status_code=status.HTTP_201_CREATED)
async def record_student_attendance(record_in: AttendanceRecordCreate, db: AsyncSession = Depends(get_db)):
    """Record or update individual student attendance for a session."""
    db_record = AttendanceRecord(**record_in.model_dump())
    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)
    return db_record

@router.post("/corrections", response_model=CorrectionRequestResponse, status_code=status.HTTP_201_CREATED)
async def request_attendance_correction(req_in: CorrectionRequestCreate, db: AsyncSession = Depends(get_db)):
    """Submit an attendance correction request after the editing window has closed."""
    db_req = AttendanceCorrectionRequest(**req_in.model_dump())
    db.add(db_req)
    await db.commit()
    await db.refresh(db_req)
    return db_req