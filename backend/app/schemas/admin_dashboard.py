
from datetime import date
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AcademicYearOption(BaseModel):
    id: UUID
    name: str
    start_date: date
    end_date: date
    status: str
    academic_session_count: int

    model_config = ConfigDict(from_attributes=True)


class DashboardCounts(BaseModel):
    departments: int
    students: int
    faculty: int


class AcademicStructureSummary(BaseModel):
    departments: int
    programs: int
    batches: int
    sections: int
    active_semesters: list[int]


class PendingOperation(BaseModel):
    key: Literal[
        "registration_submissions",
        "section_transfers",
    ]
    title: str
    count: int
    unit: str
    requires_attention: bool


class AdminDashboardResponse(BaseModel):
    academic_years: list[AcademicYearOption]
    selected_academic_year: AcademicYearOption | None
    counts: DashboardCounts
    academic_structure: AcademicStructureSummary
    pending_operations: list[PendingOperation]
