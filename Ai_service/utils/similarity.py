import numpy as np

def cosine_similarity(a, b):

    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)

    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))