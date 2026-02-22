# UCD-Pantry

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
