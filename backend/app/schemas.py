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


class ModelCreate(ModelBase):
    pass


class ModelResponse(ModelBase):
    id: int
    created_at: datetime
    files: List[ModelFileResponse] = []

    class Config:
        from_attributes = True


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
