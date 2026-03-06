import express from "express";
import { pool } from "../Database/db.js";
import { logoutUser, userLogin, userRegister } from "../Controllers/userControll.js";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";
import { createTeacher, getLoggedTeacher, getTeachers } from "../Controllers/teacherController.js";

const TeacherRouter = express.Router();

TeacherRouter.post('/createTeacher', verifyToken, authorizeRole("admin"), createTeacher);
TeacherRouter.get('/get-Teachers', verifyToken, authorizeRole("admin"), getTeachers);
TeacherRouter.get('/loggedTeacher', verifyToken ,getLoggedTeacher);

export default TeacherRouter;