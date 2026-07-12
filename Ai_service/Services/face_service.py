from insightface.app import FaceAnalysis

# load model once
model = FaceAnalysis(providers=["CPUExecutionProvider"])
model.prepare(ctx_id=0, det_size=(1280, 1280))

def detect_faces(image):
    return model.get(image)