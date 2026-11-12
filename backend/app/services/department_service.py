from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.institution import Department
from app.repositories.department_repository import (
    DepartmentRepository,
)


class DepartmentNotFoundError(Exception):
    pass


class DepartmentCodeConflictError(Exception):
    pass


class DepartmentService:

    def __init__(self):
        self.repository = DepartmentRepository()

    async def list_departments(
        self,
        db: AsyncSession,
        *,
        search: str | None = None,
        is_active: bool | None = None,
        offset: int = 0,
        limit: int = 50,
    ):

        return await self.repository.list(
            db,
            search=search,
            is_active=is_active,
            offset=offset,
            limit=limit,
        )

    async def get_department(
        self,
        db: AsyncSession,
        department_id: UUID,
    ):

        department = await self.repository.get_by_id(
            db,
            department_id,
        )

        if department is None:
            raise DepartmentNotFoundError

        return department

    async def create_department(
        self,
        db: AsyncSession,
        *,
        code: str,
        name: str,
    ):

        existing = await self.repository.get_by_code(
            db,
            code,
        )

        if existing:
            raise DepartmentCodeConflictError

        department = Department(
            code=code,
            name=name,
            is_active=True,
        )

        try:
            return await self.repository.create(
                db,
                department,
            )

        except IntegrityError as exc:
            await db.rollback()
            raise DepartmentCodeConflictError from exc

    async def update_department(
        self,
        db: AsyncSession,
        department_id: UUID,
        update_data: dict,
    ):

        department = await self.get_department(
            db,
            department_id,
        )

        new_code = update_data.get("code")

        if new_code and new_code != department.code:
            existing = await self.repository.get_by_code(
                db,
                new_code,
            )

            if existing:
                raise DepartmentCodeConflictError

            department.code = new_code

        if "name" in update_data:
            department.name = update_data["name"]

        try:
            return await self.repository.save(
                db,
                department,
            )

        except IntegrityError as exc:
            await db.rollback()
            raise DepartmentCodeConflictError from exc

    async def update_status(
        self,
        db: AsyncSession,
        department_id: UUID,
        is_active: bool,
    ):

        department = await self.get_department(
            db,
            department_id,
        )

        department.is_active = is_active

        return await self.repository.save(
            db,
            department,
        )


department_service = DepartmentService()