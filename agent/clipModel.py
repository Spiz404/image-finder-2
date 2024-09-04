from transformers import CLIPProcessor, CLIPModel
from fastapi import UploadFile
from PIL import Image
from io import BytesIO
import torch

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

async def getImageEmbeddings(image : UploadFile):

    filename = image.filename
    image_data = await image.read()
    image = Image.open(BytesIO(image_data))

    # get image embeddings

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        image_embeds = model.get_image_features(**inputs) 

    image_embeds = image_embeds / image_embeds.norm(p=2, dim=-1, keepdim=True)

    image_embeds = image_embeds.cpu().numpy().tolist()[0]

    return image_embeds

def getTextEmbeddings(text: str) -> list[float]:

    inputs = processor(text=[text], return_tensors="pt", padding=True)

    with torch.no_grad():
        text_embeds = model.get_text_features(**inputs)

    text_embeds = text_embeds / text_embeds.norm(p=2, dim=-1, keepdim=True)
 
    text_embeds = text_embeds.cpu().numpy().tolist()[0]

    return text_embeds