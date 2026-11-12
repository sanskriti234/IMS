
import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    ForeignKey,
    DateTime,
    Enum as SQLEnum,
    Text,
    JSON,
    UniqueConstraint,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"


class RegistrationForm(Base, TimestampMixin):
    __tablename__ = "registration_forms"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    academic_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("academic_sessions.id", ondelete="RESTRICT"),
        nullable=False,
    )

    batch_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("batches.id", ondelete="RESTRICT"),
        nullable=False,
    )

    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    form_schema: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    __table_args__ = (
        Index(
            "ix_registration_form_session_batch",
            "academic_session_id",
            "batch_id",
        ),
    )


class RegistrationSubmission(Base, TimestampMixin):
    __tablename__ = "registration_submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    registration_form_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("registration_forms.id", ondelete="RESTRICT"),
        nullable=False,
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    submission_data: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
)

    status: Mapped[SubmissionStatus] = mapped_column(
        SQLEnum(
            SubmissionStatus,
            name="submission_status",
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        default=SubmissionStatus.PENDING,
        nullable=False,
    )

    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=True,
    )

    review_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    __table_args__ = (
        UniqueConstraint(
            "registration_form_id",
            "student_id",
            name="uq_registration_form_student",
        ),
        Index(
            "ix_registration_submission_status",
            "status",
        ),
        CheckConstraint(
            """
            (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL)
            OR
            (status IN ('approved', 'rejected', 'changes_requested')
                AND reviewed_by IS NOT NULL
                AND reviewed_at IS NOT NULL)
            """,
            name="ck_registration_review_consistency",
        ),
    )
