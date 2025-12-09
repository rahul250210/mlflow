from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from app import schemas, crud, models
from app.database import get_db
from app.config import DATASET_DIR, MODEL_FILE_DIR, METRICS_DIR, PYTHON_CODE_DIR

router = APIRouter(
    prefix="/models",
    tags=["Models & Files"]
)


# --------------------------------
# CREATE MODEL UNDER ALGORITHM
# --------------------------------
@router.post("/{algorithm_id}", response_model=schemas.ModelResponse)
def create_model(
    algorithm_id: int,
    model: schemas.ModelCreate,
    db: Session = Depends(get_db)
):
    return crud.create_model(db, algorithm_id, model)


# --------------------------------
# GET ALL MODELS BY ALGORITHM
# --------------------------------
@router.get("/algorithm/{algorithm_id}", response_model=List[schemas.ModelResponse])
def get_models(algorithm_id: int, db: Session = Depends(get_db)):
    return crud.get_models_by_algorithm(db, algorithm_id)


# --------------------------------
# DELETE MODEL
# --------------------------------
@router.delete("/{model_id}")
def delete_model(model_id: int, db: Session = Depends(get_db)):
    return crud.delete_model(db, model_id)


# --------------------------------
# UPLOAD FILE TO MODEL
# --------------------------------
@router.post("/upload/{model_id}")
def upload_model_file(
    model_id: int,
    file_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    model = db.query(models.Model).filter(models.Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    if file_type == "dataset":
        folder = DATASET_DIR
    elif file_type == "model_file":
        folder = MODEL_FILE_DIR
    elif file_type == "metrics":
        folder = METRICS_DIR
    elif file_type == "python_code":
        folder = PYTHON_CODE_DIR
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")

    file_path = os.path.join(folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    file_data = {
        "file_type": file_type,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size
    }

    return crud.create_model_file(db, model_id, file_data)


# --------------------------------
# GET ALL FILES OF A MODEL
# --------------------------------
@router.get("/files/{model_id}", response_model=List[schemas.ModelFileResponse])
def get_model_files(model_id: int, db: Session = Depends(get_db)):
    return crud.get_files_by_model(db, model_id)


# --------------------------------
# DELETE FILE
# --------------------------------
@router.delete("/file/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(models.ModelFile).filter(models.ModelFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if os.path.exists(file.file_path):
        os.remove(file.file_path)

    return crud.delete_model_file(db, file_id)
