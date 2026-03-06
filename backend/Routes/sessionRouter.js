import express from "express";

import {
    startAttendanceSession,
    markManualAttendance,
    markFaceAttendance,
    scanQR,
    closeAttendanceSession,
    getSessionSummary
} from "../Controllers/SessionController.js";

import { verifyToken } from "../Midddlewares/verifyToken.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/session/start", verifyToken, startAttendanceSession);

attendanceRouter.post("/manual", verifyToken, markManualAttendance);

attendanceRouter.post("/face", verifyToken, markFaceAttendance);

attendanceRouter.post("/qr", verifyToken, scanQR);

attendanceRouter.put("/session/close/:id", verifyToken, closeAttendanceSession);

attendanceRouter.get("/session/:id/summary", verifyToken, getSessionSummary);



export default attendanceRouter;