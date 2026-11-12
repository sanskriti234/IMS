from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db

from app.models.institution import (
    Department,
    Program,
    Batch,
    Section,
)

from app.schemas.institution import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentStatusUpdate,
    DepartmentResponse,
    ProgramResponse,
    BatchResponse,
    SectionResponse,
)

from app.services.department_service import (
    department_service,
    DepartmentNotFoundError,
    DepartmentCodeConflictError,
)


router = APIRouter(
    prefix="/institution",
    tags=["Institutional Structure"],
)


def handle_department_error(exc: Exception):
    if isinstance(exc, DepartmentNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "DEPARTMENT_NOT_FOUND",
                "message": "Department not found.",
            },
        )

    if isinstance(exc, DepartmentCodeConflictError):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "DEPARTMENT_CODE_EXISTS",
                "message": "Department code already exists.",
            },
        )

    raise exc


# --------------------------------------------------
# DEPARTMENT MANAGEMENT
# --------------------------------------------------

@router.post(
    "/departments",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_department(
    department_in: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await department_service.create_department(
            db,
            code=department_in.code,
            name=department_in.name,
        )
    except (
        DepartmentNotFoundError,
        DepartmentCodeConflictError,
    ) as exc:
        handle_department_error(exc)


@router.get(
    "/departments",
    response_model=List[DepartmentResponse],
)
async def list_departments(
    search: str | None = Query(default=None, max_length=100),
    is_active: bool | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await department_service.list_departments(
        db,
        search=search,
        is_active=is_active,
        offset=offset,
        limit=limit,
    )


@router.get(
    "/departments/{department_id}",
    response_model=DepartmentResponse,
)
async def get_department(
    department_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await department_service.get_department(
            db,
            department_id,
        )
    except DepartmentNotFoundError as exc:
        handle_department_error(exc)


@router.patch(
    "/departments/{department_id}",
    response_model=DepartmentResponse,
)
async def update_department(
    department_id: UUID,
    department_in: DepartmentUpdate,
    db: AsyncSession = Depends(get_db),
):
    update_data = department_in.model_dump(
        exclude_unset=True,
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "EMPTY_UPDATE",
                "message": "Provide at least one field to update.",
            },
        )

    try:
        return await department_service.update_department(
            db,
            department_id,
            update_data,
        )
    except (
        DepartmentNotFoundError,
        DepartmentCodeConflictError,
    ) as exc:
        handle_department_error(exc)


@router.patch(
    "/departments/{department_id}/status",
    response_model=DepartmentResponse,
)
async def update_department_status(
    department_id: UUID,
    status_in: DepartmentStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await department_service.update_status(
            db,
            department_id,
            status_in.is_active,
        )
    except DepartmentNotFoundError as exc:
        handle_department_error(exc)


# --------------------------------------------------
# EXISTING ACADEMIC STRUCTURE READ ENDPOINTS
# --------------------------------------------------

@router.get(
    "/programs",
    response_model=List[ProgramResponse],
)
async def list_programs(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Program).order_by(Program.name.asc())
    )
    return result.scalars().all()


@router.get(
    "/batches",
    response_model=List[BatchResponse],
)
async def list_batches(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Batch).order_by(Batch.start_year.desc())
    )
    return result.scalars().all()


@router.get(
    "/sections",
    response_model=List[SectionResponse],
)
async def list_sections(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Section).order_by(Section.name.asc())
    )
    return result.scalars().all()