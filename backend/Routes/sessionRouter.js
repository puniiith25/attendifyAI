import express from "express";
import multer from "multer";

import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    closeAttendanceSession,
    startAttendanceSession
} from "../Controllers/AttendanceConteollers/sessionController.js";

import {
    markManualAttendance
} from "../Controllers/AttendanceConteollers/manualAttendanceController.js";

import {
    getSessionDetails,
    getSessionSummary
} from "../Controllers/AttendanceConteollers/summaryController.js";

import {
    scanQR
} from "../Controllers/AttendanceConteollers/qrAttendanceController.js";

import {
    processFrame
} from "../Controllers/aiController.js";

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
    "/session/:id/summary",
    verifyToken,
    getSessionSummary
);
attendanceRouter.get(
    "/session/:id/details",
    verifyToken,
    getSessionDetails
);

export default attendanceRouter;