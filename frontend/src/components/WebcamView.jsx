import { Camera, X } from 'lucide-react'
import './WebcamView.css'

export default function WebcamView({ detectedIngredients, onRemoveIngredient }) {
  return (
    <div className="webcam-view">
      <div className="webcam-view__header">
        <h2 className="webcam-view__title">
          <Camera size={20} />
          Live Detection
        </h2>
        <span className="webcam-view__badge">
          {detectedIngredients.length} detected
        </span>
      </div>

      {/* Webcam placeholder - your YOLO model will render here */}
      <div className="webcam-view__feed" role="img" aria-label="Webcam feed for ingredient detection">
        <div className="webcam-view__placeholder">
          <Camera size={48} strokeWidth={1.5} />
          <p className="webcam-view__placeholder-text">
            Camera feed will appear here
          </p>
          <p className="webcam-view__placeholder-hint">
            YOLO model integration point
          </p>
        </div>
      </div>

      {/* Detected ingredients list */}
      <div className="webcam-view__detected">
        <h3 className="webcam-view__detected-label">Detected Ingredients</h3>
        {detectedIngredients.length === 0 ? (
          <p className="webcam-view__empty">
            No ingredients detected yet. Point the camera at your items or add
            them manually below.
          </p>
        ) : (
          <ul className="webcam-view__tags" aria-label="Detected ingredients">
            {detectedIngredients.map((item) => (
              <li key={item} className="ingredient-tag">
                <span>{item}</span>
                <button
                  className="ingredient-tag__remove"
                  onClick={() => onRemoveIngredient(item)}
                  aria-label={`Remove ${item}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
