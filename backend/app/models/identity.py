import uuid
from sqlalchemy import String, Enum as SQLEnum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
import enum

class RoleType(str, enum.Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student"

class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role_type: Mapped[RoleType] = mapped_column(SQLEnum(RoleType), nullable=False)

class FacultyProfile(Base, TimestampMixin):
    __tablename__ = "faculty_profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(unique=True, nullable=False)
    employee_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    department_id: Mapped[uuid.UUID] = mapped_column(nullable=False)

class StudentProfile(Base, TimestampMixin):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(unique=True, nullable=False)
    enrollment_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    current_batch_id: Mapped[uuid.UUID] = mapped_column(nullable=False)