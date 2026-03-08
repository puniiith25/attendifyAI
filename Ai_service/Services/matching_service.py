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

        x1, y1, x2, y2 = face.bbox.astype(int)

        h, w = image.shape[:2]

        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(w, x2)
        y2 = min(h, y2)

        crop = image[y1:y2, x1:x2]

        crop_base64 = None

        if crop.size > 0:
            _, buf = cv2.imencode(".jpg", crop)
            crop_base64 = base64.b64encode(buf).decode()

        if best_score >= THRESHOLD:

            detected.append({
                "student_id": best_id,
                "confidence": float(best_score),
                "status": "matched",
                "crop": crop_base64
            })

        else:

            detected.append({
                "student_id": None,
                "confidence": float(best_score),
                "status": "unknown",
                "crop": crop_base64
            })

    return detected