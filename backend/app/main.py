from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine
from app import models
from app.routers import factories, algorithms, models_api
from app.config import UPLOAD_DIR

# Create all tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Factory Model Management Portal",
    description="Manage factories, algorithms, models, and model-related files.",
    version="1.0.0"
)

# CORS – allow frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(factories.router)
app.include_router(algorithms.router)
app.include_router(models_api.router)

# Serve uploaded files (optional but useful)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/")
def root():
    return {"message": "Factory Portal API is running"}
