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

classroomRouter.post("/create-classroom", verifyToken, createClassroom);

classroomRouter.get("/get-classrooms", verifyToken, getAllClassrooms);

classroomRouter.get("/get-classroom/:id", verifyToken, getClassroomById);

classroomRouter.put("/update-classroom/:id", verifyToken, updateClassroom);

classroomRouter.delete("/delete-classroom/:id", verifyToken, deleteClassroom);

export default classroomRouter;