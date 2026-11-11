import uuid
from sqlalchemy import ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from sqlalchemy import String

class Subject(Base, TimestampMixin):
    __tablename__ = "subjects"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id"), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    credits: Mapped[int] = mapped_column(nullable=False)

class SubjectOffering(Base, TimestampMixin):
    __tablename__ = "subject_offerings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    subject_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("sections.id"), nullable=False)

class TeachingAssignment(Base, TimestampMixin):
    __tablename__ = "teaching_assignments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    subject_offering_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("subject_offerings.id"), unique=True, nullable=False)
    faculty_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class SectionMentorAssignment(Base, TimestampMixin):
    __tablename__ = "section_mentor_assignments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("sections.id"), nullable=False)
    faculty_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)