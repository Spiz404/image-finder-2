# Image Finder
## Description
Cloud based image gallery with text seach functionality.\\
Image are storage in a firebase cloud storage.\\
When an image gets uploaded, it's passed to the openAI CLIP neural network to generate
image embeddings. Those embeddings are saved in a milvus client, which is a vector database.\\
When a text query is sent, it get passed to the CLIP nn to generate text embeddings. Its embeddings
are then used to perfom a search in the vector database.

