from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.institution import Department


class DepartmentRepository:

    async def list(
        self,
        db: AsyncSession,
        *,
        search: str | None = None,
        is_active: bool | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> list[Department]:

        statement = select(Department)

        if search:
            term = f"%{search.strip()}%"
            statement = statement.where(
                or_(
                    Department.name.ilike(term),
                    Department.code.ilike(term),
                )
            )

        if is_active is not None:
            statement = statement.where(
                Department.is_active == is_active
            )

        statement = (
            statement
            .order_by(Department.name.asc())
            .offset(offset)
            .limit(limit)
        )

        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_id(
        self,
        db: AsyncSession,
        department_id: UUID,
    ) -> Department | None:

        result = await db.execute(
            select(Department).where(
                Department.id == department_id
            )
        )

        return result.scalar_one_or_none()

    async def get_by_code(
        self,
        db: AsyncSession,
        code: str,
    ) -> Department | None:

        result = await db.execute(
            select(Department).where(
                Department.code == code
            )
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        db: AsyncSession,
        department: Department,
    ) -> Department:

        db.add(department)
        await db.flush()

        return department

    async def save(
    self,
    db: AsyncSession,
    department: Department,
) -> Department:

        await db.flush()

        # Reload database-generated and expired attributes,
        # including updated_at, within the async session.
        await db.refresh(department)

        return department