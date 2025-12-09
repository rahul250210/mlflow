from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.database import get_db

router = APIRouter(
    prefix="/algorithms",
    tags=["Algorithms"]
)


# --------------------------------
# CREATE ALGORITHM INSIDE FACTORY
# --------------------------------
@router.post("/{factory_id}", response_model=schemas.AlgorithmResponse)
def create_algorithm(
    factory_id: int,
    algorithm: schemas.AlgorithmCreate,
    db: Session = Depends(get_db)
):
    return crud.create_algorithm(db, factory_id, algorithm)


# --------------------------------
# GET ALL ALGORITHMS BY FACTORY
# --------------------------------
@router.get("/factory/{factory_id}", response_model=List[schemas.AlgorithmResponse])
def get_algorithms(factory_id: int, db: Session = Depends(get_db)):
    return crud.get_algorithms_by_factory(db, factory_id)


# --------------------------------
# DELETE ALGORITHM
# --------------------------------
@router.delete("/{algorithm_id}")
def delete_algorithm(algorithm_id: int, db: Session = Depends(get_db)):
    return crud.delete_algorithm(db, algorithm_id)
