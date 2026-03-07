from Services.face_service import detect_faces

def generate_embedding(image):

    faces = detect_faces(image)

    if len(faces) == 0:
        return None

    face = max(
        faces,
        key=lambda f:(f.bbox[2]-f.bbox[0])*(f.bbox[3]-f.bbox[1])
    )

    return face.embedding.tolist()