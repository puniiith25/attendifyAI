import express from "express";
import { verifyToken, authorizeRole } from "../Midddlewares/verifyToken.js";

import {
    createClassroom,
    getAllClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom
} from "../Controllers/classRoomController.js";

const classroomRouter = express.Router();

classroomRouter.post("/create-classroom", verifyToken, authorizeRole("admin"), createClassroom);

classroomRouter.get("/get-classrooms", verifyToken, getAllClassrooms);

classroomRouter.get("/get-classroom/:id", verifyToken, getClassroomById);

classroomRouter.put("/update-classroom/:id", verifyToken, authorizeRole("admin"), updateClassroom);

classroomRouter.delete("/delete-classroom/:id", verifyToken, authorizeRole("admin"), deleteClassroom);

export default classroomRouter;