import mlflow
import mlflow.pytorch
import shutil
import os
from ultralytics import YOLO


# 1. MLflow Setup

mlflow.set_tracking_uri("http://127.0.0.1:5000")  # Change if using remote server
mlflow.set_experiment("YOLO-PersonDetectionModel")


# 2. Paths

DATASET_PATH = "person_detection"   # dataset folder
MODEL_PATH = "Weights/yolov8n.pt"   # pretrained YOLO model
ZIP_PATH = "person_detection.zip"   # dataset archive path
YAML_PATH = os.path.join(DATASET_PATH, "data.yaml")
OUTPUT_DIR = "runs/detect/person_train"  # fixed training folder
BEST_MODEL_PATH = os.path.join(OUTPUT_DIR, "weights", "best.pt")


# 3. Start MLflow Run

with mlflow.start_run(run_name="YOLO-Person-Detection2") as run:

    # Create dataset zip only if it doesn't already exist
    if not os.path.exists(ZIP_PATH):
        shutil.make_archive("person_detection", 'zip', DATASET_PATH)
        print("Created dataset archive")
    else:
        print("Dataset archive already exists, skipping creation")

    # Log the compressed dataset
    mlflow.log_artifact(ZIP_PATH, artifact_path="dataset")

    # Also log the YAML file separately
    if os.path.exists(YAML_PATH):
        mlflow.log_artifact(YAML_PATH, artifact_path="dataset")
        print("Logged data.yaml")
    else:
        print("data.yaml not found in dataset folder")



    # 4. Log Pretrained Model

    mlflow.log_artifact(MODEL_PATH, artifact_path="pretrained_model")
    print("Pretrained YOLO model logged")

    # Initialize and train YOLO
    model = YOLO(MODEL_PATH)

    results = model.train(
        data=YAML_PATH,
        epochs=3,
        imgsz=640,
        batch=16,
        project="runs/detect",   # custom project folder
        name="person_train",     # fixed run name
        exist_ok=True            # overwrite if already exists
    )

    # Log YOLO training parameters
    mlflow.log_params({
        "epochs": 3,
        "imgsz": 640,
        "batch": 16,
        "model": "yolov8n.pt"
    })

    # Add Tags (extra info for filtering/searching)
    mlflow.set_tags({ "framework": "YOLOv8", 
                     "task": "person-detection-model2", 
                     "dataset": "custom_person_dataset",
                     "developer": "Rahul Sharma" })

    # Log trained model as artifact + register it
    if os.path.exists(BEST_MODEL_PATH):
        # Log artifact for reproducibility
        mlflow.log_artifact(BEST_MODEL_PATH, artifact_path="model")

        # Register the model in MLflow Model Registry
        mlflow.pytorch.log_model(
            pytorch_model=model.model,
            artifact_path="model_registry",
            registered_model_name="YOLO-PersonDetection2"
        )
        print("Model weights logged and registered successfully")
    else:
        print("Trained model not found")
    mlflow.log_artifact(__file__)
    print(f"Run completed. Check MLflow UI at http://127.0.0.1:5000")
