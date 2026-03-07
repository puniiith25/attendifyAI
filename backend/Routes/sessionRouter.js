import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";
import { closeAttendanceSession, startAttendanceSession } from "../Controllers/AttendanceConteollers/sessionController.js";
import { markManualAttendance } from "../Controllers/AttendanceConteollers/manualAttendanceController.js";
import { markFaceAttendance } from "../Controllers/AttendanceConteollers/faceAttendanceController.js";
import { getSessionSummary } from "../Controllers/AttendanceConteollers/summaryController.js";
import { scanQR } from "../Controllers/AttendanceConteollers/qrAttendanceController.js";

const attendanceRouter = express.Router();

attendanceRouter.post("/session/start", verifyToken, startAttendanceSession);

attendanceRouter.post("/manual", verifyToken, markManualAttendance);

attendanceRouter.post("/face", verifyToken, markFaceAttendance);

attendanceRouter.post("/qr", verifyToken, scanQR);

attendanceRouter.put("/session/close/:id", verifyToken, closeAttendanceSession);

attendanceRouter.get("/session/:id/summary", verifyToken, getSessionSummary);



export default attendanceRouter;