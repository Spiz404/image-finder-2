import { useState, useEffect  } from "react";
import axios from "axios";
import { ImageList, ImageListItem, Pagination } from "@mui/material";
import ImageModal from "./ImageModal";

type imageItem = {
    url : string,
    location : string
};

const Gallery = ({data, setData}) => {

    //const [data, setData] = useState<Array<imageItem>>([]);
    const [imageDetailModal, setImageDetailModal] = useState<boolean>(false);
    const [image, setImage] = useState<imageItem>({url : "", location : ""});

    const updateList = (image : imageItem) => {
        console.log("componente gallery, image", image.url);

        setData(data.filter((im) => {
            return im.url !== image.url
        }));

    };

    const fetchImagesUrl = async () => {

            const url = import.meta.env.VITE_BACKEND_URL + "/images";
            const data  = await axios.get(import.meta.env.VITE_BACKEND_URL + "/images");
            setData(data.data as Array<imageItem>);

    };

    const handleImageClick = (item : imageItem) => {
        setImage(item);
        setImageDetailModal(true);
    }

    useEffect(() => { fetchImagesUrl() }, []);

        return (
            <div className = "main-container">
                <div className="gallery-container">
                    {data ?
                        (
                        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                            {data.map((item : imageItem) => (
                                <ImageListItem  onClick = {() => handleImageClick(item)} key = {item.location}> 
                                    <img   src={item.url}></img> 
                                </ImageListItem>
                            ))}
                        </ImageList>
                        ) 
                        :

                        <h2> Loading ... </h2>
                    }
                    <Pagination count={-1}></Pagination>
                </div>

                { imageDetailModal && <ImageModal imageModal = {imageDetailModal} onDelete = {(image : imageItem) => updateList(image) } onClose = {() => setImageDetailModal(false)} item ={image}></ImageModal> }
            </div>
        );

};

export default Gallery;