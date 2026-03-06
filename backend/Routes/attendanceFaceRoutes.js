import express from "express";

import {
    storeFaceImage,
    getSessionFaceImages,
    getStudentFaceProof,
    deleteFaceImage
} from "../Controllers/attendanceFaceController.js";

import { verifyToken } from "../Midddlewares/verifyToken.js";

const router = express.Router();

router.post("/store", verifyToken, storeFaceImage);

router.get("/session/:session_id", verifyToken, getSessionFaceImages);

router.get("/student/:student_id", verifyToken, getStudentFaceProof);

router.delete("/:id", verifyToken, deleteFaceImage);

export default router;