
import uuid
import enum

from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    Boolean,
    ForeignKey,
    Enum as SQLEnum,
    UniqueConstraint,
    CheckConstraint,
    Index,
    DateTime,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class OfferingStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Subject(Base, TimestampMixin):
    __tablename__ = "subjects"

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

    credits: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "department_id",
            "code",
            name="uq_subject_department_code",
        ),
        CheckConstraint(
            "credits > 0",
            name="ck_subject_credits_positive",
        ),
    )


class SubjectOffering(Base, TimestampMixin):
    __tablename__ = "subject_offerings"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    subject_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("subjects.id", ondelete="RESTRICT"),
        nullable=False,
    )

    section_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("sections.id", ondelete="RESTRICT"),
        nullable=False,
    )

    academic_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_sessions.id", ondelete="RESTRICT"),
        nullable=False,
    )

    semester_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[OfferingStatus] = mapped_column(
        SQLEnum(
            OfferingStatus,
            name="offering_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=OfferingStatus.ACTIVE,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "subject_id",
            "section_id",
            "academic_session_id",
            name="uq_subject_offering_section_session",
        ),
        CheckConstraint(
            "semester_number > 0",
            name="ck_offering_semester_positive",
        ),
    )


class TeachingAssignment(Base, TimestampMixin):
    __tablename__ = "teaching_assignments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    subject_offering_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("subject_offerings.id", ondelete="RESTRICT"),
        nullable=False,
    )

    faculty_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("faculty_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    assigned_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "uq_active_teaching_assignment_per_offering",
            "subject_offering_id",
            unique=True,
            postgresql_where=text("is_active IS TRUE"),
        ),
        CheckConstraint(
            "(is_active IS TRUE AND ended_at IS NULL) "
            "OR (is_active IS FALSE AND ended_at IS NOT NULL)",
            name="ck_teaching_assignment_active_ended_at",
        ),
    )


class SectionMentorAssignment(Base, TimestampMixin):
    __tablename__ = "section_mentor_assignments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    section_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("sections.id", ondelete="RESTRICT"),
        nullable=False,
    )

    faculty_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("faculty_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    academic_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_sessions.id", ondelete="RESTRICT"),
        nullable=False,
    )

    assigned_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "uq_active_section_mentor_per_session",
            "section_id",
            "academic_session_id",
            unique=True,
            postgresql_where=text("is_active IS TRUE"),
        ),
        CheckConstraint(
            "(is_active IS TRUE AND ended_at IS NULL) "
            "OR (is_active IS FALSE AND ended_at IS NOT NULL)",
            name="ck_mentor_assignment_active_ended_at",
        ),
    )
