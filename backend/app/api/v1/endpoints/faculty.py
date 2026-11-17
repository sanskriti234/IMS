
import logging
import secrets
import string
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.institution import Department

# IMPORTANT:
# Change this import to the actual module containing your Profile,
# FacultyProfile and RoleType classes.
from app.models.identity import Profile, FacultyProfile, RoleType
from app.schemas.faculty import FacultyCreate, FacultyResponse
from app.core.supabase_admin import (
    supabase_admin,
    SupabaseAdminError,
)
from app.services.email_service import send_faculty_credentials_email
from app.core.security import require_role

router = APIRouter(prefix="/faculty", tags=["Faculty"])
logger = logging.getLogger(__name__)


def generate_temporary_password(length: int = 16) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%&*"

    while True:
        password = "".join(
            secrets.choice(alphabet) for _ in range(length)
        )

        if (
            any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in "!@#$%&*" for c in password)
        ):
            return password


@router.post(
    "",
    response_model=FacultyResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_faculty(
    payload: FacultyCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(
        require_role(RoleType.ADMIN)
    ),
):
    email = str(payload.email).strip().lower()
    employee_code = payload.employee_code.strip()
    full_name = payload.full_name.strip()
    designation = payload.designation.strip()

    if not all((email, employee_code, full_name, designation)):
        raise HTTPException(
            status_code=422,
            detail="Faculty details cannot be blank.",
        )

    department_result = await db.execute(
        select(Department).where(
            Department.id == payload.department_id
        )
    )
    department = department_result.scalar_one_or_none()

    if department is None:
        raise HTTPException(
            status_code=404,
            detail="Selected department was not found.",
        )

    email_result = await db.execute(
        select(Profile).where(Profile.email == email)
    )
    if email_result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    employee_result = await db.execute(
        select(FacultyProfile).where(
            FacultyProfile.employee_code == employee_code
        )
    )
    if employee_result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="This employee code is already registered.",
        )

    temporary_password = generate_temporary_password()
    auth_user_id = None

    try:
        auth_user = await supabase_admin.create_user(
            email=email,
            password=temporary_password,
            full_name=full_name,
        )
        auth_user_id = auth_user["id"]

        profile = Profile(
            id=UUID(auth_user_id),
            email=email,
            full_name=full_name,
            role_type=RoleType.FACULTY,
        )

        db.add(profile)
        await db.flush()

        faculty = FacultyProfile(
            profile_id=profile.id,
            employee_code=employee_code,
            designation=designation,
            department_id=payload.department_id,
        )

        db.add(faculty)
        await db.flush()

        # Commit before scheduling the email.
        # The get_db dependency may also commit on successful exit;
        # a subsequent commit on an already committed session is harmless.
        await db.commit()
        await db.refresh(faculty)

    except SupabaseAdminError as exc:
        await db.rollback()

        logger.error(
            "Supabase Auth account creation failed: %s",
            str(exc),
        )

        raise HTTPException(
            status_code=502,
            detail="Could not create the faculty login account. Check backend logs.",
        ) from exc

    except IntegrityError as exc:
        await db.rollback()

        if auth_user_id:
            try:
                await supabase_admin.delete_user(auth_user_id)
            except Exception:
                logger.exception(
                    "Could not clean up Supabase Auth user %s",
                    auth_user_id,
                )

        raise HTTPException(
            status_code=409,
            detail="Faculty email or employee code conflicts with an existing record.",
        ) from exc

    except Exception as exc:
        await db.rollback()

        if auth_user_id:
            try:
                await supabase_admin.delete_user(auth_user_id)
            except Exception:
                logger.exception(
                    "Could not clean up Supabase Auth user %s",
                    auth_user_id,
                )

        logger.exception("Faculty provisioning failed")

        raise HTTPException(
            status_code=500,
            detail="Faculty account provisioning failed.",
        ) from exc

    background_tasks.add_task(
        send_faculty_credentials_email,
        recipient=email,
        faculty_name=full_name,
        designation=designation,
        department=department.name,
        employee_code=employee_code,
        temporary_password=temporary_password,
    )

    return FacultyResponse(
        id=faculty.id,
        profile_id=profile.id,
        full_name=profile.full_name,
        email=profile.email,
        employee_code=faculty.employee_code,
        designation=faculty.designation,
        department_id=faculty.department_id,
    )


@router.get("", response_model=list[FacultyResponse])
async def list_faculty(
    department_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: Profile = Depends(
        require_role(RoleType.ADMIN)
    ),
):
    query = (
        select(FacultyProfile, Profile)
        .join(Profile, FacultyProfile.profile_id == Profile.id)
    )

    if department_id:
        query = query.where(
            FacultyProfile.department_id == department_id
        )

    result = await db.execute(
        query.order_by(Profile.full_name)
    )

    rows = result.all()

    return [
        FacultyResponse(
            id=faculty.id,
            profile_id=profile.id,
            full_name=profile.full_name,
            email=profile.email,
            employee_code=faculty.employee_code,
            designation=faculty.designation,
            department_id=faculty.department_id,
        )
        for faculty, profile in rows
    ]
