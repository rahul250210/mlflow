import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database URL (from .env)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Upload directory
UPLOAD_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))

# Subfolders for organized storage
DATASET_DIR = os.path.join(UPLOAD_DIR, "datasets")
MODEL_FILE_DIR = os.path.join(UPLOAD_DIR, "model_files")
METRICS_DIR = os.path.join(UPLOAD_DIR, "metrics")
PYTHON_CODE_DIR = os.path.join(UPLOAD_DIR, "python_code")

# Ensure folders exist
for folder in [UPLOAD_DIR, DATASET_DIR, MODEL_FILE_DIR, METRICS_DIR, PYTHON_CODE_DIR]:
    os.makedirs(folder, exist_ok=True)

# Print info (optional, for debugging)
print(f"✅ Upload directories initialized in: {UPLOAD_DIR}")
print(f"✅ Database URL: {DATABASE_URL}")
