from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database.session import get_db
from app.models.registration import RegistrationForm, RegistrationSubmission, SubmissionStatus
from app.schemas.registration import (
    RegistrationFormCreate,
    RegistrationFormResponse,
    SubmissionCreate,
    SubmissionResponse,
    SubmissionReview
)

router = APIRouter(prefix="/registration", tags=["Student Registration & Provisioning"])

@router.post("/forms", response_model=RegistrationFormResponse, status_code=status.HTTP_201_CREATED)
async def create_registration_form(form_in: RegistrationFormCreate, db: AsyncSession = Depends(get_db)):
    """Create a new registration form template for a batch and session."""
    db_form = RegistrationForm(**form_in.model_dump())
    db.add(db_form)
    await db.commit()
    await db.refresh(db_form)
    return db_form

@router.post("/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_registration_form(sub_in: SubmissionCreate, db: AsyncSession = Depends(get_db)):
    """Submit student registration data."""
    db_sub = RegistrationSubmission(**sub_in.model_dump())
    db.add(db_sub)
    await db.commit()
    await db.refresh(db_sub)
    return db_sub

@router.get("/submissions/{form_id}", response_model=List[SubmissionResponse])
async def list_form_submissions(form_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """List all registration submissions for a given form (Mentor view)."""
    result = await db.execute(
        select(RegistrationSubmission).where(RegistrationSubmission.registration_form_id == form_id)
    )
    return result.scalars().all()

@router.put("/submissions/{submission_id}/review", response_model=SubmissionResponse)
async def review_registration_submission(
    submission_id: uuid.UUID,
    review_in: SubmissionReview,
    db: AsyncSession = Depends(get_db)
):
    """Review, approve, or reject a student registration submission (Mentor role check required)."""
    result = await db.execute(
        select(RegistrationSubmission).where(RegistrationSubmission.id == submission_id)
    )
    db_sub = result.scalars().first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Registration submission not found.")

    db_sub.status = review_in.status
    db_sub.reviewed_by = review_in.reviewed_by
    db_sub.review_notes = review_in.review_notes
    
    await db.commit()
    await db.refresh(db_sub)
    return db_sub