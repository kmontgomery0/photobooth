import { useState, useRef, useEffect } from 'react'
import './CameraCapture.css'

function CameraCapture() {
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = mediaStream
      setStream(mediaStream)
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.')
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setStream(null)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Ensure video frame is ready
    if (video.readyState < 2) {
      console.warn('Video not ready yet — try again shortly')
      return
    }

    const context = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Flip the image horizontally (mirror it)
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Reset the transform
    context.setTransform(1, 0, 0, 1, 0, 0)
    
    const imageData = canvas.toDataURL('image/png')
    setCapturedImage(imageData)
  }

  const clearPhoto = () => setCapturedImage(null)

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a')
      link.download = `photobooth-${Date.now()}.png`
      link.href = capturedImage
      link.click()
    }
  }

  // Attach stream to video and ensure it plays
  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    // Attach the stream to the video element
    video.srcObject = stream

    const handleLoadedMetadata = () => {
      video.play().catch((err) => {
        console.error('Error playing video:', err)
        setError('Unable to play video stream.')
      })
    }

    const handlePlay = () => {
      console.log('Video is playing')
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)

    // If metadata is already loaded, try to play immediately
    if (video.readyState >= 1) {
      video.play().catch((err) => {
        console.error('Error playing video:', err)
      })
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
    }
  }, [stream])

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [])

  return (
    <div className="camera-capture">
      <div className="camera-controls">
        {!stream ? (
          <button onClick={startCamera} className="btn btn-primary">
            Start Camera
          </button>
        ) : (
          <div className="controls-group">
            <button onClick={capturePhoto} className="btn btn-capture">
              Capture Photo
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              Stop Camera
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="camera-preview">
        {stream && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-preview"
          />
        )}

        {capturedImage && (
          <div className="captured-photo-container">
            <img src={capturedImage} alt="Captured" className="captured-photo" />
            <div className="photo-actions">
              <button onClick={downloadPhoto} className="btn btn-download">
                Download
              </button>
              <button onClick={clearPhoto} className="btn btn-clear">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default CameraCapture
