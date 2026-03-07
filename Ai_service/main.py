from fastapi import FastAPI
from Routers.embedding_router import router as embedding_router
from Routers.detect_router import router as detect_router

app = FastAPI()

@app.get("/")
def root():

    return {"message":"AI Attendance Service Running"}


app.include_router(embedding_router, prefix="/api")

app.include_router(detect_router, prefix="/api")