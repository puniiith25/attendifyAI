import express from "express";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";
import { createTeacher, getLoggedTeacher, getTeachers } from "../Controllers/teacherController.js";

const TeacherRouter = express.Router();

TeacherRouter.post('/createTeacher', verifyToken, authorizeRole("admin"), createTeacher);
TeacherRouter.get('/get-Teachers', verifyToken, authorizeRole("admin"), getTeachers);
TeacherRouter.get('/loggedTeacher', verifyToken ,getLoggedTeacher);

export default TeacherRouter;