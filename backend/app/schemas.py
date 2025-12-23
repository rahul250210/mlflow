from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# --------------------------------
# MODEL FILE SCHEMAS
# --------------------------------
class ModelFileBase(BaseModel):
    file_type: str
    file_name: str
    file_path: str
    file_size: int


class ModelFileCreate(ModelFileBase):
    pass


class ModelFileResponse(ModelFileBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------------
# MODEL SCHEMAS
# --------------------------------
class ModelBase(BaseModel):
    name: str
    description: Optional[str] = None


class ModelCreate(BaseModel):
    name: str
    description: Optional[str] = None
    version_number: int = 1
    stage: str = "development"
    notes: Optional[str] = None
    tags: Optional[str] = None


class ModelResponse(ModelBase):
    id: int
    created_at: datetime

    version_number: int | None = None
    stage: str | None = None
    notes: str | None = None
    tags: str | None = None

    files: List[ModelFileResponse] = []

    class Config:
        from_attributes = True

class ModelUpdate(BaseModel):
    name: str
    description: Optional[str]
    tags: Optional[str]
    notes: Optional[str]

# --------------------------------
# ALGORITHM SCHEMAS
# --------------------------------
class AlgorithmBase(BaseModel):
    name: str
    description: Optional[str] = None


class AlgorithmCreate(AlgorithmBase):
    pass


class AlgorithmResponse(AlgorithmBase):
    id: int
    created_at: datetime
    models: List[ModelResponse] = []

    class Config:
        from_attributes = True


# --------------------------------
# FACTORY SCHEMAS
# --------------------------------
class FactoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class FactoryCreate(FactoryBase):
    pass


class FactoryResponse(FactoryBase):
    id: int
    created_at: datetime
    algorithms: List[AlgorithmResponse] = []

    class Config:
        from_attributes = True




class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str   


class VersionCreate(BaseModel):
    version_number: int = 1
    stage: str = "development"
    notes: Optional[str] = None
    tags: Optional[str] = None


class VersionResponse(BaseModel):
    id: int
    version_number: int
    stage: str
    notes: Optional[str]
    tags: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
