import { useRef, useState, useEffect } from "react"
import { sendFrameToAI } from "../Components/attendanceService"

export default function AttendanceCamera({ sessionId, onDetect }) {

    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    const [stream, setStream] = useState(null)
    const [cameraOn, setCameraOn] = useState(false)
    const [detecting, setDetecting] = useState(false)
    const [processing, setProcessing] = useState(false)

    /* =========================
       START CAMERA
    ========================= */

    const startCamera = async () => {

        try {

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true
            })

            setStream(mediaStream)
            setCameraOn(true)

        } catch (error) {
            console.error("Camera error:", error)
        }
    }

    /* =========================
       STOP CAMERA
    ========================= */

    const stopCamera = () => {

        if (stream) {

            stream.getTracks().forEach(track => track.stop())

        }

        setCameraOn(false)
        setDetecting(false)

        if (videoRef.current) {
            videoRef.current.srcObject = null
        }

    }

    /* =========================
       ATTACH STREAM
    ========================= */

    useEffect(() => {

        if (cameraOn && videoRef.current) {

            videoRef.current.srcObject = stream

        }

    }, [cameraOn, stream])

    /* =========================
       START DETECTION
    ========================= */

    const startDetection = () => {

        if (!cameraOn) {
            alert("Start camera first")
            return
        }

        setDetecting(true)
    }

    /* =========================
       CAPTURE FRAME
    ========================= */

    const captureFrame = async () => {

        if (processing) return

        setProcessing(true)

        try {

            const video = videoRef.current
            const canvas = canvasRef.current

            if (!video || !canvas) return

            const ctx = canvas.getContext("2d")

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            ctx.drawImage(video, 0, 0)

            const image = canvas.toDataURL("image/jpeg")

            const blob = await fetch(image).then(r => r.blob())

            const res = await sendFrameToAI(sessionId, blob)

            if (res.success) {

                res.detected.forEach(student => {

                    onDetect({
                        id: student.student_id,
                        crop: student.crop,
                        confidence: student.confidence
                    })

                })

            }

        } catch (error) {

            console.error("Frame capture error:", error)

        }

        setProcessing(false)
    }

    /* =========================
       AUTO DETECT LOOP
    ========================= */

    useEffect(() => {

        if (!detecting) return

        const interval = setInterval(() => {

            captureFrame()

        }, 4000)

        return () => clearInterval(interval)

    }, [detecting])

    /* =========================
       CLEANUP ON UNMOUNT
    ========================= */

    useEffect(() => {

        return () => {
            stopCamera()
        }

    }, [])

    /* =========================
       UI
    ========================= */

    return (

        <div>

            <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-[450px] bg-black rounded"
            />

            <canvas ref={canvasRef} className="hidden" />

            {!cameraOn && (

                <button
                    onClick={startCamera}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                >
                    Start Camera
                </button>

            )}

            {cameraOn && !detecting && (

                <button
                    onClick={startDetection}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 ml-3"
                >
                    Start Detection
                </button>

            )}

            {detecting && (

                <button
                    onClick={stopCamera}
                    className="bg-red-600 text-white px-4 py-2 rounded mt-4 ml-3"
                >
                    Stop Camera
                </button>

            )}

        </div>
    )
}