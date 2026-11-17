
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.database.session import get_db

from app.models.institution import (
    Department,
    Program,
    Batch,
    Section,
)

from app.schemas.institution import (
    AcademicYearCreate,
    AcademicYearResponse,
    AcademicSessionCreate,
    AcademicSessionResponse,
    DepartmentResponse,
    ProgramResponse,
    BatchResponse,
    SectionResponse,
    SectionCreate,
    SectionUpdate,
)

from app.services.academic_service import (
    academic_service,
    AcademicNotFoundError,
    AcademicConflictError,
    AcademicValidationError,
    DefaultProgramNotFoundError,
)


institution_router = APIRouter()


# ============================================================
# EXCEPTION HANDLING
# ============================================================

def handle_academic_exception(exc: Exception):
    if isinstance(exc, AcademicNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    if isinstance(exc, DefaultProgramNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    if isinstance(exc, AcademicValidationError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    if isinstance(exc, AcademicConflictError):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    raise exc


# ============================================================
# ACADEMIC YEAR ENDPOINTS
# ============================================================

@institution_router.get(
    "/institution/academic-years",
    response_model=list[AcademicYearResponse],
    tags=["Academic Management"],
)
async def list_academic_years(
    db: AsyncSession = Depends(get_db),
):
    return await academic_service.list_academic_years(db)


@institution_router.post(
    "/institution/academic-years",
    response_model=AcademicYearResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Academic Management"],
)
async def create_academic_year(
    payload: AcademicYearCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        year = await academic_service.create_academic_year(
            db,
            payload,
        )

        return AcademicYearResponse(
            id=year.id,
            name=year.name,
            start_date=year.start_date,
            end_date=year.end_date,
            status=year.status.value,
            academic_session_count=0,
            created_at=year.created_at,
            updated_at=year.updated_at,
        )

    except (
        AcademicNotFoundError,
        AcademicConflictError,
        AcademicValidationError,
        DefaultProgramNotFoundError,
    ) as exc:
        handle_academic_exception(exc)


# ============================================================
# ACADEMIC SESSION ENDPOINTS
# ============================================================

@institution_router.get(
    "/institution/academic-sessions",
    response_model=list[AcademicSessionResponse],
    tags=["Academic Management"],
)
async def list_academic_sessions(
    academic_year_id: UUID | None = Query(default=None),
    batch_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    return await academic_service.list_academic_sessions(
        db,
        academic_year_id=academic_year_id,
        batch_id=batch_id,
    )


@institution_router.post(
    "/institution/academic-sessions",
    response_model=AcademicSessionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Academic Management"],
)
async def create_academic_session(
    payload: AcademicSessionCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await academic_service.create_academic_session(
            db,
            payload,
        )

    except (
        AcademicNotFoundError,
        AcademicConflictError,
        AcademicValidationError,
        DefaultProgramNotFoundError,
    ) as exc:
        handle_academic_exception(exc)


# ============================================================
# DEPARTMENT ENDPOINT
# ============================================================

@institution_router.get(
    "/institution/departments",
    response_model=list[DepartmentResponse],
    tags=["Institution Management"],
)
async def list_departments(
    db: AsyncSession = Depends(get_db),
):
    result = await db.scalars(
        select(Department)
        .where(Department.is_active.is_(True))
        .order_by(Department.name)
    )

    return result.all()


# ============================================================
# PROGRAM ENDPOINT
# ============================================================

@institution_router.get(
    "/institution/programs",
    response_model=list[ProgramResponse],
    tags=["Institution Management"],
)
async def list_programs(
    department_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Program)

    if department_id:
        query = query.where(
            Program.department_id == department_id
        )

    result = await db.scalars(
        query.order_by(Program.name)
    )

    return result.all()


# ============================================================
# BATCH ENDPOINT
# ============================================================

@institution_router.get(
    "/institution/batches",
    response_model=list[BatchResponse],
    tags=["Institution Management"],
)
async def list_batches(
    program_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Batch)

    if program_id:
        query = query.where(
            Batch.program_id == program_id
        )

    result = await db.scalars(
        query.order_by(Batch.start_year.desc())
    )

    return result.all()


# ============================================================
# SECTION MANAGEMENT
# Sections belong to batches, not academic sessions.
# ============================================================

@institution_router.get(
    "/institution/sections",
    response_model=list[SectionResponse],
    tags=["Institution Management"],
)
async def list_sections(
    batch_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Section)

    if batch_id:
        query = query.where(
            Section.batch_id == batch_id
        )

    result = await db.scalars(
        query.order_by(Section.batch_id, Section.name)
    )

    return result.all()


@institution_router.post(
    "/institution/sections",
    response_model=SectionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Institution Management"],
)
async def create_section(
    payload: SectionCreate,
    db: AsyncSession = Depends(get_db),
):
    # 1. Verify that the parent batch exists.
    batch = await db.scalar(
        select(Batch).where(
            Batch.id == payload.batch_id
        )
    )

    if batch is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The selected batch does not exist.",
        )

    # 2. Check for an existing section with this name.
    existing_section = await db.scalar(
        select(Section).where(
            Section.batch_id == payload.batch_id,
            Section.name == payload.name,
        )
    )

    if existing_section:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Section {payload.name} already exists "
                f"in batch {batch.name}."
            ),
        )

    # 3. Create section.
    section = Section(
        batch_id=payload.batch_id,
        name=payload.name,
        capacity_informational=payload.capacity_informational,
    )

    db.add(section)

    try:
        await db.flush()
        await db.refresh(section)

    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Section could not be created. "
                "A section with this name may already exist "
                "in the selected batch."
            ),
        ) from exc

    return section


@institution_router.get(
    "/institution/sections/{section_id}",
    response_model=SectionResponse,
    tags=["Institution Management"],
)
async def get_section(
    section_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    section = await db.scalar(
        select(Section).where(
            Section.id == section_id
        )
    )

    if section is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found.",
        )

    return section


@institution_router.patch(
    "/institution/sections/{section_id}",
    response_model=SectionResponse,
    tags=["Institution Management"],
)
async def update_section(
    section_id: UUID,
    payload: SectionUpdate,
    db: AsyncSession = Depends(get_db),
):
    section = await db.scalar(
        select(Section).where(
            Section.id == section_id
        )
    )

    if section is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found.",
        )

    changes = payload.model_dump(exclude_unset=True)

    # Section remains attached to its original batch.
    if "name" in changes:
        duplicate = await db.scalar(
            select(Section).where(
                Section.batch_id == section.batch_id,
                Section.name == changes["name"],
                Section.id != section.id,
            )
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Section {changes['name']} already exists "
                    "in this batch."
                ),
            )

    for field, value in changes.items():
        setattr(section, field, value)

    try:
        await db.flush()
        await db.refresh(section)

    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Section update conflicts with an existing record.",
        ) from exc

    return section
