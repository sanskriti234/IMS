
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db

from app.schemas.admin_dashboard import (
    AcademicYearOption,
    AdminDashboardResponse,
    AcademicStructureSummary,
    DashboardCounts,
    PendingOperation,
)


router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"],
)


@router.get(
    "",
    response_model=AdminDashboardResponse,
)
async def get_admin_dashboard(
    academic_year_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    # ==================================================
    # 1. ACADEMIC YEAR OPTIONS
    # ==================================================

    year_result = await db.execute(
        text("""
            SELECT
                ay.id,
                ay.name,
                ay.start_date,
                ay.end_date,
                ay.status::text AS status,
                COUNT(DISTINCT acs.id)::int
                    AS academic_session_count
            FROM public.academic_years ay
            LEFT JOIN public.academic_sessions acs
                ON acs.academic_year_id = ay.id
            GROUP BY
                ay.id,
                ay.name,
                ay.start_date,
                ay.end_date,
                ay.status
            ORDER BY
                CASE
                    WHEN ay.status::text = 'active'
                    THEN 0
                    ELSE 1
                END,
                ay.start_date DESC
        """)
    )

    academic_years = [
        AcademicYearOption.model_validate(dict(row))
        for row in year_result.mappings().all()
    ]

    # ==================================================
    # 2. SELECTED ACADEMIC YEAR
    # ==================================================

    selected_year = None

    if academic_year_id is not None:
        selected_year = next(
            (
                year for year in academic_years
                if year.id == academic_year_id
            ),
            None,
        )

        if selected_year is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "ACADEMIC_YEAR_NOT_FOUND",
                    "message": "Academic year not found.",
                },
            )

    elif academic_years:
        selected_year = academic_years[0]

    # ==================================================
    # 3. INSTITUTIONAL COUNTS
    # ==================================================

    department_result = await db.execute(
        text("""
            SELECT COUNT(*)::int
            FROM public.departments
        """)
    )

    faculty_result = await db.execute(
        text("""
            SELECT COUNT(*)::int
            FROM public.faculty_profiles
        """)
    )

    department_count = department_result.scalar_one()
    faculty_count = faculty_result.scalar_one()

    student_count = 0

    if selected_year:
        student_result = await db.execute(
            text("""
                SELECT COUNT(DISTINCT se.student_id)::int
                FROM public.student_enrollments se
                INNER JOIN public.academic_sessions acs
                    ON acs.id = se.academic_session_id
                WHERE acs.academic_year_id = :year_id
                  AND se.status::text = 'active'
            """),
            {"year_id": selected_year.id},
        )

        student_count = student_result.scalar_one()

    counts = DashboardCounts(
        departments=department_count,
        students=student_count,
        faculty=faculty_count,
    )

    # ==================================================
    # 4. ACADEMIC STRUCTURE
    # ==================================================

    program_count = 0
    batch_count = 0
    section_count = 0
    active_semesters: list[int] = []

    if selected_year:
        structure_result = await db.execute(
            text("""
                SELECT
                    COUNT(DISTINCT p.id)::int AS programs,
                    COUNT(DISTINCT b.id)::int AS batches,
                    COUNT(DISTINCT sec.id)::int AS sections
                FROM public.academic_sessions acs
                INNER JOIN public.batches b
                    ON b.id = acs.batch_id
                INNER JOIN public.programs p
                    ON p.id = b.program_id
                LEFT JOIN public.sections sec
                    ON sec.batch_id = b.id
                WHERE acs.academic_year_id = :year_id
            """),
            {"year_id": selected_year.id},
        )

        structure = structure_result.mappings().one()

        program_count = structure["programs"]
        batch_count = structure["batches"]
        section_count = structure["sections"]

        semester_result = await db.execute(
            text("""
                SELECT DISTINCT semester_number
                FROM public.academic_sessions
                WHERE academic_year_id = :year_id
                  AND status::text = 'active'
                ORDER BY semester_number
            """),
            {"year_id": selected_year.id},
        )

        active_semesters = [
            row[0]
            for row in semester_result.all()
        ]

    academic_structure = AcademicStructureSummary(
        departments=department_count,
        programs=program_count,
        batches=batch_count,
        sections=section_count,
        active_semesters=active_semesters,
    )

    # ==================================================
    # 5. PENDING REGISTRATION SUBMISSIONS
    # ==================================================

    pending_registration_count = 0

    if selected_year:
        registration_result = await db.execute(
            text("""
                SELECT COUNT(rs.id)::int
                FROM public.registration_submissions rs
                INNER JOIN public.registration_forms rf
                    ON rf.id = rs.registration_form_id
                INNER JOIN public.academic_sessions acs
                    ON acs.id = rf.academic_session_id
                WHERE acs.academic_year_id = :year_id
                  AND rs.status::text = 'pending'
            """),
            {"year_id": selected_year.id},
        )

        pending_registration_count = (
            registration_result.scalar_one()
        )

    # ==================================================
    # 6. PENDING SECTION TRANSFERS
    # ==================================================

    pending_transfer_count = 0

    if selected_year:
        transfer_result = await db.execute(
            text("""
                SELECT COUNT(str.id)::int
                FROM public.section_transfer_requests str
                INNER JOIN public.student_enrollments se
                    ON se.id = str.enrollment_id
                INNER JOIN public.academic_sessions acs
                    ON acs.id = se.academic_session_id
                WHERE acs.academic_year_id = :year_id
                  AND str.status::text = 'pending'
            """),
            {"year_id": selected_year.id},
        )

        pending_transfer_count = (
            transfer_result.scalar_one()
        )

    # ==================================================
    # 7. PENDING OPERATIONS
    # ==================================================

    pending_operations = [
        PendingOperation(
            key="registration_submissions",
            title="Student enrolment verifications",
            count=pending_registration_count,
            unit="submissions",
            requires_attention=(
                pending_registration_count > 0
            ),
        ),
        PendingOperation(
            key="section_transfers",
            title="Section transfer requests",
            count=pending_transfer_count,
            unit="requests",
            requires_attention=(
                pending_transfer_count > 0
            ),
        ),
    ]

    # ==================================================
    # 8. RESPONSE
    # ==================================================

    return AdminDashboardResponse(
        academic_years=academic_years,
        selected_academic_year=selected_year,
        counts=counts,
        academic_structure=academic_structure,
        pending_operations=pending_operations,
    )
