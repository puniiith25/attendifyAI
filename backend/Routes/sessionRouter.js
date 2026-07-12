import express from "express";
import multer from "multer";

import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    closeAttendanceSession,
    getSessionStudents,
    startAttendanceSession,
    submitAttendance,
    getActiveSession,
    getSessionsHistory
} from "../Controllers/AttendanceConteollers/sessionController.js";

import {
    markManualAttendance
} from "../Controllers/AttendanceConteollers/manualAttendanceController.js";

import {
    getSessionDetails,
} from "../Controllers/AttendanceConteollers/summaryController.js";

import {
    scanQR
} from "../Controllers/AttendanceConteollers/qrAttendanceController.js";

import {
    processFrame
} from "../Controllers/AttendanceConteollers/aiController.js";

const attendanceRouter = express.Router();

/* ==============================
   MULTER CONFIG
============================== */

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

/* ==============================
   SESSION
============================== */

attendanceRouter.post(
    "/session/start",
    verifyToken,
    startAttendanceSession
);

attendanceRouter.get(
    "/session/active",
    verifyToken,
    getActiveSession
);

attendanceRouter.get(
    "/session/history",
    verifyToken,
    getSessionsHistory
);

attendanceRouter.put(
    "/session/close/:id",
    verifyToken,
    closeAttendanceSession
);

/* ==============================
   MANUAL ATTENDANCE
============================== */

attendanceRouter.post(
    "/manual",
    verifyToken,
    markManualAttendance
);

/* ==============================
   QR ATTENDANCE
============================== */

attendanceRouter.post(
    "/qr",
    verifyToken,
    scanQR
);

/* ==============================
   AI FACE DETECTION
============================== */

attendanceRouter.post(
    "/frame",
    verifyToken,
    upload.single("frame"),
    processFrame
);

/* ==============================
   SESSION SUMMARY
============================== */
attendanceRouter.get(
    "/session/:id/details",
    verifyToken,
    getSessionDetails
);
attendanceRouter.get(
    "/session/:session_id/students",
    verifyToken,
    getSessionStudents

);
attendanceRouter.post(
    "/session/submit",
    verifyToken,
    submitAttendance
);
export default attendanceRouter;