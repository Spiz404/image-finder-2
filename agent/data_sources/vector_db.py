from pymilvus import MilvusClient, DataType, connections, db 
from dotenv import load_dotenv
import os

EMBEDS_LENGTH = 512
MILVUS_COLLECTION_NAME = "image_collection"

# loading enviornment variables
load_dotenv()

schema = MilvusClient.create_schema(
    auto_id = False,
    enable_dynamic_field = False
)

schema.add_field(field_name="image_id", datatype = DataType.VARCHAR, is_primary=True, max_length=100)
schema.add_field(field_name="vector",datatype = DataType.FLOAT_VECTOR, dim=EMBEDS_LENGTH)

db_client = MilvusClient(uri = os.getenv('MILVUS_CLIENT_URL'))

if db_client.has_collection(collection_name=MILVUS_COLLECTION_NAME) == False:

    print("creating collection")
    try:

        db_client.create_collection(
            collection_name=MILVUS_COLLECTION_NAME,
            schema = schema,
            metric_type="L2"
        )
    
    except Exception as e:
        print(f"Error while creating {MILVUS_COLLECTION_NAME}: {e}")

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="vector",
    metric_type="COSINE",
    index_type="IVF_FLAT",
    index_name="vector_index",
    params={ "nlist": 128 }
)

db_client.create_index(
    collection_name=MILVUS_COLLECTION_NAME,
    index_params=index_params
)

db_client.load_collection(
    collection_name=MILVUS_COLLECTION_NAME,
    replica_number=1 
)

# add element into the vector database 
def add_element(id : str, embeds : list[float]):
    db_client.insert(collection_name = MILVUS_COLLECTION_NAME, data = {'image_id' : id, 'vector' : embeds})

# delete element from vector database
def delete_element(image_id : str):
    db_client.delete(collection_name=MILVUS_COLLECTION_NAME, pks=[image_id])

# search for images
def query(text_embeds : list[float]):
    db_client.load_collection(collection_name=MILVUS_COLLECTION_NAME)

    images_elements = db_client.search(
        collection_name = MILVUS_COLLECTION_NAME,
        data = [text_embeds],
        limit = 3,
        search_params = {"metric_type" : "COSINE", "params" : {}}
    )

    # result image ids sorted by distance 
    images_ids = map(lambda e : e["id"], images_elements[0])

    return images_ids 
    

def list_items():
    print(db_client.query(collection_name=MILVUS_COLLECTION_NAME, filter="", output_fields=["*"], limit=10))