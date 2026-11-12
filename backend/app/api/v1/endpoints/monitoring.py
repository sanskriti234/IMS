from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database.session import get_db
from app.models.monitoring import AuditLog, MentorshipFollowUp, Notification
from app.schemas.monitoring import (
    AuditLogCreate,
    AuditLogResponse,
    MentorshipFollowUpCreate,
    MentorshipFollowUpResponse,
    NotificationResponse
)

router = APIRouter(prefix="/monitoring", tags=["Audit, Monitoring & Notifications"])

@router.post("/audit-logs", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED)
async def create_audit_log(log_in: AuditLogCreate, db: AsyncSession = Depends(get_db)):
    """Record an append-only audit log entry."""
    db_log = AuditLog(**log_in.model_dump())
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log

@router.post("/follow-ups", response_model=MentorshipFollowUpResponse, status_code=status.HTTP_201_CREATED)
async def create_mentorship_follow_up(fu_in: MentorshipFollowUpCreate, db: AsyncSession = Depends(get_db)):
    """Record a mentee follow-up note or escalation to HOD."""
    db_fu = MentorshipFollowUp(**fu_in.model_dump())
    db.add(db_fu)
    await db.commit()
    await db.refresh(db_fu)
    return db_fu

@router.get("/notifications/{recipient_id}", response_model=List[NotificationResponse])
async def list_user_notifications(recipient_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Retrieve notifications for a specific user profile."""
    result = await db.execute(
        select(Notification).where(Notification.recipient_id == recipient_id)
    )
    return result.scalars().all()