from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.institution import Department, Program, Batch, Section
from app.schemas.institution import (
    DepartmentResponse,
    ProgramResponse,
    BatchResponse,
    SectionResponse
)

router = APIRouter(prefix="/institution", tags=["Institutional Structure"])

@router.get("/departments", response_model=List[DepartmentResponse])
async def list_departments(db: AsyncSession = Depends(get_db)):
    """Retrieve all institutional departments."""
    result = await db.execute(select(Department))
    return result.scalars().all()

@router.get("/programs", response_model=List[ProgramResponse])
async def list_programs(db: AsyncSession = Depends(get_db)):
    """Retrieve all academic programs across departments."""
    result = await db.execute(select(Program))
    return result.scalars().all()

@router.get("/batches", response_model=List[BatchResponse])
async def list_batches(db: AsyncSession = Depends(get_db)):
    """Retrieve all student batches."""
    result = await db.execute(select(Batch))
    return result.scalars().all()

@router.get("/sections", response_model=List[SectionResponse])
async def list_sections(db: AsyncSession = Depends(get_db)):
    """Retrieve all institutional sections."""
    result = await db.execute(select(Section))
    return result.scalars().all()