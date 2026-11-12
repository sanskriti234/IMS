
import uuid
import enum

from datetime import date, datetime

from sqlalchemy import (
    String,
    Integer,
    Date,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
    UniqueConstraint,
    CheckConstraint,
    Index,
    Boolean,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class AcademicYearStatus(str, enum.Enum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"


class AcademicSessionStatus(str, enum.Enum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    TRANSFERRED = "transferred"
    COMPLETED = "completed"
    WITHDRAWN = "withdrawn"


class TransferRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class AcademicYear(Base, TimestampMixin):
    __tablename__ = "academic_years"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    status: Mapped[AcademicYearStatus] = mapped_column(
        SQLEnum(
            AcademicYearStatus,
            name="academic_year_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=AcademicYearStatus.PLANNED,
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "end_date > start_date",
            name="ck_academic_year_valid_dates",
        ),
    )


class AcademicSession(Base, TimestampMixin):
    __tablename__ = "academic_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    academic_year_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_years.id", ondelete="RESTRICT"),
        nullable=False,
    )

    batch_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("batches.id", ondelete="RESTRICT"),
        nullable=False,
    )

    semester_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    status: Mapped[AcademicSessionStatus] = mapped_column(
        SQLEnum(
            AcademicSessionStatus,
            name="academic_session_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=AcademicSessionStatus.PLANNED,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "batch_id",
            "academic_year_id",
            "semester_number",
            name="uq_batch_academic_year_semester",
        ),
        CheckConstraint(
            "semester_number > 0",
            name="ck_academic_sessions_semester_number"
        ),
        CheckConstraint(
            "end_date > start_date",
            name="ck_academic_session_valid_dates",
        ),
        Index(
            "ix_academic_session_batch_status",
            "batch_id",
            "status",
        ),
    )


class StudentEnrollment(Base, TimestampMixin):
    __tablename__ = "student_enrollments"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    academic_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_sessions.id", ondelete="RESTRICT"),
        nullable=False,
    )

    section_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("sections.id", ondelete="RESTRICT"),
        nullable=False,
    )

    status: Mapped[EnrollmentStatus] = mapped_column(
        SQLEnum(
            EnrollmentStatus,
            name="enrollment_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=EnrollmentStatus.ACTIVE,
        nullable=False,
    )

    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "uq_active_student_enrollment_per_session",
            "student_id",
            "academic_session_id",
            unique=True,
            postgresql_where=text("status = 'active'"),
        ),
        CheckConstraint(
            """
            (status = 'active' AND ended_at IS NULL)
            OR
            (status != 'active' AND ended_at IS NOT NULL)
            """,
            name="ck_enrollment_status_dates",
        ),
        Index(
            "ix_enrollment_section_session",
            "section_id",
            "academic_session_id",
        ),
    )


class SectionTransferRequest(Base, TimestampMixin):
    __tablename__ = "section_transfer_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    enrollment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("student_enrollments.id", ondelete="RESTRICT"),
        nullable=False,
    )

    target_section_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("sections.id", ondelete="RESTRICT"),
        nullable=False,
    )

    requested_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
    )

    status: Mapped[TransferRequestStatus] = mapped_column(
        SQLEnum(
            TransferRequestStatus,
            name="transfer_request_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=TransferRequestStatus.PENDING,
        nullable=False,
    )

    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=True,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    review_notes: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "uq_pending_transfer_per_enrollment",
            "enrollment_id",
            unique=True,
            postgresql_where=text("status = 'pending'"),
        ),
        CheckConstraint(
            """
            (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL)
            OR
            (status IN ('approved', 'rejected')
                AND reviewed_by IS NOT NULL
                AND reviewed_at IS NOT NULL)
            """,
            name="ck_transfer_request_review_consistency",
        ),
    )
