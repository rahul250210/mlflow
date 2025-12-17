from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from sqlalchemy import func

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# -----------------------------
# STATS COUNTS
# -----------------------------
@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    return {
        "factories": db.query(models.Factory).count(),
        "algorithms": db.query(models.Algorithm).count(),
        "models": db.query(models.Model).count(),
    }

# -----------------------------
# MODELS PER FACTORY
# -----------------------------
@router.get("/models-per-factory")
def models_per_factory(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Factory.name.label("name"),
            func.count(models.Model.id).label("count"),
        )
        .join(models.Algorithm, models.Algorithm.factory_id == models.Factory.id)
        .join(models.Model, models.Model.algorithm_id == models.Algorithm.id)
        .group_by(models.Factory.name)
        .all()
    )

    return [
        {
            "name": r.name,
            "count": r.count,
        }
        for r in rows
    ]
    
# -----------------------------
# MODELS PER ALGORITHM
# -----------------------------
@router.get("/models-per-algorithm")
def models_per_algorithm(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Algorithm.name.label("name"),
            func.count(models.Model.id).label("count"),
        )
        .join(models.Model, models.Model.algorithm_id == models.Algorithm.id)
        .group_by(models.Algorithm.name)
        .all()
    )

    return [
        {
            "name": r.name,
            "count": r.count,
        }
        for r in rows
    ]
