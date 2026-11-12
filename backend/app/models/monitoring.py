
import uuid
from datetime import datetime

from sqlalchemy import (
    ForeignKey,
    String,
    Text,
    JSON,
    Boolean,
    DateTime,
    Index,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    target_table: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    target_id: Mapped[uuid.UUID | None] = mapped_column(
        nullable=True,
    )

    changes: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("ix_audit_log_user_timestamp", "user_id", "timestamp"),
        Index("ix_audit_log_target", "target_table", "target_id"),
    )


class MentorshipFollowUp(Base, TimestampMixin):
    __tablename__ = "mentorship_follow_ups"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    student_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    mentor_assignment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(
            "section_mentor_assignments.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    concern_notes: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    is_escalated_to_hod: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    escalated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    escalated_to: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "ix_mentorship_followup_student",
            "student_id",
        ),
    )


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    recipient_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    read_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "ix_notification_recipient_read",
            "recipient_id",
            "is_read",
        ),
    )
