import express from "express";
import { authorizeRole, verifyToken } from "../Midddlewares/verifyToken.js";

import {
    createTeacher,
    getTeachers,
    getTeacherById,
    getLoggedTeacher,
    updateTeacher,
    deleteTeacher
} from "../Controllers/teacherController.js";

const teacherRouter = express.Router();

teacherRouter.post("/create-teacher", verifyToken, createTeacher);

teacherRouter.get("/get-teachers", verifyToken, getTeachers);

teacherRouter.get("/get-teacher/:id", verifyToken, getTeacherById);

teacherRouter.get("/me-teacher", verifyToken, getLoggedTeacher);

teacherRouter.put("/update-teacher/:id", verifyToken, updateTeacher);

teacherRouter.delete("/delete-teacher/:id", verifyToken, deleteTeacher);

export default teacherRouter;