from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.auth import get_current_user
from app.models import User
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ensure user owns the factory
    factory = crud.get_factory_by_id(db, factory_id, current_user.id)
    if not factory:
        raise HTTPException(status_code=403, detail="Not allowed")

    return crud.create_algorithm(
        db=db,
        factory_id=factory_id,
        algorithm=algorithm,
        user_id=current_user.id
    )


# --------------------------------
# GET ALL ALGORITHMS BELONGING TO USER
# --------------------------------
@router.get("/factory/{factory_id}", response_model=List[schemas.AlgorithmResponse])
def get_algorithms(
    factory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ensure user owns the factory
    factory = crud.get_factory_by_id(db, factory_id, current_user.id)
    if not factory:
        raise HTTPException(status_code=403, detail="Not allowed")

    return crud.get_user_algorithms(db, user_id=current_user.id, factory_id=factory_id)


# --------------------------------
# DELETE ALGORITHM — USER OWNED
# --------------------------------
@router.delete("/{algorithm_id}")
def delete_algorithm(
    algorithm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return crud.delete_algorithm(db, algorithm_id, current_user.id)
