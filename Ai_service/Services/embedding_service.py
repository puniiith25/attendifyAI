import cv2
from Services.face_service import detect_faces


def generate_embedding(image):
    try:

        # Ensure image exists
        if image is None:
            return None

        # Convert grayscale → RGB
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

        # Convert RGBA → RGB
        if image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)

        # Resize for better detection
        height, width = image.shape[:2]

        if width > 1280:
            scale = 1280 / width
            image = cv2.resize(image, (int(width * scale), int(height * scale)))

        # Detect faces
        faces = detect_faces(image)

        if not faces or len(faces) == 0:
            return None

        # Select largest face
        face = max(
            faces,
            key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])
        )

        # Convert embedding to list
        embedding = face.embedding.tolist()

        return embedding

    except Exception as e:
        print("Embedding error:", str(e))
        return None