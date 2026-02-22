import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Square, Play, X } from 'lucide-react'
import './WebcamView.css'

export default function WebcamView({
  detectedIngredients,
  onRemoveIngredient,
  onDetectedIngredients,
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const detectIntervalRef = useRef(null)

  const [cameraState, setCameraState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)

  const detectionApiBaseUrl = import.meta.env.VITE_DETECTION_API_URL?.trim() || ''
  const canRunDetection = Boolean(detectionApiBaseUrl && onDetectedIngredients)

  const stopDetection = useCallback(() => {
    if (detectIntervalRef.current) {
      window.clearInterval(detectIntervalRef.current)
      detectIntervalRef.current = null
    }
    setIsDetecting(false)
  }, [])

  const stopCamera = useCallback(() => {
    stopDetection()

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraState('idle')
  }, [stopDetection])

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('error')
      setErrorMessage('Webcam is not supported in this browser.')
      return
    }

    try {
      setCameraState('starting')
      setErrorMessage('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })

      streamRef.current = stream
      setCameraState('live')
    } catch (error) {
      setCameraState('error')
      setErrorMessage(error.message || 'Unable to access webcam.')
    }
  }, [])

  const captureFrameAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !onDetectedIngredients) return
    if (videoRef.current.readyState < 2) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    })
    if (!blob) return

    const body = new FormData()
    body.append('frame', blob, 'frame.jpg')

    try {
      const response = await fetch(`${detectionApiBaseUrl}/detect`, {
        method: 'POST',
        body,
      })

      if (!response.ok) return
      const payload = await response.json()
      if (Array.isArray(payload.ingredients)) {
        onDetectedIngredients(payload.ingredients)
      }
    } catch {
      // Ignore transient API/network errors; keep camera running.
    }
  }, [detectionApiBaseUrl, onDetectedIngredients])

  const startDetection = useCallback(() => {
    if (!canRunDetection || cameraState !== 'live' || isDetecting) return
    setIsDetecting(true)

    captureFrameAndDetect()
    detectIntervalRef.current = window.setInterval(() => {
      captureFrameAndDetect()
    }, 1200)
  }, [cameraState, canRunDetection, captureFrameAndDetect, isDetecting])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (detectIntervalRef.current) {
        window.clearInterval(detectIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (cameraState !== 'live' || !videoRef.current || !streamRef.current) return

    videoRef.current.srcObject = streamRef.current
    videoRef.current.play().catch(() => {
      setCameraState('error')
      setErrorMessage('Unable to start video playback.')
    })
  }, [cameraState])

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

      <div className="webcam-view__feed" role="img" aria-label="Webcam feed for ingredient detection">
        {cameraState === 'live' ? (
          <video
            ref={videoRef}
            className="webcam-view__video"
            autoPlay
            playsInline
            muted
            aria-label="Live camera feed"
          />
        ) : (
          <div className="webcam-view__placeholder">
            <Camera size={48} strokeWidth={1.5} />
            <p className="webcam-view__placeholder-text">
              {cameraState === 'starting' ? 'Starting camera...' : 'Camera feed is off'}
            </p>
            {cameraState === 'error' ? (
              <p className="webcam-view__placeholder-hint">{errorMessage}</p>
            ) : (
              <p className="webcam-view__placeholder-hint">
                YOLO model results will appear after backend integration
              </p>
            )}
            <button className="webcam-view__button" onClick={startCamera}>
              <Play size={14} />
              Start camera
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="webcam-view__capture-canvas" aria-hidden="true" />
      </div>

      {cameraState === 'live' && (
        <div className="webcam-view__controls">
          <button className="webcam-view__button" onClick={stopCamera}>
            <Square size={14} />
            Stop camera
          </button>
          <button
            className="webcam-view__button webcam-view__button--secondary"
            onClick={isDetecting ? stopDetection : startDetection}
            disabled={!canRunDetection}
            title={!canRunDetection ? 'Set VITE_DETECTION_API_URL to enable detection' : ''}
          >
            {isDetecting ? 'Pause detection' : 'Start detection'}
          </button>
        </div>
      )}

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
