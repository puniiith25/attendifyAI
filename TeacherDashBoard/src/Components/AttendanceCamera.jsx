import { useRef, useState, useEffect } from "react"

export default function AttendanceCamera({ onDetect }) {

    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    const [cameraOn, setCameraOn] = useState(false)
    const [stream, setStream] = useState(null)

    /* ======================
       START CAMERA
    ====================== */

    const startCamera = async () => {
        try {

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            })

            setStream(mediaStream)
            setCameraOn(true)

        } catch (error) {
            console.error("Camera error:", error)
        }
    }

    /* ======================
       ATTACH STREAM TO VIDEO
    ====================== */

    useEffect(() => {

        if (cameraOn && videoRef.current && stream) {

            const video = videoRef.current

            video.srcObject = stream

            video.onloadedmetadata = () => {
                video.play()
            }

        }

    }, [cameraOn, stream])


    /* ======================
       STOP CAMERA
    ====================== */

    const stopCamera = () => {

        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }

        setCameraOn(false)
        setStream(null)

    }


    /* ======================
       CAPTURE FRAME
    ====================== */

    const captureFrame = () => {

        const video = videoRef.current
        const canvas = canvasRef.current

        if (!video || !canvas) return

        const ctx = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0)

        const image = canvas.toDataURL("image/jpeg")

        sendFrame(image)

    }


    /* ======================
       SEND FRAME (TEMP)
    ====================== */

    const sendFrame = (image) => {

        console.log("Frame captured")

        if (onDetect) {

            const fakeStudent = {
                id: 1,
                name: "Rahul Sharma",
                face: image
            }

            onDetect(fakeStudent)
        }

    }


    /* ======================
       AUTO CAPTURE
    ====================== */

    useEffect(() => {

        if (!cameraOn) return

        const interval = setInterval(() => {
            captureFrame()
        }, 3000)

        return () => clearInterval(interval)

    }, [cameraOn])


    return (

        <div className="space-y-4">

            {/* CAMERA VIEW */}

            <div className="bg-black rounded overflow-hidden">

                {cameraOn ? (

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-[500px] object-cover"
                    />

                ) : (

                    <div className="h-64 flex items-center justify-center text-gray-400">
                        Camera Off
                    </div>

                )}

            </div>

            <canvas ref={canvasRef} className="hidden"></canvas>

            {/* BUTTONS */}

            <div className="flex gap-3">

                {!cameraOn && (

                    <button
                        onClick={startCamera}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Start Face Attendance
                    </button>

                )}

                {cameraOn && (

                    <button
                        onClick={stopCamera}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Stop Session
                    </button>

                )}

            </div>

        </div>
    )
}