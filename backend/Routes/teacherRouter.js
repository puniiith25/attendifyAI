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

teacherRouter.post("/create-teacher", verifyToken, authorizeRole("admin"), createTeacher);

teacherRouter.get("/get-teachers", verifyToken, authorizeRole("admin"), getTeachers);

teacherRouter.get("/get-teacher/:id", verifyToken, authorizeRole("admin"), getTeacherById);

teacherRouter.get("/my-teacher", verifyToken, authorizeRole("teacher"), getLoggedTeacher);

teacherRouter.put("/update-teacher/:id", verifyToken, authorizeRole("admin"), updateTeacher);

teacherRouter.delete("/delete-teacher/:id", verifyToken, authorizeRole("admin"), deleteTeacher);

export default teacherRouter;