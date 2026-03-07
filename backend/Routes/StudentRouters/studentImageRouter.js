import express from "express";
import { verifyToken } from "../../Midddlewares/verifyToken.js";
import upload from "../../Midddlewares/upload.js";
import { deleteMyImage, getMyImage, updateMyImage, uploadMyImage } from "../../Controllers/studentImageController.js";



const StudentImageRouter = express.Router();





/* Upload Image */
StudentImageRouter.post(
    "/image-add",
    verifyToken,
    upload.single("image"),
    uploadMyImage
);


/* Get Image */
StudentImageRouter.get(
    "/image-get",
    verifyToken,
    getMyImage
);


/* Update Image */
StudentImageRouter.put(
    "/image-upd",
    verifyToken,
    upload.single("image"),
    updateMyImage
);


/* Delete Image */
StudentImageRouter.delete(
    "/image-del",
    verifyToken,
    deleteMyImage
);


export default StudentImageRouter;