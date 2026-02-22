# UCD-Pantry

## Run Locally

Use two terminals so backend and frontend run at the same time.

### 1. Start backend (MongoDB recipe API)

```bash
cd backend
npm install
npm start
```

Backend serves on `http://localhost:5050` by default.

Quick API checks:

```bash
curl -i http://localhost:5050/recipes
curl -i -X POST http://localhost:5050/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["Barilla Ready Pasta Elbows"]}'
```

### 2. Start frontend (React app)

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` with:

```env
VITE_RECIPES_API_URL=http://localhost:5050
VITE_DETECTION_API_URL=http://localhost:8000
```

Then open the Vite URL shown in terminal (usually `http://localhost:5173`).

### Port note

Do not use port `5000` for this backend on macOS in this setup, because it may be occupied by AirTunes/Control Center and return `403`.

## Webcam + Model Integration

Frontend webcam support is implemented in `frontend/src/components/WebcamView.jsx`.

The frontend expects a detection API URL from:

- `frontend/.env` with `VITE_DETECTION_API_URL=http://localhost:8000`

When detection is enabled, the frontend sends webcam frames to:

- `POST {VITE_DETECTION_API_URL}/detect`
- Form field: `frame` (JPEG image)
- Expected JSON response:

```json
{
  "ingredients": ["Onion", "Tomato", "Garlic"]
}
```

Suggested backend layout for your OpenCV + YOLO model:

- `backend/app.py` (FastAPI/Flask inference server)
- `backend/models/yolo/best.pt` (trained YOLO weights)
- `backend/models/yolo/classes.yaml` (label mapping)

This keeps model code and weights on the backend while the React app only handles camera capture and UI state.
