from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models import User
from app import schemas, crud
from app.database import get_db
from app.auth import get_current_user
from app.websocket.manager import manager


router = APIRouter(
    prefix="/factories",
    tags=["Factories"],
)


# ---------------------------
# CREATE FACTORY (PRIVATE)
# ---------------------------
@router.post("", response_model=schemas.FactoryResponse)
async def create_factory(
    factory: schemas.FactoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_factory = crud.create_factory(
        db=db,
        factory=factory,
        user_id=current_user.id,
    )

    await manager.broadcast({
        "type": "factory_created",
        "message": f"Factory '{new_factory.name}' created",
        "user_id": current_user.id,
    })

    return new_factory


# ---------------------------
# READ FACTORIES (USER OWNED)
# ---------------------------
@router.get("", response_model=List[schemas.FactoryResponse])
def get_factories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_user_factories(
        db=db,
        user_id=current_user.id,
    )


# ---------------------------
# DELETE FACTORY (OWNERSHIP CHECK)
# ---------------------------
@router.delete("/{factory_id}")
async def delete_factory(
    factory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    deleted = crud.delete_factory(
        db=db,
        factory_id=factory_id,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Factory not found")

    await manager.broadcast({
        "type": "factory_deleted",
        "message": "A factory was deleted",
        "user_id": current_user.id,
    })

    return {"status": True}
