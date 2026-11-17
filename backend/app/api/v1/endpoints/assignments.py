
from datetime import datetime, timezone
from typing import List
from uuid import UUID
from app.schemas.assignments import (
    SubjectOfferingOptionResponse,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db

from app.models.assignments import (
    OfferingStatus,
    Subject,
    SubjectOffering,
    TeachingAssignment,
    SectionMentorAssignment,
)

from app.models.academic import (
    AcademicSession,
    AcademicSessionStatus,
)

from app.models.institution import (
    Section,
    Batch,
    Program,
)

from app.models.identity import (
    FacultyProfile,
    Profile,
    RoleType,
)

from app.core.security import require_role

from app.schemas.assignments import (
    TeachingAssignmentCreate,
    TeachingAssignmentResponse,
    TeachingAssignmentDetailResponse,
    SectionMentorAssignmentCreate,
    SectionMentorAssignmentResponse,
)

from app.models.assignments import AcademicSessionSubject

from app.schemas.assignments import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse,
    AcademicSessionSubjectCreate,
    AcademicSessionSubjectResponse,
    SubjectOfferingSyncResponse,
    SubjectOfferingStatusUpdate,
)

router = APIRouter(
    prefix="/assignments",
    tags=["Faculty Assignments"],
)


# ============================================================
# SHARED VALIDATION
# ============================================================

async def get_valid_faculty(
    faculty_id: UUID,
    db: AsyncSession,
) -> FacultyProfile:
    result = await db.execute(
        select(FacultyProfile)
        .join(
            Profile,
            Profile.id == FacultyProfile.profile_id,
        )
        .where(
            FacultyProfile.id == faculty_id,
            Profile.role_type == RoleType.FACULTY,
        )
    )

    faculty = result.scalar_one_or_none()

    if faculty is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty member not found.",
        )

    return faculty


def validate_assignable_session(
    academic_session: AcademicSession,
    expected_batch_id: UUID,
) -> None:
    if academic_session.batch_id != expected_batch_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Academic session does not belong to the section's batch.",
        )

    if academic_session.status not in (
        AcademicSessionStatus.PLANNED,
        AcademicSessionStatus.ACTIVE,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignments are allowed only for planned or active academic sessions.",
        )


async def commit_assignment(db: AsyncSession) -> None:
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An active assignment already exists for this offering "
                "or section and academic session."
            ),
        )


# ============================================================
# TEACHING ASSIGNMENTS
# ============================================================

@router.post(
    "/teaching",
    response_model=TeachingAssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_teaching_assignment(
    payload: TeachingAssignmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    faculty = await get_valid_faculty(
        payload.faculty_id,
        db,
    )

    # Load the offering and its department/batch relationships.
    result = await db.execute(
        select(
            SubjectOffering,
            Subject,
            Section,
            Batch,
            Program,
            AcademicSession,
        )
        .join(
            Subject,
            Subject.id == SubjectOffering.subject_id,
        )
        .join(
            Section,
            Section.id == SubjectOffering.section_id,
        )
        .join(
            Batch,
            Batch.id == Section.batch_id,
        )
        .join(
            Program,
            Program.id == Batch.program_id,
        )
        .join(
            AcademicSession,
            AcademicSession.id == SubjectOffering.academic_session_id,
        )
        .where(
            SubjectOffering.id == payload.subject_offering_id,
        )
    )

    row = result.one_or_none()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject offering not found.",
        )

    offering, subject, section, batch, program, academic_session = row

    if offering.status != OfferingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot assign faculty to an inactive subject offering.",
        )

    validate_assignable_session(
        academic_session,
        section.batch_id,
    )

    if offering.semester_number != academic_session.semester_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject offering semester does not match academic session semester.",
        )

    # Faculty, subject and section program must belong
    # to the same department.
    if not (
        faculty.department_id
        == subject.department_id
        == program.department_id
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Faculty, subject and section must belong to the same department.",
        )

    assignment = TeachingAssignment(
        subject_offering_id=offering.id,
        faculty_id=faculty.id,
        assigned_by=current_user.id,
        is_active=True,
        ended_at=None,
    )

    db.add(assignment)

    await commit_assignment(db)
    await db.refresh(assignment)

    return assignment


@router.get(
    "/teaching",
    response_model=List[TeachingAssignmentDetailResponse],
)
async def list_teaching_assignments(
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    result = await db.execute(
        select(
            TeachingAssignment,
            SubjectOffering,
            Subject,
            Section,
        )
        .join(
            SubjectOffering,
            SubjectOffering.id == TeachingAssignment.subject_offering_id,
        )
        .join(
            Subject,
            Subject.id == SubjectOffering.subject_id,
        )
        .join(
            Section,
            Section.id == SubjectOffering.section_id,
        )
        .order_by(TeachingAssignment.created_at.desc())
    )

    rows = result.all()

    return [
        TeachingAssignmentDetailResponse(
            id=assignment.id,
            subject_offering_id=offering.id,
            faculty_id=assignment.faculty_id,
            assigned_by=assignment.assigned_by,

            subject_id=subject.id,
            subject_code=subject.code,
            subject_name=subject.name,

            section_id=section.id,
            section_name=section.name,

            academic_session_id=offering.academic_session_id,
            semester_number=offering.semester_number,

            is_active=assignment.is_active,
            ended_at=assignment.ended_at,
            created_at=assignment.created_at,
            updated_at=assignment.updated_at,
        )
        for assignment, offering, subject, section in rows
    ]


@router.patch(
    "/teaching/{assignment_id}/revoke",
    response_model=TeachingAssignmentResponse,
)
async def revoke_teaching_assignment(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    result = await db.execute(
        select(TeachingAssignment).where(
            TeachingAssignment.id == assignment_id
        )
    )

    assignment = result.scalar_one_or_none()

    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teaching assignment not found.",
        )

    if not assignment.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Teaching assignment has already been revoked.",
        )

    assignment.is_active = False
    assignment.ended_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(assignment)

    return assignment


# ============================================================
# MENTORSHIP ASSIGNMENTS
# ============================================================

@router.post(
    "/mentorship",
    response_model=SectionMentorAssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_mentorship_assignment(
    payload: SectionMentorAssignmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    faculty = await get_valid_faculty(
        payload.faculty_id,
        db,
    )

    # Load section, batch and program.
    result = await db.execute(
        select(Section, Batch, Program)
        .join(
            Batch,
            Batch.id == Section.batch_id,
        )
        .join(
            Program,
            Program.id == Batch.program_id,
        )
        .where(
            Section.id == payload.section_id,
        )
    )

    section_row = result.one_or_none()

    if section_row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found.",
        )

    section, batch, program = section_row

    # Validate academic session.
    session_result = await db.execute(
        select(AcademicSession).where(
            AcademicSession.id == payload.academic_session_id,
        )
    )

    academic_session = session_result.scalar_one_or_none()

    if academic_session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic session not found.",
        )

    validate_assignable_session(
        academic_session,
        section.batch_id,
    )

    if faculty.department_id != program.department_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Faculty and section must belong to the same department.",
        )

    assignment = SectionMentorAssignment(
        section_id=section.id,
        faculty_id=faculty.id,
        academic_session_id=academic_session.id,
        assigned_by=current_user.id,
        is_active=True,
        ended_at=None,
    )

    db.add(assignment)

    await commit_assignment(db)
    await db.refresh(assignment)

    return assignment


@router.get(
    "/mentorship",
    response_model=List[SectionMentorAssignmentResponse],
)
async def list_mentorship_assignments(
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    result = await db.execute(
        select(SectionMentorAssignment).order_by(
            SectionMentorAssignment.created_at.desc()
        )
    )

    return result.scalars().all()


@router.patch(
    "/mentorship/{assignment_id}/revoke",
    response_model=SectionMentorAssignmentResponse,
)
async def revoke_mentorship_assignment(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    result = await db.execute(
        select(SectionMentorAssignment).where(
            SectionMentorAssignment.id == assignment_id
        )
    )

    assignment = result.scalar_one_or_none()

    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentorship assignment not found.",
        )

    if not assignment.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Mentorship assignment has already been revoked.",
        )

    assignment.is_active = False
    assignment.ended_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(assignment)

    return assignment



# ============================================================
# SUBJECT CATALOGUE
# ============================================================

@router.post(
    "/subjects",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_subject(
    payload: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    # Verify department.
    department = await db.scalar(
        select(Program.department_id).where(
            Program.department_id == payload.department_id
        ).limit(1)
    )

    # A department can exist without a program, so verify Department itself.
    from app.models.institution import Department

    department_exists = await db.scalar(
        select(Department.id).where(
            Department.id == payload.department_id
        )
    )

    if department_exists is None:
        raise HTTPException(404, "Department not found.")

    existing = await db.scalar(
        select(Subject).where(
            Subject.department_id == payload.department_id,
            Subject.code == payload.code.strip(),
        )
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A subject with this code already exists in this department.",
        )

    subject = Subject(
        department_id=payload.department_id,
        code=payload.code.strip(),
        name=payload.name.strip(),
        credits=payload.credits,
    )

    db.add(subject)

    try:
        await db.flush()
        await db.refresh(subject)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Subject code already exists or subject data violates a database constraint.",
        ) from exc

    return subject


@router.get(
    "/subjects",
    response_model=list[SubjectResponse],
)
async def list_subjects(
    department_id: UUID | None = None,
    include_archived: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    query = select(Subject)

    if department_id:
        query = query.where(
            Subject.department_id == department_id
        )

    if not include_archived:
        query = query.where(
            Subject.is_active.is_(True)
        )

    result = await db.scalars(
        query.order_by(Subject.code)
    )

    return result.all()


@router.patch(
    "/subjects/{subject_id}",
    response_model=SubjectResponse,
)
async def update_subject(
    subject_id: UUID,
    payload: SubjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    subject = await db.scalar(
        select(Subject).where(
            Subject.id == subject_id
        )
    )

    if subject is None:
        raise HTTPException(404, "Subject not found.")

    changes = payload.model_dump(exclude_unset=True)

    if "code" in changes and changes["code"] is not None:
        changes["code"] = changes["code"].strip()

        duplicate = await db.scalar(
            select(Subject).where(
                Subject.department_id == subject.department_id,
                Subject.code == changes["code"],
                Subject.id != subject.id,
            )
        )

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail="Another subject already uses this code.",
            )

    if "name" in changes and changes["name"] is not None:
        changes["name"] = changes["name"].strip()

    for field, value in changes.items():
        setattr(subject, field, value)

    try:
        await db.flush()
        await db.refresh(subject)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Subject update conflicts with an existing record.",
        ) from exc

    return subject


@router.delete(
    "/subjects/{subject_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_subject(
    subject_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    """
    Permanently delete an unused subject.
    Archive a subject if it is referenced by curriculum or offerings.
    Historical academic records are preserved.
    """

    # Lock the subject row to prevent concurrent modifications.
    subject = await db.scalar(
        select(Subject)
        .where(Subject.id == subject_id)
        .with_for_update()
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found.",
        )

    if not subject.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Subject is already archived.",
        )

    # Check curriculum references.
    curriculum_reference = await db.scalar(
        select(AcademicSessionSubject.id)
        .where(
            AcademicSessionSubject.subject_id == subject_id
        )
        .limit(1)
    )

    # Check section-specific offering references.
    offering_reference = await db.scalar(
        select(SubjectOffering.id)
        .where(
            SubjectOffering.subject_id == subject_id
        )
        .limit(1)
    )

    # Preserve academic history when references exist.
    if curriculum_reference or offering_reference:
        subject.is_active = False

        try:
            await db.commit()
        except IntegrityError as exc:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Subject could not be archived.",
            ) from exc

        return {
            "success": True,
            "action": "archived",
            "message": (
                "Subject archived successfully. "
                "Existing curriculum, offerings and historical records "
                "have been preserved."
            ),
            "subject_id": str(subject.id),
        }

    # No academic references: permanently delete.
    try:
        await db.delete(subject)
        await db.commit()

    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Subject cannot be permanently deleted because "
                "other academic records reference it."
            ),
        ) from exc

    return {
        "success": True,
        "action": "deleted",
        "message": "Subject permanently deleted.",
        "subject_id": str(subject_id),
    }


# ============================================================
# SEMESTER CURRICULUM + OFFERING SYNCHRONIZATION
# ============================================================

@router.post(
    "/sessions/{session_id}/subjects",
    response_model=SubjectOfferingSyncResponse,
    status_code=status.HTTP_201_CREATED,
)
async def sync_session_subjects(
    session_id: UUID,
    payload: AcademicSessionSubjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    """
    Allocate subjects to an academic session and generate
    section-specific offerings for every section in its batch.
    """

    if not payload.subject_ids:
        raise HTTPException(
            status_code=422,
            detail="At least one subject must be selected.",
        )

    if len(payload.subject_ids) != len(set(payload.subject_ids)):
        raise HTTPException(
            status_code=422,
            detail="Duplicate subject IDs are not allowed.",
        )

    try:
        # 1. Load academic session.
        academic_session = await db.scalar(
            select(AcademicSession)
            .where(AcademicSession.id == session_id)
            .with_for_update()
        )

        if academic_session is None:
            raise HTTPException(404, "Academic session not found.")

        if academic_session.status not in (
            AcademicSessionStatus.PLANNED,
            AcademicSessionStatus.ACTIVE,
        ):
            raise HTTPException(
                status_code=400,
                detail="Curriculum can only be modified for planned or active sessions.",
            )

        # 2. Load batch and program to determine department.
        result = await db.execute(
            select(Batch, Program)
            .join(Program, Program.id == Batch.program_id)
            .where(Batch.id == academic_session.batch_id)
        )

        batch_row = result.one_or_none()

        if batch_row is None:
            raise HTTPException(
                status_code=404,
                detail="The academic session's batch or program was not found.",
            )

        batch, program = batch_row

        # 3. Load and validate selected subjects.
        subjects_result = await db.scalars(
            select(Subject).where(
                Subject.id.in_(payload.subject_ids)
            )
        )

        subjects = subjects_result.all()

        if len(subjects) != len(payload.subject_ids):
            raise HTTPException(
                status_code=404,
                detail="One or more selected subjects do not exist.",
            )

        invalid_subjects = [
            subject.code
            for subject in subjects
            if (
                subject.department_id != program.department_id
                or not subject.is_active
            )
        ]

        if invalid_subjects:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": (
                        "All subjects must be active and belong "
                        "to the batch's department."
                    ),
                    "invalid_subject_codes": invalid_subjects,
                },
            )


        # 4. Load every section belonging to the batch.
        sections_result = await db.scalars(
            select(Section)
            .where(Section.batch_id == batch.id)
            .order_by(Section.name)
            .with_for_update()
        )

        sections = sections_result.all()

        if not sections:
            raise HTTPException(
                status_code=409,
                detail="Cannot allocate subjects because this batch has no sections.",
            )

        # 5. Load existing curriculum associations.
        existing_links_result = await db.scalars(
            select(AcademicSessionSubject).where(
                AcademicSessionSubject.academic_session_id == session_id,
                AcademicSessionSubject.subject_id.in_(payload.subject_ids),
            )
        )

        existing_links = {
            link.subject_id: link
            for link in existing_links_result.all()
        }

        # 6. Load existing section-specific offerings.
        subject_ids = [subject.id for subject in subjects]
        section_ids = [section.id for section in sections]

        existing_offerings_result = await db.scalars(
            select(SubjectOffering).where(
                SubjectOffering.academic_session_id == session_id,
                SubjectOffering.subject_id.in_(subject_ids),
                SubjectOffering.section_id.in_(section_ids),
            )
        )

        existing_offerings = {
            (offering.subject_id, offering.section_id): offering
            for offering in existing_offerings_result.all()
        }

        subjects_added = 0
        offerings_created = 0
        offerings_existing = 0

        # 7. Create curriculum links and offerings.
        for subject in subjects:

            if subject.id not in existing_links:
                db.add(
                    AcademicSessionSubject(
                        academic_session_id=session_id,
                        subject_id=subject.id,
                    )
                )
                subjects_added += 1

            for section in sections:
                key = (subject.id, section.id)

                if key in existing_offerings:
                    offerings_existing += 1

                    # Do not silently reactivate a cancelled offering.
                    continue

                db.add(
                    SubjectOffering(
                        subject_id=subject.id,
                        section_id=section.id,
                        academic_session_id=session_id,
                        semester_number=academic_session.semester_number,
                        status=OfferingStatus.ACTIVE,
                    )
                )

                offerings_created += 1

        # 8. Flush before returning. The transaction is committed
        # by get_db() when the request completes successfully.
        await db.flush()

        return SubjectOfferingSyncResponse(
            academic_session_id=session_id,
            subjects_added=subjects_added,
            offerings_created=offerings_created,
            offerings_existing=offerings_existing,
        )

    except IntegrityError as exc:
        await db.rollback()

        raise HTTPException(
            status_code=409,
            detail=(
                "Curriculum synchronization conflicted with existing "
                "database records. No partial changes were retained."
            ),
        ) from exc

    except Exception:
        await db.rollback()
        raise


@router.get(
    "/sessions/{session_id}/subjects",
    response_model=list[AcademicSessionSubjectResponse],
)
async def list_session_subjects(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    session_exists = await db.scalar(
        select(AcademicSession.id).where(
            AcademicSession.id == session_id
        )
    )

    if session_exists is None:
        raise HTTPException(404, "Academic session not found.")

    result = await db.scalars(
        select(AcademicSessionSubject)
        .where(
            AcademicSessionSubject.academic_session_id == session_id
        )
        .order_by(AcademicSessionSubject.created_at)
    )

    return result.all()

@router.delete(
    "/sessions/{session_id}/subjects/{subject_id}",
    status_code=status.HTTP_200_OK,
)
async def remove_session_subject(
    session_id: UUID,
    subject_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    """
    Remove a subject from one academic session.

    Deletes:
    - The semester-level curriculum association.
    - Its section-specific offerings in this session,
      provided they have no teaching assignment history.

    Preserves:
    - The master Subject catalogue record.
    - Allocations in other academic sessions.
    - Historical academic records.
    """

    try:
        # 1. Lock and validate the academic session.
        academic_session = await db.scalar(
            select(AcademicSession)
            .where(AcademicSession.id == session_id)
            .with_for_update()
        )

        if academic_session is None:
            raise HTTPException(
                status_code=404,
                detail="Academic session not found.",
            )

        if academic_session.status not in (
            AcademicSessionStatus.PLANNED,
            AcademicSessionStatus.ACTIVE,
        ):
            raise HTTPException(
                status_code=409,
                detail=(
                    "Subjects can only be removed from planned "
                    "or active academic sessions."
                ),
            )

        # 2. Lock the exact curriculum association.
        curriculum_link = await db.scalar(
            select(AcademicSessionSubject)
            .where(
                AcademicSessionSubject.academic_session_id == session_id,
                AcademicSessionSubject.subject_id == subject_id,
            )
            .with_for_update()
        )

        if curriculum_link is None:
            raise HTTPException(
                status_code=404,
                detail="Subject is not allocated to this academic session.",
            )

        # 3. Find offerings belonging ONLY to this session and subject.
        offerings_result = await db.scalars(
            select(SubjectOffering)
            .where(
                SubjectOffering.academic_session_id == session_id,
                SubjectOffering.subject_id == subject_id,
            )
            .with_for_update()
        )

        offerings = offerings_result.all()
        offering_ids = [offering.id for offering in offerings]

        # 4. Preserve teaching assignment history.
        if offering_ids:
            assignment_exists = await db.scalar(
                select(TeachingAssignment.id)
                .where(
                    TeachingAssignment.subject_offering_id.in_(offering_ids)
                )
                .limit(1)
            )

            if assignment_exists is not None:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        "This subject has teaching assignment history. "
                        "Revoke active assignments and resolve its "
                        "academic records before removing it."
                    ),
                )

        # 5. Delete offerings for this session only.
        for offering in offerings:
            await db.delete(offering)

        # 6. Delete the semester-level curriculum association.
        await db.delete(curriculum_link)

        await db.commit()

        return {
            "success": True,
            "message": "Subject removed from the academic session successfully.",
            "academic_session_id": str(session_id),
            "subject_id": str(subject_id),
            "offerings_removed": len(offerings),
        }

    except HTTPException:
        await db.rollback()
        raise

    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail=(
                "Subject cannot be removed because related academic "
                "records still reference its offerings."
            ),
        ) from exc

    except Exception:
        await db.rollback()
        raise


@router.get(
    "/subject-offerings/available",
    response_model=List[SubjectOfferingOptionResponse],
)
async def list_available_subject_offerings(
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    result = await db.execute(
        select(
            SubjectOffering.id.label("id"),
            Subject.id.label("subject_id"),
            Subject.code.label("subject_code"),
            Subject.name.label("subject_name"),
            Section.id.label("section_id"),
            Section.name.label("section_name"),
            SubjectOffering.academic_session_id,
            SubjectOffering.semester_number,
            SubjectOffering.status,
        )
        .join(
            Subject,
            Subject.id == SubjectOffering.subject_id,
        )
        .join(
            Section,
            Section.id == SubjectOffering.section_id,
        )
        .join(
            AcademicSession,
            AcademicSession.id == SubjectOffering.academic_session_id,
        )
        .where(
            SubjectOffering.status == OfferingStatus.ACTIVE,
            Subject.is_active.is_(True),
            AcademicSession.status.in_(
                [
                    AcademicSessionStatus.PLANNED,
                    AcademicSessionStatus.ACTIVE,
                ]
            ),
        )
        .order_by(
            SubjectOffering.semester_number,
            Section.name,
            Subject.code,
        )
    )

    return [
        SubjectOfferingOptionResponse(**row)
        for row in result.mappings().all()
    ]

# ============================================================
# SUBJECT OFFERING STATUS MANAGEMENT
# ============================================================

@router.patch(
    "/subject-offerings/{offering_id}/status",
    response_model=SubjectOfferingOptionResponse,
)
async def update_subject_offering_status(
    offering_id: UUID,
    payload: SubjectOfferingStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(require_role(RoleType.ADMIN)),
):
    offering = await db.scalar(
        select(SubjectOffering)
        .where(SubjectOffering.id == offering_id)
        .with_for_update()
    )

    if offering is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject offering not found.",
        )

    if offering.status == payload.status:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Subject offering already has this status.",
        )

    if offering.status != OfferingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A completed or cancelled offering cannot be changed.",
        )

    if payload.status not in (
        OfferingStatus.COMPLETED,
        OfferingStatus.CANCELLED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subject offering status transition.",
        )

    active_assignment = await db.scalar(
        select(TeachingAssignment.id).where(
            TeachingAssignment.subject_offering_id == offering_id,
            TeachingAssignment.is_active.is_(True),
        )
    )

    if active_assignment is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Revoke the active teaching assignment before "
                "completing or cancelling this offering."
            ),
        )

    offering.status = payload.status

    await db.flush()

    result = await db.execute(
        select(
            SubjectOffering.id.label("id"),
            Subject.id.label("subject_id"),
            Subject.code.label("subject_code"),
            Subject.name.label("subject_name"),
            Section.id.label("section_id"),
            Section.name.label("section_name"),
            SubjectOffering.academic_session_id,
            SubjectOffering.semester_number,
            SubjectOffering.status,
        )
        .join(
            Subject,
            Subject.id == SubjectOffering.subject_id,
        )
        .join(
            Section,
            Section.id == SubjectOffering.section_id,
        )
        .where(SubjectOffering.id == offering_id)
    )

    row = result.mappings().one()

    return SubjectOfferingOptionResponse(**row)