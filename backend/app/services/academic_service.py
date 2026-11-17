
from uuid import UUID, uuid4

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.academic import (
    AcademicYear,
    AcademicSession,
    AcademicYearStatus,
    AcademicSessionStatus,
)

from app.models.institution import (
    Department,
    Program,
    Batch,
)


# ============================================================
# DOMAIN RULES
# ============================================================

DEFAULT_PROGRAM_CODE = "BTECH"


# ============================================================
# EXCEPTIONS
# ============================================================

class AcademicNotFoundError(Exception):
    pass


class AcademicConflictError(Exception):
    pass


class AcademicValidationError(Exception):
    pass


class DefaultProgramNotFoundError(Exception):
    pass


# ============================================================
# ACADEMIC SERVICE
# ============================================================

class AcademicService:

    # --------------------------------------------------------
    # ENUM CONVERSION
    # --------------------------------------------------------

    @staticmethod
    def _enum_value(enum_class, value):
        if isinstance(value, enum_class):
            return value

        return enum_class(value)

    # --------------------------------------------------------
    # ACADEMIC YEARS
    # --------------------------------------------------------

    async def list_academic_years(
        self,
        db: AsyncSession,
    ):
        result = await db.execute(
            select(
                AcademicYear,
                func.count(AcademicSession.id).label(
                    "academic_session_count"
                ),
            )
            .outerjoin(
                AcademicSession,
                AcademicSession.academic_year_id == AcademicYear.id,
            )
            .group_by(AcademicYear.id)
            .order_by(AcademicYear.start_date.desc())
        )

        responses = []

        for year, session_count in result.all():
            responses.append({
                "id": year.id,
                "name": year.name,
                "start_date": year.start_date,
                "end_date": year.end_date,
                "status": year.status.value,
                "academic_session_count": session_count,
                "created_at": year.created_at,
                "updated_at": year.updated_at,
            })

        return responses

    async def create_academic_year(
        self,
        db: AsyncSession,
        payload,
    ):
        if payload.end_date <= payload.start_date:
            raise AcademicValidationError(
                "Academic year end date must be after its start date."
            )

        existing = await db.scalar(
            select(AcademicYear).where(
                AcademicYear.name == payload.name
            )
        )

        if existing:
            raise AcademicConflictError(
                "Academic year already exists."
            )

        year = AcademicYear(
            name=payload.name,
            start_date=payload.start_date,
            end_date=payload.end_date,
            status=self._enum_value(
                AcademicYearStatus,
                payload.status,
            ),
        )

        try:
            async with db.begin_nested():
                db.add(year)
                await db.flush()

        except IntegrityError as exc:
            raise AcademicConflictError(
                "Academic year conflicts with an existing database record."
            ) from exc

        await db.refresh(year)

        return year

    # --------------------------------------------------------
    # DEFAULT PROGRAMME RESOLUTION
    # --------------------------------------------------------

    async def get_default_program(
        self,
        db: AsyncSession,
        department_id: UUID,
    ):
        department = await db.get(
            Department,
            department_id,
        )

        if not department:
            raise AcademicNotFoundError(
                "Department not found."
            )

        if not department.is_active:
            raise AcademicValidationError(
                "Cannot create an academic batch for an inactive department."
            )

        result = await db.scalars(
            select(Program).where(
                Program.department_id == department_id,
                Program.code == DEFAULT_PROGRAM_CODE,
            )
        )

        program = result.one_or_none()

        if not program:
            raise DefaultProgramNotFoundError(
                "Default B.Tech programme not found for this department. "
                "Verify the programme setup in the database."
            )

        if program.total_semesters < 1:
            raise AcademicValidationError(
                "The programme must have at least one semester configured."
            )

        return department, program

    # --------------------------------------------------------
    # BATCH LOOKUP
    # --------------------------------------------------------

    async def get_existing_batch(
        self,
        db: AsyncSession,
        program_id: UUID,
        academic_year: AcademicYear,
    ):
        start_year = academic_year.start_date.year
        end_year = academic_year.end_date.year

        return await db.scalar(
            select(Batch).where(
                Batch.program_id == program_id,
                Batch.start_year == start_year,
                Batch.end_year == end_year,
            )
        )

    # --------------------------------------------------------
    # AUTOMATIC BATCH CREATION / REUSE
    # --------------------------------------------------------

    async def create_or_get_batch(
        self,
        db: AsyncSession,
        department_id: UUID,
        academic_year: AcademicYear,
    ):
        department, program = await self.get_default_program(
            db,
            department_id,
        )

        start_year = academic_year.start_date.year
        end_year = academic_year.end_date.year

        if end_year <= start_year:
            raise AcademicValidationError(
                "Invalid academic year range for batch creation."
            )

        existing_batch = await self.get_existing_batch(
            db,
            program.id,
            academic_year,
        )

        if existing_batch:
            return existing_batch

        batch_name = (
            f"{department.code} "
            f"{start_year}-{str(end_year)[-2:]}"
        )

        batch = Batch(
            id=uuid4(),
            program_id=program.id,
            start_year=start_year,
            end_year=end_year,
            name=batch_name,
        )

        try:
            async with db.begin_nested():
                db.add(batch)
                await db.flush()

        except IntegrityError:
            existing_batch = await self.get_existing_batch(
                db,
                program.id,
                academic_year,
            )

            if existing_batch:
                return existing_batch

            raise AcademicConflictError(
                "Batch could not be created because of a database conflict."
            )

        await db.refresh(batch)

        return batch

    # --------------------------------------------------------
    # SEMESTER PROGRESSION VALIDATION
    # --------------------------------------------------------

    async def validate_semester_progression(
        self,
        db: AsyncSession,
        batch_id: UUID,
        academic_year_id: UUID,
        semester_number: int,
        total_semesters: int,
    ):
        """
        Rules:

        1. If this batch has no semester history for the selected
           academic year, admin can initialize it with ANY valid
           semester.

        2. Once initialized, only the semester immediately after
           the latest configured semester can be created.

        3. The latest configured semester must be COMPLETED before
           the next semester can be created.

        4. A semester cannot be created more than once.
        """

        # Validate programme semester limit.

        if not 1 <= semester_number <= total_semesters:
            raise AcademicValidationError(
                f"Semester number must be between 1 and "
                f"{total_semesters}."
            )

        # Check whether the requested semester already exists.

        duplicate = await db.scalar(
            select(AcademicSession.id).where(
                AcademicSession.batch_id == batch_id,
                AcademicSession.academic_year_id == academic_year_id,
                AcademicSession.semester_number == semester_number,
            )
        )

        if duplicate:
            raise AcademicConflictError(
                f"Semester {semester_number} already exists "
                "for this batch and academic year."
            )

        # Find the latest configured semester for this batch
        # and academic year.

        latest_session = await db.scalar(
            select(AcademicSession)
            .where(
                AcademicSession.batch_id == batch_id,
                AcademicSession.academic_year_id == academic_year_id,
            )
            .order_by(
                AcademicSession.semester_number.desc(),
                AcademicSession.created_at.desc(),
            )
            .limit(1)
        )

        # INITIALIZATION CASE:
        # No semester has been configured yet.
        # Admin may choose any valid starting semester.

        if latest_session is None:
            return

        latest_semester = latest_session.semester_number

        # The latest configured semester must be completed
        # before progression is allowed.

        if latest_session.status != AcademicSessionStatus.COMPLETED:
            raise AcademicValidationError(
                f"Semester {latest_semester} is currently "
                f"{latest_session.status.value.upper()}. "
                f"Mark Semester {latest_semester} as COMPLETED "
                "before creating the next semester."
            )

        # Do not allow progression beyond the programme limit.

        if latest_semester >= total_semesters:
            raise AcademicValidationError(
                "All semesters configured for this programme "
                "have already been completed."
            )

        expected_semester = latest_semester + 1

        # Only the immediate next semester is permitted.

        if semester_number != expected_semester:
            raise AcademicValidationError(
                f"The latest configured semester is Semester "
                f"{latest_semester}. Only Semester "
                f"{expected_semester} can be created next."
            )

    # --------------------------------------------------------
    # ACADEMIC SESSION LIST
    # --------------------------------------------------------

    async def list_academic_sessions(
        self,
        db: AsyncSession,
        *,
        academic_year_id: UUID | None = None,
        batch_id: UUID | None = None,
    ):
        query = select(AcademicSession)

        if academic_year_id:
            query = query.where(
                AcademicSession.academic_year_id == academic_year_id
            )

        if batch_id:
            query = query.where(
                AcademicSession.batch_id == batch_id
            )

        query = query.order_by(
            AcademicSession.semester_number.asc(),
            AcademicSession.start_date.asc(),
        )

        result = await db.scalars(query)

        return result.all()

    # --------------------------------------------------------
    # CREATE ACADEMIC SESSION
    # --------------------------------------------------------

    async def create_academic_session(
        self,
        db: AsyncSession,
        payload,
    ):
        # 1. Validate academic year.

        year = await db.get(
            AcademicYear,
            payload.academic_year_id,
        )

        if not year:
            raise AcademicNotFoundError(
                "Academic year not found."
            )

        # 2. Validate semester dates.

        if payload.end_date <= payload.start_date:
            raise AcademicValidationError(
                "Semester end date must be after its start date."
            )

        if (
            payload.start_date < year.start_date
            or payload.end_date > year.end_date
        ):
            raise AcademicValidationError(
                "Semester dates must fall within "
                "the selected academic year."
            )

        # 3. Resolve department and programme.

        department, program = await self.get_default_program(
            db,
            payload.department_id,
        )

        # 4. Find or create the cohort batch.

        batch = await self.get_existing_batch(
            db,
            program.id,
            year,
        )

        if not batch:
            batch = await self.create_or_get_batch(
                db,
                payload.department_id,
                year,
            )

        # 5. Lock the batch row during progression validation.
        # This helps prevent concurrent session creation for
        # the same batch from bypassing progression checks.

        locked_batch = await db.scalar(
            select(Batch)
            .where(Batch.id == batch.id)
            .with_for_update()
        )

        if not locked_batch:
            raise AcademicNotFoundError(
                "Batch not found."
            )

        # 6. Validate semester number and progression.

        await self.validate_semester_progression(
            db=db,
            batch_id=locked_batch.id,
            academic_year_id=year.id,
            semester_number=payload.semester_number,
            total_semesters=program.total_semesters,
        )

        # 7. Validate requested session status.

        requested_status = self._enum_value(
            AcademicSessionStatus,
            payload.status,
        )

        if requested_status == AcademicSessionStatus.COMPLETED:
            raise AcademicValidationError(
                "A new semester cannot be created directly as completed. "
                "Create it first and mark it completed after its completion."
            )

        # 8. Create academic session.

        session = AcademicSession(
            academic_year_id=year.id,
            batch_id=locked_batch.id,
            semester_number=payload.semester_number,
            start_date=payload.start_date,
            end_date=payload.end_date,
            status=requested_status,
        )

        try:
            async with db.begin_nested():
                db.add(session)
                await db.flush()

        except IntegrityError as exc:
            raise AcademicConflictError(
                "Academic session conflicts with an existing "
                "database constraint. The semester may already exist."
            ) from exc

        await db.refresh(session)

        return session


# ============================================================
# SERVICE INSTANCE
# ============================================================

academic_service = AcademicService()
