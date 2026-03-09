import express from "express";
import { verifyToken } from "../Midddlewares/verifyToken.js";

import {
    createSection,
    deleteSection,
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


export default secRouter;