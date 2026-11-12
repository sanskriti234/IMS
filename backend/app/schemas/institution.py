from pydantic import BaseModel
import uuid

class DepartmentResponse(BaseModel):
    id: uuid.UUID
    code: str
    name: str

    model_config = {"from_attributes": True}

class ProgramResponse(BaseModel):
    id: uuid.UUID
    department_id: uuid.UUID
    code: str
    name: str
    total_semesters: int

    model_config = {"from_attributes": True}

class BatchResponse(BaseModel):
    id: uuid.UUID
    program_id: uuid.UUID
    start_year: int
    end_year: int
    name: str

    model_config = {"from_attributes": True}

class SectionResponse(BaseModel):
    id: uuid.UUID
    batch_id: uuid.UUID
    name: str
    capacity_informational: int

    model_config = {"from_attributes": True}