from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from . import models, schemas

# ---------- Experiments ----------
def create_experiment(db: Session, data: schemas.ExperimentCreate):
    exp = models.Experiment(name=data.name, description=data.description)
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

def list_experiments(db: Session):
    stmt = select(models.Experiment).order_by(models.Experiment.created_at.desc())
    return db.scalars(stmt).all()

# ---------- Runs ----------
def create_run(db: Session, data: schemas.RunCreate):
    run = models.Run(experiment_id=data.experiment_id, name=data.name)
    db.add(run)
    db.commit()
    db.refresh(run)
    return run

def finish_run(db: Session, run_id: str):
    run = db.get(models.Run, run_id)
    if not run:
        return None
    run.status = "FINISHED"
    run.end_time = datetime.utcnow()
    db.commit()
    db.refresh(run)
    return run

def list_runs_for_experiment(db: Session, experiment_id: int):
    stmt = select(models.Run).where(models.Run.experiment_id == experiment_id)
    return db.scalars(stmt).all()

# ---------- Params ----------
def log_param(db: Session, data: schemas.ParamCreate):
    row = models.Param(run_id=data.run_id, key=data.key, value=data.value)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def list_params(db: Session, run_id: str):
    stmt = select(models.Param).where(models.Param.run_id == run_id)
    return db.scalars(stmt).all()

# ---------- Metrics ----------
def log_metric(db: Session, data: schemas.MetricCreate):
    row = models.Metric(run_id=data.run_id, key=data.key, value=data.value)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def list_metrics(db: Session, run_id: str):
    stmt = select(models.Metric).where(models.Metric.run_id == run_id)
    return db.scalars(stmt).all()


# ---------- Artifacts ----------
def list_artifacts(db: Session, run_id: str):
    stmt = select(models.Artifact).where(models.Artifact.run_id == run_id)
    return db.scalars(stmt).all()

def create_artifact(db: Session, run_id: int, filename: str, path: str, filetype: str, size_bytes: int):
    artifact = models.Artifact(run_id=run_id, filename=filename, path=path, filetype=filetype, size_bytes=size_bytes)
    db.add(artifact)
    db.commit()
    db.refresh(artifact)
    return artifact

