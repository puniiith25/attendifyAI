from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import numpy as np
from PIL import Image
import io

from Services.embedding_service import generate_embedding



router = APIRouter()

class ImageRequest(BaseModel):
    image_url: str


@router.post("/create-embedding")
def create_embedding(data: ImageRequest):
    try:
        response = requests.get(data.image_url, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch image from URL: {str(e)}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to download image. Status: {response.status_code}. Content: {response.text[:200]}"
        )

    try:
        img = Image.open(io.BytesIO(response.content))
        img_np = np.array(img)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to parse image. Content-Type: {response.headers.get('Content-Type')}. Error: {str(e)}"
        )

    embedding = generate_embedding(img_np)

    return {"embedding": embedding}