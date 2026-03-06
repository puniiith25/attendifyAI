import express from "express";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";
import { createStudent, getLoggedStudent, getStudents } from "../Controllers/studentController.js";

const StudentRouter = express.Router();

StudentRouter.post('/createStudent', verifyToken, authorizeRole("admin"), createStudent);
StudentRouter.get('/get-Students', verifyToken, authorizeRole("admin"), getStudents);
StudentRouter.get('/loggedStudent', verifyToken ,getLoggedStudent);

export default StudentRouter;