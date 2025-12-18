from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Factory, Algorithm, Model
from app.auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# =============================
# USER DASHBOARD STATS
# =============================
@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "factories": (
            db.query(Factory)
            .filter(Factory.user_id == current_user.id)
            .count()
        ),
        "algorithms": (
            db.query(Algorithm)
            .filter(Algorithm.user_id == current_user.id)
            .count()
        ),
        "models": (
            db.query(Model)
            .filter(Model.user_id == current_user.id)
            .count()
        )
    }

# =============================
# MODELS PER FACTORY (USER ONLY)
# =============================
@router.get("/models-per-factory")
def models_per_factory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    rows = (
        db.query(
            Factory.name.label("name"),
            func.count(Model.id).label("count"),
        )
        .join(Algorithm, Algorithm.factory_id == Factory.id)
        .join(Model, Model.algorithm_id == Algorithm.id)

        # 🔥 restrict to user ownership
        .filter(Factory.user_id == current_user.id)

        .group_by(Factory.name)
        .all()
    )

    return [
        {"name": r.name, "count": r.count}
        for r in rows
    ]

# =============================
# MODELS PER ALGORITHM (USER ONLY)
# =============================
@router.get("/models-per-algorithm")
def models_per_algorithm(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    rows = (
        db.query(
            Algorithm.name.label("name"),
            func.count(Model.id).label("count"),
        )
        .join(Model, Model.algorithm_id == Algorithm.id)

        # 🔥 restrict to user ownership
        .filter(Algorithm.user_id == current_user.id)

        .group_by(Algorithm.name)
        .all()
    )

    return [
        {"name": r.name, "count": r.count}
        for r in rows
    ]
