from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# -------------------------------
# FACTORY TABLE
# -------------------------------
class Factory(Base):
    __tablename__ = "factories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    algorithms = relationship("Algorithm", back_populates="factory", cascade="all, delete")


# -------------------------------
# ALGORITHM TABLE
# -------------------------------
class Algorithm(Base):
    __tablename__ = "algorithms"

    id = Column(Integer, primary_key=True, index=True)
    factory_id = Column(Integer, ForeignKey("factories.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    factory = relationship("Factory", back_populates="algorithms")
    models = relationship("Model", back_populates="algorithm", cascade="all, delete")


# -------------------------------
# MODEL TABLE
# -------------------------------
class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    algorithm_id = Column(Integer, ForeignKey("algorithms.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    algorithm = relationship("Algorithm", back_populates="models")
    files = relationship("ModelFile", back_populates="model", cascade="all, delete")


# -------------------------------
# MODEL FILES TABLE
# -------------------------------
class ModelFile(Base):
    __tablename__ = "model_files"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("models.id", ondelete="CASCADE"))

    file_type = Column(String(50), nullable=False)  
    # Values: dataset, model_file, metrics, python_code, other

    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    model = relationship("Model", back_populates="files")
