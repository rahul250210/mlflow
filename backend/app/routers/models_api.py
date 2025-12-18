from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from fastapi.responses import FileResponse
from urllib.parse import quote

from app.models import ModelFile, User, Model, Algorithm, Factory
from app import schemas, crud
from app.database import get_db
from app.config import DATASET_DIR, MODEL_FILE_DIR, METRICS_DIR, PYTHON_CODE_DIR
from app.auth import get_current_user


router = APIRouter(
    prefix="/models",
    tags=["Models & Files"]
)


# --------------------------------
# GET ALL MODELS — (USER ONLY)
# --------------------------------
@router.get("/all")
def get_all_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = (
        db.query(
            Model.id,
            Model.name.label("model_name"),
            Model.created_at,
            Algorithm.name.label("algorithm_name"),
            Factory.name.label("factory_name"),
        )
        .join(Algorithm, Model.algorithm_id == Algorithm.id)
        .join(Factory, Algorithm.factory_id == Factory.id)
        .filter(Model.user_id == current_user.id)          # 🔥 Only user's models
        .order_by(Model.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "model_name": r.model_name,
            "created_at": r.created_at,
            "algorithm_name": r.algorithm_name,
            "factory_name": r.factory_name,
        }
        for r in rows
    ]


# --------------------------------
# RECENT FILES — USER ONLY
# --------------------------------
@router.get("/recent-files")
def get_recent_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    files = (
        db.query(ModelFile)
        .join(Model, ModelFile.model_id == Model.id)
        .filter(Model.user_id == current_user.id)          # 🔥 Filter by user
        .order_by(ModelFile.created_at.desc())
        .limit(5)
        .all()
    )
    return files


# --------------------------------
# CREATE MODEL UNDER ALGORITHM
# --------------------------------
@router.post("/{algorithm_id}", response_model=schemas.ModelResponse)
def create_model(
    algorithm_id: int,
    model: schemas.ModelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 🔒 Check user owns this algorithm
    algo = db.query(Algorithm).filter(Algorithm.id == algorithm_id).first()
    if not algo or algo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this algorithm")

    return crud.create_model(
        db=db,
        algorithm_id=algorithm_id,
        model=model,
        user_id=current_user.id
    )


# --------------------------------
# GET ALL MODELS — FOR ONE ALGORITHM
# --------------------------------
@router.get("/algorithm/{algorithm_id}", response_model=List[schemas.ModelResponse])
def get_models(
    algorithm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 🔒 Security check: ensure algorithm belongs to user
    algo = db.query(Algorithm).filter(Algorithm.id == algorithm_id).first()
    if not algo or algo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this algorithm")

    return crud.get_user_models(db, user_id=current_user.id, algorithm_id=algorithm_id)


# --------------------------------
# DELETE MODEL — USER ONLY
# --------------------------------
@router.delete("/{model_id}")
def delete_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    model = db.query(Model).filter(Model.id == model_id).first()

    if not model or model.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Model not found")

    return crud.delete_model(db, model_id,current_user.id)


# --------------------------------
# FILE UPLOAD
# --------------------------------
ALLOWED_EXTENSIONS = {
    "dataset": [".zip"],
    "model_file": [".pt", ".pth", ".onnx", ".h5", ".pkl"],
    "metrics": [".png", ".jpg", ".jpeg", ".csv", ".json"],
    "python_code": [".py"],
}

def validate_file_extension(file: UploadFile, file_type: str):
    filename = file.filename.lower()

    if file_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")

    allowed_exts = ALLOWED_EXTENSIONS[file_type]

    if not any(filename.endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension for {file_type}. Allowed: {', '.join(allowed_exts)}"
        )


@router.post("/upload/{model_id}")
def upload_model_file(
    model_id: int,
    file_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 🔒 Validate model belongs to user
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model or model.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this model")

    # Validate ext
    validate_file_extension(file, file_type)

    # Folder mapping
    if file_type == "dataset":
        folder = DATASET_DIR
    elif file_type == "model_file":
        folder = MODEL_FILE_DIR
    elif file_type == "metrics":
        folder = METRICS_DIR
    elif file_type == "python_code":
        folder = PYTHON_CODE_DIR
    else:
        raise HTTPException(status_code=400, detail="Invalid file_type")

    file_path = os.path.join(folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_data = {
        "file_type": file_type,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": os.path.getsize(file_path),
    }

    return crud.create_model_file(db, model_id, file_data,current_user.id)


# --------------------------------
# GET MODEL FILES — USER ONLY
# --------------------------------
@router.get("/files/{model_id}", response_model=List[schemas.ModelFileResponse])
def get_model_files(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    model = db.query(Model).filter(Model.id == model_id).first()

    if not model or model.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    return crud.get_files_by_model(db, model_id,current_user.id)


# --------------------------------
# DELETE FILE — USER ONLY
# --------------------------------
@router.delete("/file/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    file = db.query(ModelFile).filter(ModelFile.id == file_id).first()

    # 🔒 Check if file exists & belongs to user
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    model = db.query(Model).filter(Model.id == file.model_id).first()
    if model.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if os.path.exists(file.file_path):
        os.remove(file.file_path)

    return crud.delete_model_file(db, file_id,current_user.id)


# --------------------------------
# DOWNLOAD FILE — USER ONLY
# --------------------------------
@router.get("/download/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    file = (
        db.query(ModelFile)
        .join(Model, ModelFile.model_id == Model.id)
        .filter(
            ModelFile.id == file_id,
            Model.user_id == current_user.id  # 🔥 Ownership check
        )
        .first()
    )

    if not file:
        raise HTTPException(status_code=403, detail="Unauthorized access to file")

    return FileResponse(
        path=file.file_path,
        filename=os.path.basename(file.file_path),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quote(os.path.basename(file.file_path))}"
        }
    )
