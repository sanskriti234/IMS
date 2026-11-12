from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.assignments import TeachingAssignment, SectionMentorAssignment
from app.models.institution import DepartmentHODAssignment
from app.schemas.assignments import (
    TeachingAssignmentResponse,
    SectionMentorAssignmentResponse,
    HODAssignmentResponse
)

router = APIRouter(prefix="/assignments", tags=["Faculty & Institutional Assignments"])

@router.get("/teaching", response_model=List[TeachingAssignmentResponse])
async def list_teaching_assignments(db: AsyncSession = Depends(get_db)):
    """Retrieve all active and historical course teaching assignments."""
    result = await db.execute(select(TeachingAssignment))
    return result.scalars().all()

@router.get("/mentorship", response_model=List[SectionMentorAssignmentResponse])
async def list_mentorship_assignments(db: AsyncSession = Depends(get_db)):
    """Retrieve all section mentorship assignments."""
    result = await db.execute(select(SectionMentorAssignment))
    return result.scalars().all()

@router.get("/hod", response_model=List[HODAssignmentResponse])
async def list_hod_assignments(db: AsyncSession = Depends(get_db)):
    """Retrieve department Head of Department (HOD) assignments."""
    result = await db.execute(select(DepartmentHODAssignment))
    return result.scalars().all()