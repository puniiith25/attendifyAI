from fastapi import FastAPI
from pillow_heif import register_heif_opener

# Register HEIF opener to support iPhone HEIC images globally
register_heif_opener()

from Routers.embedding_router import router as embedding_router
from Routers.detect_router import router as detect_router


app = FastAPI(title="AI Attendance Service")

@app.get("/")
def root():
    return {"message": "AI Attendance Service Running"}

app.include_router(embedding_router, prefix="/api")
app.include_router(detect_router, prefix="/api")