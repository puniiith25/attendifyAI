import express from "express";
import { authorizeRole, verifyToken } from "../../Midddlewares/verifyToken.js";
import { createStudent, deleteStudent, getLoggedStudent, getStudentById, getStudents, updateStudent, getStudentAttendanceStats } from "../../Controllers/studentController.js";
import upload from "../../Midddlewares/upload.js";

const studentRouter = express.Router();

studentRouter.post("/create-student", verifyToken, upload.single("image"), createStudent);

studentRouter.get("/get-students", verifyToken, getStudents);

studentRouter.get("/get-student/:id", verifyToken, getStudentById);

studentRouter.get("/my-student", verifyToken, getLoggedStudent);
studentRouter.get("/my-attendance-stats", verifyToken, getStudentAttendanceStats);

studentRouter.put("/update-student/:id", verifyToken, upload.single("image"), updateStudent);

studentRouter.delete("/delete-student/:id", verifyToken, deleteStudent);

export default studentRouter;