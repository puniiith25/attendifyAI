from insightface.app import FaceAnalysis

model = FaceAnalysis(providers=["CPUExecutionProvider"])
model.prepare(ctx_id=0)

def detect_faces(image):

    return model.get(image)