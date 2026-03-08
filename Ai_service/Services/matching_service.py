import cv2
import base64
from utils.similarity import cosine_similarity
from config import THRESHOLD


def match_faces(image, faces, students):

    detected = []

    for face in faces:

        emb = face.embedding

        best_id = None
        best_score = 0

        for st in students:

            score = cosine_similarity(emb, st["embedding"])

            if score > best_score:
                best_score = score
                best_id = st["student_id"]

        if best_score >= THRESHOLD:
            detected.append({
                "student_id": best_id,
                "confidence": float(best_score),
                "status": "matched"
            })
        else:
            detected.append({
                "student_id": None,
                "confidence": float(best_score),
                "status": "unknown"
            })

    return detected