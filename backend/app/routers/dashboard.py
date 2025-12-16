from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    factories = db.query(models.Factory).count()
    algorithms = db.query(models.Algorithm).count()
    models_count = db.query(models.Model).count()

    return {
        "factories": factories,
        "algorithms": algorithms,
        "models": models_count
    }
