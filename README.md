# UCD-Pantry

## Webcam + Model Integration

Your YOLO model (`my_model`) is integrated. Detection boxes appear on the live camera feed.

### Quick start

1. **Install Python deps and run the detection API:**
   ```bash
   cd backend && pip install -r requirements.txt && python -m uvicorn detection_api:app --reload --port 8000
   ```
   Or from project root: `npm run detect-api`

2. **Set the API URL** in `frontend/.env`:
   ```
   VITE_DETECTION_API_URL=http://localhost:8000
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

4. **Use the app:** Start camera → Start detection. Bounding boxes and labels appear over the webcam feed; detected ingredients populate below.

### API

- `POST /detect` — Form field: `frame` (JPEG). Returns `{ ingredients: string[], detections: [{ label, confidence, bbox }] }`
