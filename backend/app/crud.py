from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Factory, Algorithm, Model, ModelFile
from app import schemas


# ===============================
# FACTORY CRUD
# ===============================

def create_factory(db: Session, factory: schemas.FactoryCreate, user_id: int):
    db_factory = Factory(
        name=factory.name,
        description=factory.description,
        user_id=user_id
    )
    db.add(db_factory)
    db.commit()
    db.refresh(db_factory)
    return db_factory


def get_user_factories(db: Session, user_id: int):
    return (
        db.query(Factory)
        .filter(Factory.user_id == user_id)
        .order_by(Factory.id.desc())
        .all()
    )


def get_factory_by_id(db: Session, factory_id: int, user_id: int):
    return (
        db.query(Factory)
        .filter(Factory.id == factory_id, Factory.user_id == user_id)
        .first()
    )


def delete_factory(db: Session, factory_id: int, user_id: int):
    factory = get_factory_by_id(db, factory_id, user_id)

    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found")

    db.delete(factory)
    db.commit()
    return {"status": True}



# ===============================
# ALGORITHM CRUD
# ===============================

def create_algorithm(db: Session, factory_id: int, algorithm: schemas.AlgorithmCreate, user_id: int):

    # validate factory ownership
    factory = get_factory_by_id(db, factory_id, user_id)
    if not factory:
        raise HTTPException(status_code=403, detail="Not allowed")

    algo = Algorithm(
        name=algorithm.name,
        description=algorithm.description,
        factory_id=factory_id,
        user_id=user_id
    )

    db.add(algo)
    db.commit()
    db.refresh(algo)
    return algo


def get_user_algorithms(db: Session, user_id: int, factory_id: int = None):

    query = db.query(Algorithm).filter(Algorithm.user_id == user_id)

    if factory_id:
        query = query.filter(Algorithm.factory_id == factory_id)

    return query.order_by(Algorithm.id.desc()).all()


def get_algorithm_by_id(db: Session, algorithm_id: int):
    return db.query(Algorithm).filter(Algorithm.id == algorithm_id).first()


def delete_algorithm(db: Session, algorithm_id: int, user_id: int):

    algo = (
        db.query(Algorithm)
        .filter(Algorithm.id == algorithm_id, Algorithm.user_id == user_id)
        .first()
    )

    if not algo:
        raise HTTPException(status_code=404, detail="Algorithm not found")

    db.delete(algo)
    db.commit()
    return {"status": True}



# ===============================
# MODEL CRUD
# ===============================

def create_model(db: Session, algorithm_id: int, model: schemas.ModelCreate, user_id: int):

    # validate algorithm ownership
    algo = (
        db.query(Algorithm)
        .filter(Algorithm.id == algorithm_id, Algorithm.user_id == user_id)
        .first()
    )

    if not algo:
        raise HTTPException(status_code=403, detail="Not allowed")

    db_model = Model(
        name=model.name,
        algorithm_id=algorithm_id,
        user_id=user_id,
    )

    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model



def get_user_models(db: Session, user_id: int, algorithm_id: int = None):

    query = db.query(Model).filter(Model.user_id == user_id)

    if algorithm_id:
        query = query.filter(Model.algorithm_id == algorithm_id)

    return query.order_by(Model.id.desc()).all()


def delete_model(db: Session, model_id: int, user_id: int):

    model = (
        db.query(Model)
        .filter(Model.id == model_id, Model.user_id == user_id)
        .first()
    )

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    db.delete(model)
    db.commit()
    return {"status": True}



# ===============================
# MODEL FILE CRUD
# ===============================

def create_model_file(db: Session, model_id: int, file_data: dict, user_id: int):

    # validate model ownership
    model = (
        db.query(Model)
        .filter(Model.id == model_id, Model.user_id == user_id)
        .first()
    )

    if not model:
        raise HTTPException(status_code=403, detail="Not allowed")

    new_file = ModelFile(
        model_id=model_id,
        file_type=file_data["file_type"],
        file_name=file_data["file_name"],
        file_path=file_data["file_path"],
        file_size=file_data["file_size"],
        user_id=user_id
    )

    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return new_file


def get_files_by_model(db: Session, model_id: int, user_id: int):

    return (
        db.query(ModelFile)
        .filter(ModelFile.model_id == model_id)
        .order_by(ModelFile.id.desc())
        .all()
    )


def delete_model_file(db: Session, file_id: int, user_id: int):

    file = (
        db.query(ModelFile)
        .filter(ModelFile.id == file_id, ModelFile.user_id == user_id)
        .first()
    )

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    db.delete(file)
    db.commit()
    return {"status": True}
