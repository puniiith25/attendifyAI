from fastapi import APIRouter, UploadFile, Form
import numpy as np
import cv2
from PIL import Image, ImageOps
import io

from Services.face_service import detect_faces
from Services.matching_service import match_faces
from database.db import load_section_embeddings

router = APIRouter()

@router.post("/detect")
async def detect_attendance(
    frame: UploadFile,
    section_id: str = Form(...)
):
    try:
        image_bytes = await frame.read()

        # Load image via PIL to fix orientation using EXIF data
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img = ImageOps.exif_transpose(pil_img)

        # Convert RGB (PIL) to BGR (OpenCV format expected by models)
        image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        if image is None:
            return {"error": "Invalid image"}

        faces = detect_faces(image)

        students = load_section_embeddings(section_id)

        results = match_faces(image, faces, students)

        print("Faces detected:", len(faces))
        print("Matches:", results)

        return {
            "faces_detected": len(faces),
            "students": results
        }
    except Exception as e:
        print("Detection router error:", str(e))
        return {"error": f"Internal detection error: {str(e)}"}