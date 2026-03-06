import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    createSection,
    deleteSection,
    getSectionDashboard,
    getSections,
    getSingleSection,
    updateSection
} from "../Controllers/sectionController.js";

const secRouter = express.Router();

secRouter.post("/create-sec", verifyToken, createSection);

secRouter.get("/get-secs", verifyToken, getSections);

secRouter.get("/get-sec/:id", verifyToken, getSingleSection);

secRouter.put("/update-sec/:id", verifyToken, updateSection);

secRouter.delete("/delete-sec/:id", verifyToken, deleteSection);

secRouter.get("/sec-dashboard/:id", verifyToken, getSectionDashboard);

export default secRouter;