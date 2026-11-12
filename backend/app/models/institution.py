
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy import (
    DateTime,
    String,
    Integer,
    Index,
    text,
    Boolean,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class Department(Base, TimestampMixin):
    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true"),
    )


class DepartmentHODAssignment(Base, TimestampMixin):
    __tablename__ = "department_hod_assignments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    department_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
    )

    faculty_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("faculty_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    assigned_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),
    ForeignKey("profiles.id", ondelete="RESTRICT"),
    nullable=False,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    __table_args__ = (
        CheckConstraint(
            "(is_active IS TRUE AND ended_at IS NULL) "
            "OR (is_active IS FALSE AND ended_at IS NOT NULL)",
            name="ck_hod_assignment_active_ended_at",
        ),
        Index(
            "uq_one_active_hod_per_department",
            "department_id",
            unique=True,
            postgresql_where=text("is_active IS TRUE"),
        ),
    )


class Program(Base, TimestampMixin):
    __tablename__ = "programs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    department_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
    )

    code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    total_semesters: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "department_id",
            "code",
            name="uq_program_department_code",
        ),
        CheckConstraint(
            "total_semesters > 0",
            name="ck_program_total_semesters_positive",
        ),
    )


class Batch(Base, TimestampMixin):
    __tablename__ = "batches"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    program_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("programs.id", ondelete="RESTRICT"),
        nullable=False,
    )

    start_year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    end_year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    __table_args__ = (
    UniqueConstraint(
        "program_id",
        "start_year",
        "end_year",
        name="uq_batch_program_years",
    ),
    CheckConstraint(
        "end_year > start_year",
        name="ck_batch_valid_year_range",
    ),
)


class Section(Base, TimestampMixin):
    __tablename__ = "sections"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    batch_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("batches.id", ondelete="RESTRICT"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    capacity_informational: Mapped[int] = mapped_column(
        Integer,
        default=60,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "batch_id",
            "name",
            name="uq_section_batch_name",
        ),
        CheckConstraint(
            "capacity_informational > 0",
            name="ck_section_capacity_positive",
        ),
    )
