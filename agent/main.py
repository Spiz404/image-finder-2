from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from io import BytesIO
from PIL import Image
from clipModel import getImageEmbeddings, getTextEmbeddings 
import os
from data_sources import vector_db

app = FastAPI()

class QueryItem(BaseModel):
    query : str
    numresults : int

class ImageItem(BaseModel):
    id : str

'''

    upload method need to get an image, determine its embeddings
    and push them into the vector database

'''
@app.post("/upload")
async def upload(id : str, image : UploadFile):

    image_embeds = await getImageEmbeddings(image) 

    # store embeddings into vector database

    vector_db.add_element(id, image_embeds)
    vector_db.list_items()
    return {"item" : id}


@app.post("/delete")
async def delete(imageItem : ImageItem):
    path, id = imageItem.id.split('/')
    vector_db.delete_element(id)

'''
    input: query string (coming from user search bar)
    output: suggested image list

'''
@app.post("/query", response_model = list[str])
async def query(queryItem : QueryItem):

    text_embeds = getTextEmbeddings(queryItem.query)
    data = vector_db.query(text_embeds, queryItem.numresults)
    return data
