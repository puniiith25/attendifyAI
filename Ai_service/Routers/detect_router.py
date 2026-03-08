from fastapi import APIRouter, UploadFile, Form
import numpy as np
import cv2

from Services.face_service import detect_faces
from Services.matching_service import match_faces
from database.db import load_section_embeddings

router = APIRouter()

@router.post("/detect")
async def detect_attendance(
    frame: UploadFile,
    section_id: str = Form(...)
):

    image_bytes = await frame.read()

    np_img = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

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