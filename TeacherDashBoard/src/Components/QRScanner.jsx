import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

export default function QRScanner() {

    const [qrToken, setQrToken] = useState("")
    const [seconds, setSeconds] = useState(10)
    const [running, setRunning] = useState(false)

    /* =====================
       GENERATE TOKEN
    ===================== */

    const generateToken = () => {
        const token = Math.random().toString(36).substring(2, 12)
        setQrToken(token)
        setSeconds(10)
    }

    /* =====================
       TIMER
    ===================== */

    useEffect(() => {

        if (!running) return

        generateToken()

        const interval = setInterval(() => {

            setSeconds(prev => {

                if (prev <= 1) {
                    generateToken()
                    return 10
                }

                return prev - 1

            })

        }, 1000)

        return () => clearInterval(interval)

    }, [running])

    /* =====================
       START SESSION
    ===================== */

    const startQR = () => {
        setRunning(true)
    }

    /* =====================
       STOP SESSION
    ===================== */

    const stopQR = () => {
        setRunning(false)
        setQrToken("")
        setSeconds(10)
    }

    return (

        <div className="bg-white rounded shadow p-6 text-center space-y-4">

            <h2 className="text-lg font-semibold">
                QR Attendance
            </h2>

            {/* QR DISPLAY */}

            {running ? (

                <>
                    <div className="flex justify-center">

                        <QRCodeCanvas
                            value={qrToken}
                            size={240}
                        />

                    </div>

                    <p className="text-xs text-gray-400">
                        Token: {qrToken}
                    </p>

                    <p className="text-sm text-gray-600">
                        Refreshing in {seconds}s
                    </p>

                </>

            ) : (

                <div className="h-[240px] flex items-center justify-center text-gray-400">
                    QR Session Not Started
                </div>

            )}

            {/* BUTTONS */}

            <div className="flex justify-center gap-3">

                {!running && (

                    <button
                        onClick={startQR}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Start QR Attendance
                    </button>

                )}

                {running && (

                    <button
                        onClick={stopQR}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Stop Session
                    </button>

                )}

            </div>

        </div>

    )
}