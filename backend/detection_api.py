"""
YOLO detection API for PicAPlate.
Serves POST /detect with webcam frames and returns ingredients + bounding boxes.
"""
import io
import os
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Resolve project root (backend/ is one level down from UCD-Pantry)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "my_model" / "my_model.pt"
FALLBACK_MODEL = PROJECT_ROOT / "my_model" / "train" / "weights" / "best.pt"

app = FastAPI(title="PicAPlate Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None


def load_model():
    global model
    if model is not None:
        return
    from ultralytics import YOLO
    path = MODEL_PATH if MODEL_PATH.exists() else FALLBACK_MODEL
    if not path.exists():
        raise FileNotFoundError(
            f"YOLO model not found. Tried: {MODEL_PATH} and {FALLBACK_MODEL}"
        )
    model = YOLO(str(path), task="detect")
    print(f"Loaded YOLO model from {path}")


@app.on_event("startup")
async def startup():
    load_model()


@app.get("/classes")
async def get_classes():
    """Return the ingredient classes the model was trained to detect."""
    load_model()
    return {"classes": list(model.names.values())}


@app.post("/detect")
async def detect(frame: UploadFile = File(...)):
    """Run YOLO detection on an uploaded frame. Returns ingredients and bounding boxes."""
    load_model()

    content = await frame.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    # Decode image (JPEG/PNG from frontend)
    import cv2
    arr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    # Run inference (conf=0.25: webcam frames are harder than training data)
    results = model(img, conf=0.25, imgsz=640, verbose=False)
    detections_list = []
    ingredients = []
    seen = set()
    min_conf = 0.25

    boxes = results[0].boxes
    labels = model.names
    h, w = img.shape[:2]

    for i in range(len(boxes)):
        conf = float(boxes[i].conf.item())
        if conf < min_conf:
            continue
        cls_id = int(boxes[i].cls.item())
        label = labels[cls_id]
        if label not in seen:
            seen.add(label)
            ingredients.append(label)

        xyxy = boxes[i].xyxy.cpu().numpy().squeeze()
        x1, y1, x2, y2 = xyxy.astype(float).tolist()
        detections_list.append({
            "label": label,
            "confidence": round(conf, 2),
            "bbox": [x1, y1, x2, y2],
            "bboxNormalized": [x1 / w, y1 / h, x2 / w, y2 / h],
        })

    return {
        "ingredients": ingredients,
        "detections": detections_list,
    }
