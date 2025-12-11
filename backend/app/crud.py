from sqlalchemy.orm import Session
from fastapi import HTTPException

from app import models, schemas


# --------------------------------
# FACTORY CRUD
# --------------------------------
def create_factory(db: Session, factory: schemas.FactoryCreate):
    existing = db.query(models.Factory).filter(models.Factory.name == factory.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Factory already exists")

    new_factory = models.Factory(name=factory.name, description=factory.description)
    db.add(new_factory)
    db.commit()
    db.refresh(new_factory)
    return new_factory


def get_all_factories(db: Session):
    return db.query(models.Factory).all()


def get_factory_by_id(db: Session, factory_id: int):
    return db.query(models.Factory).filter(models.Factory.id == factory_id).first()


def delete_factory(db: Session, factory_id: int):
    factory = db.query(models.Factory).filter(models.Factory.id == factory_id).first()
    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found")

    db.delete(factory)
    db.commit()
    return {"message": "Factory deleted successfully"}


# --------------------------------
# ALGORITHM CRUD
# --------------------------------
def create_algorithm(db: Session, factory_id: int, algorithm: schemas.AlgorithmCreate):
    factory = get_factory_by_id(db, factory_id)
    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found")

    new_algo = models.Algorithm(
        factory_id=factory_id,
        name=algorithm.name,
        description=algorithm.description
    )
    db.add(new_algo)
    db.commit()
    db.refresh(new_algo)
    return new_algo


def get_algorithms_by_factory(db: Session, factory_id: int):
    return db.query(models.Algorithm).filter(models.Algorithm.factory_id == factory_id).all()


def delete_algorithm(db: Session, algorithm_id: int):
    algo = db.query(models.Algorithm).filter(models.Algorithm.id == algorithm_id).first()
    if not algo:
        raise HTTPException(status_code=404, detail="Algorithm not found")

    db.delete(algo)
    db.commit()
    return {"message": "Algorithm deleted successfully"}


# --------------------------------
# MODEL CRUD
# --------------------------------
def create_model(db: Session, algorithm_id: int, model: schemas.ModelCreate):
    algo = db.query(models.Algorithm).filter(models.Algorithm.id == algorithm_id).first()
    if not algo:
        raise HTTPException(status_code=404, detail="Algorithm not found")

    new_model = models.Model(
        algorithm_id=algorithm_id,
        name=model.name,
        description=model.description
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    return new_model


def get_models_by_algorithm(db: Session, algorithm_id: int):
    return db.query(models.Model).filter(models.Model.algorithm_id == algorithm_id).all()


def delete_model(db: Session, model_id: int):
    model = db.query(models.Model).filter(models.Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    db.delete(model)
    db.commit()
    return {"message": "Model deleted successfully"}


# --------------------------------
# MODEL FILE CRUD
# --------------------------------
def create_model_file(db: Session, model_id: int, file_data: dict):
    model = db.query(models.Model).filter(models.Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    new_file = models.ModelFile(
        model_id=model_id,
        file_type=file_data["file_type"],
        file_name=file_data["file_name"],
        file_path=file_data["file_path"],
        file_size=file_data["file_size"]
    )

    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return new_file


def get_files_by_model(db: Session, model_id: int):
    return db.query(models.ModelFile).filter(models.ModelFile.model_id == model_id).all()


def delete_model_file(db: Session, file_id: int):
    file = db.query(models.ModelFile).filter(models.ModelFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    db.delete(file)
    db.commit()
    return {"message": "File deleted successfully"}
