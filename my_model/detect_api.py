import os
from io import BytesIO
from typing import Dict, List, Set

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO


MODEL_PATH = os.getenv(
    "MODEL_PATH",
    os.path.join(os.path.dirname(__file__), "train", "weights", "best.pt"),
)
CONFIDENCE_THRESHOLD = float(os.getenv("DETECT_CONFIDENCE", "0.35"))

# Keep this aligned with frontend/src/components/IngredientSelector.jsx
PANTRY_ITEMS = [
    "Barilla Ready Pasta Elbows",
    "Iceberg Salad",
    "Eggs",
    "Green Onions",
    "Basil",
    "Sweet Corn",
    "Canned Tuna",
    "Tomatoes",
    "Cilantro",
    "Cucumber",
    "Lemon",
    "Lime",
    "Bread",
    "Beans",
    "Pasta Noodles",
    "Spinach",
    "Oregano",
    "Bell Pepper",
    "Arugula",
    "Canned Chickpea",
    "Garlic Powder",
    "Onion Powder",
    "Smoked Paprika",
    "Salt",
    "Pepper",
    "Ginger",
    "Hot Pepper",
    "Broccoli",
    "Rice",
    "Green Beans",
    "Chicken Broth",
    "Bokchoy",
    "Poblano Peppers",
    "Leeks",
    "Turnips",
    "Garlic",
    "Parsely",
    "Daikon",
    "Persimmons",
    "Avocado",
    "Eggplants",
    "Scallion",
    "Mushroom",
    "Pomegranate",
    "Pear",
    "Red Pepper",
    "Radish",
    "Jalapenos",
    "Potatoes",
    "Celery",
    "Carrot",
    "Butternut Squash",
    "Sweet Potato",
    "Black Beans",
    "Cumin",
    "Vegetable Stock",
]

STOP_WORDS = {
    "a",
    "an",
    "and",
    "at",
    "cup",
    "cups",
    "clove",
    "cloves",
    "can",
    "cans",
    "of",
    "oz",
    "ounce",
    "ounces",
    "tbsp",
    "tsp",
    "teaspoon",
    "teaspoons",
    "tablespoon",
    "tablespoons",
    "medium",
    "small",
    "large",
    "ripe",
    "fresh",
    "chopped",
    "diced",
    "sliced",
    "shredded",
    "grated",
    "minced",
    "to",
    "taste",
    "or",
    "pouch",
}

EXACT_LABEL_ALIASES = {
    "green onion": "Green Onions",
    "green onions": "Green Onions",
    "eggplant": "Eggplants",
    "scallions": "Scallion",
    "jalapeno": "Jalapenos",
    "red bell pepper": "Red Pepper",
    "corn": "Sweet Corn",
    "chickpeas": "Canned Chickpea",
    "chickpea": "Canned Chickpea",
}


def normalize_token(text: str) -> str:
    token = "".join(ch for ch in text.lower() if ch.isalpha())
    # Basic singularization so model labels like "egg"/"tomato" map to
    # selector labels "Eggs"/"Tomatoes".
    if len(token) > 4 and token.endswith("es"):
        return token[:-2]
    if len(token) > 3 and token.endswith("s"):
        return token[:-1]
    return token


def tokenize(text: str) -> List[str]:
    return [
        token
        for token in (normalize_token(part) for part in str(text).split())
        if token and token not in STOP_WORDS
    ]


def build_pantry_index(items: List[str]) -> Dict[str, Set[str]]:
    return {item: set(tokenize(item)) for item in items}


PANTRY_INDEX = build_pantry_index(PANTRY_ITEMS)


def map_label_to_pantry_item(label: str) -> str | None:
    clean_label = str(label or "").strip().lower()
    if not clean_label:
        return None

    if clean_label in EXACT_LABEL_ALIASES:
        return EXACT_LABEL_ALIASES[clean_label]

    label_tokens = set(tokenize(clean_label))
    if not label_tokens:
        return None

    # Strong match: all label tokens included in pantry item tokens.
    candidates = [
        item
        for item, tokens in PANTRY_INDEX.items()
        if label_tokens.issubset(tokens)
    ]
    if candidates:
        return sorted(candidates, key=len)[0]

    # Fallback: choose pantry item with strongest token overlap.
    best_item = None
    best_score = 0
    for item, tokens in PANTRY_INDEX.items():
        overlap = len(label_tokens.intersection(tokens))
        if overlap > best_score:
            best_score = overlap
            best_item = item
    return best_item if best_score > 0 else None


if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Model file not found at: {MODEL_PATH}")

model = YOLO(MODEL_PATH, task="detect")
label_lookup = model.names

app = FastAPI(title="PicAPlate YOLO Detection API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/detect")
async def detect(frame: UploadFile = File(...)) -> Dict[str, List]:
    if frame.content_type not in {"image/jpeg", "image/jpg", "image/png"}:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    image_bytes = await frame.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image upload")

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Failed to parse image") from exc

    np_image = np.array(image)
    results = model.predict(np_image, conf=CONFIDENCE_THRESHOLD, verbose=False)
    if not results:
        return {"ingredients": [], "detections": []}

    result = results[0]
    boxes = result.boxes
    if boxes is None or len(boxes) == 0:
        return {"ingredients": [], "detections": []}

    detected_ingredients: Set[str] = set()
    detections: List[Dict[str, float | str]] = []

    for box in boxes:
        class_idx = int(box.cls.item())
        confidence = float(box.conf.item())
        raw_label = str(label_lookup[class_idx])
        mapped_label = map_label_to_pantry_item(raw_label)

        if mapped_label:
            detected_ingredients.add(mapped_label)

        detections.append(
            {
                "label": raw_label,
                "mappedLabel": mapped_label or "",
                "confidence": round(confidence, 4),
            }
        )

    return {
        "ingredients": sorted(detected_ingredients),
        "detections": detections,
    }
