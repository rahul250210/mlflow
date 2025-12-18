from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

# -------------------------------
# FACTORY TABLE
# -------------------------------
class Factory(Base):
    __tablename__ = "factories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="factories")
    algorithms = relationship(
        "Algorithm",
        back_populates="factory",
        cascade="all, delete"
    )


# -------------------------------
# ALGORITHM TABLE
# -------------------------------
class Algorithm(Base):
    __tablename__ = "algorithms"   # ✅ FIXED

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)

    factory_id = Column(Integer, ForeignKey("factories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    factory = relationship("Factory", back_populates="algorithms")
    user = relationship("User", backref="algorithms")
    models = relationship(
        "Model",
        back_populates="algorithm",
        cascade="all, delete"
    )


# -------------------------------
# MODEL TABLE
# -------------------------------
class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    version = Column(String)

    algorithm_id = Column(Integer, ForeignKey("algorithms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    algorithm = relationship("Algorithm", back_populates="models")
    user = relationship("User", backref="models")

    files = relationship(                # ✅ FIXED
        "ModelFile",
        back_populates="model",
        cascade="all, delete"
    )


# -------------------------------
# MODEL FILES TABLE
# -------------------------------
class ModelFile(Base):
    __tablename__ = "model_files"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(
        Integer,
        ForeignKey("models.id", ondelete="CASCADE"),
        nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_type = Column(String(50), nullable=False)
    # dataset | model_file | metrics | python_code

    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    model = relationship("Model", back_populates="files")
    user= relationship("User", backref="files")