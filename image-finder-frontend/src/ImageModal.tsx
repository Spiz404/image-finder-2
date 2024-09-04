import { Button } from "@mui/material";
import { useState } from "react";
import  Dialog  from "@mui/material/Dialog";
import  DialogContent  from "@mui/material/DialogContent"; 
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import DeleteXIcon from "./assets/x-icon";

type imageItem = {
    location : string,
    url : string
}

const ImageModal = ({ item, imageModal, onClose, onDelete } : {item : imageItem, imageModal : boolean, onClose : Function, onDelete : Function}) => {

    console.log("image to show ", item.location);
    console.log("image url", item.url);

    const [dialogOpen, setDialogOpen] = useState<boolean>(true);
   
    const deleteImage = () => {

        axios.delete(import.meta.env.VITE_BACKEND_URL + '/images', {
            data : {image : item.location}
        })
        .then((res) => {
            console.log("delete completed");

            // closing modal if delete complete successfully
            onDelete(item);
            onClose();
            
        })
        .catch((err) => {
            console.log(err);
        })
        
        

    };

    return (
        <Dialog open = {imageModal}>

            <DialogContent>
                <div onClick = {() => onClose()} className="close-button-container"><DeleteXIcon/></div>
                <div className = "dialog-container">
                    <img src = {item.url} className="delete-image"></img>
                    <Button variant = "contained" startIcon = {<DeleteIcon></DeleteIcon>} color = "error" onClick = {deleteImage}> delete image </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;