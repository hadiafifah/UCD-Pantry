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
  const [detectionError, setDetectionError] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [lastDetections, setLastDetections] = useState([])

  const overlayRef = useRef(null)
  const detectionApiBaseUrl = import.meta.env.VITE_DETECTION_API_URL?.trim() || ''
  const canRunDetection = Boolean(detectionApiBaseUrl && onDetectedIngredients)

  const stopDetection = useCallback(() => {
    if (detectIntervalRef.current) {
      window.clearInterval(detectIntervalRef.current)
      detectIntervalRef.current = null
    }
    setIsDetecting(false)
    setLastDetections([])
    setDetectionError('')
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
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
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
      canvas.toBlob(resolve, 'image/jpeg', 0.95)
    })
    if (!blob) return

    const body = new FormData()
    body.append('frame', blob, 'frame.jpg')

    try {
      setDetectionError('')
      const response = await fetch(`${detectionApiBaseUrl}/detect`, {
        method: 'POST',
        body,
      })

      if (!response.ok) {
        const errText = await response.text()
        setDetectionError(`API error ${response.status}: ${errText.slice(0, 80)}`)
        setLastDetections([])
        return
      }
      const payload = await response.json()
      if (Array.isArray(payload.ingredients)) {
        onDetectedIngredients(payload.ingredients)
      }
      if (Array.isArray(payload.detections)) {
        setLastDetections(payload.detections)
      } else {
        setLastDetections([])
      }
    } catch (err) {
      setLastDetections([])
      setDetectionError(err?.message || 'Cannot reach detection API. Is it running on port 8000?')
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

  // Draw detection boxes on overlay canvas
  useEffect(() => {
    const overlay = overlayRef.current
    const video = videoRef.current
    if (!overlay || !video) return

    const ctx = overlay.getContext('2d')
    if (!ctx) return

    const cw = overlay.clientWidth
    const ch = overlay.clientHeight
    overlay.width = cw
    overlay.height = ch
    ctx.clearRect(0, 0, cw, ch)

    if (lastDetections.length === 0) return
    const vw = video.videoWidth
    const vh = video.videoHeight

    // object-fit: cover transform
    const scale = Math.max(cw / vw, ch / vh)
    const visW = cw / scale
    const visH = ch / scale
    const offsetX = (vw - visW) / 2
    const offsetY = (vh - visH) / 2

    const toDisplay = (x, y) => [(x - offsetX) * scale, (y - offsetY) * scale]

    const colors = ['#a47857', '#4494e4', '#5d61d1', '#b2b685', '#589f6a', '#60cae7', '#9f7ca8', '#a9a2f1', '#627696', '#acb0b8']

    lastDetections.forEach((d, i) => {
      const [x1, y1, x2, y2] = d.bbox || []
      if (x1 == null || y1 == null || x2 == null || y2 == null) return

      const [sx1, sy1] = toDisplay(x1, y1)
      const [sx2, sy2] = toDisplay(x2, y2)
      const color = colors[i % colors.length]

      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(sx1, sy1, sx2 - sx1, sy2 - sy1)

      const label = `${d.label} ${Math.round((d.confidence || 0) * 100)}%`
      ctx.font = 'bold 12px system-ui, sans-serif'
      const m = ctx.measureText(label)
      const tw = m.width + 8
      const th = 18
      ctx.fillStyle = color
      ctx.fillRect(sx1, sy1 - th, tw, th)
      ctx.fillStyle = '#fff'
      ctx.fillText(label, sx1 + 4, sy1 - 6)
    })
  }, [lastDetections, cameraState])

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
                Start the detection API with <code>npm run detect-api</code>, then start the camera and detection
              </p>
            )}
            <button className="webcam-view__button" onClick={startCamera}>
              <Play size={14} />
              Start camera
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="webcam-view__capture-canvas" aria-hidden="true" />
        {cameraState === 'live' && (
          <canvas
            ref={overlayRef}
            className="webcam-view__overlay"
            aria-hidden="true"
          />
        )}
      </div>

      {detectionError && (
        <p className="webcam-view__error" role="alert">
          {detectionError}
        </p>
      )}
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
        {!canRunDetection && cameraState === 'live' && (
          <p className="webcam-view__error">
            Detection disabled: add VITE_DETECTION_API_URL=http://localhost:8000 to frontend/.env and restart.
          </p>
        )}
        {detectedIngredients.length === 0 && !detectionError && canRunDetection ? (
          <p className="webcam-view__empty">
            No ingredients detected yet. Point the camera at your items or add
            them manually below.
          </p>
        ) : detectedIngredients.length > 0 ? (
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
        ) : null}
      </div>
    </div>
  )
}
