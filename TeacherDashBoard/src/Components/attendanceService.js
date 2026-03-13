// services/attendanceService.js

export const startAttendanceSession = async (method) => {

    console.log("Mock start session:", method)

    // simulate backend delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
        success: true,
        session: {
            id: 101,
            method: method,
            period_no: 2,
            session_status: "open"
        },
        qr_token: method === "qr" ? "TEMP_QR_TOKEN_123" : null,
        qr_image: method === "qr" ? "TEMP_QR_IMAGE_BASE64" : null
    }
}