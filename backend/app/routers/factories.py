from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.database import get_db

router = APIRouter(
    prefix="/factories",
    tags=["Factories"]
)


# --------------------------------
# CREATE FACTORY
# --------------------------------
@router.post("/", response_model=schemas.FactoryResponse)
def create_factory(factory: schemas.FactoryCreate, db: Session = Depends(get_db)):
    return crud.create_factory(db, factory)


# --------------------------------
# GET ALL FACTORIES
# --------------------------------
@router.get("/", response_model=List[schemas.FactoryResponse])
def get_factories(db: Session = Depends(get_db)):
    return crud.get_all_factories(db)


# --------------------------------
# DELETE FACTORY
# --------------------------------
@router.delete("/{factory_id}")
def delete_factory(factory_id: int, db: Session = Depends(get_db)):
    return crud.delete_factory(db, factory_id)
