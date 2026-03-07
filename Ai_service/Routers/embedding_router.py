from fastapi import APIRouter
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

    response = requests.get(data.image_url)

    img = Image.open(io.BytesIO(response.content))
    img_np = np.array(img)

    embedding = generate_embedding(img_np)

    return {"embedding": embedding}