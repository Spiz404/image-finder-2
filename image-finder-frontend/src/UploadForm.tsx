import React, { useState } from "react";
import axios from "axios";
import "./App.css";

interface UploadFormProps {
    stateFun : () => void;
}

// stateFun is a function that closes the upload modal

const UploadForm : React.FC<UploadFormProps> = ({stateFun}) => {

    //const [file, setFile] = useState<File>();

    const handleChange = (e : any) => {

        //setFile(e.target.files[0]);
        const image : File = e.target.files[0];
        console.log(image);
        const formData = new FormData();
        formData.set('image', image);
        console.log(formData);
        console.log("sending image...");
        // post request to upload image
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/images/upload`, formData)
        .then((data) => {console.log("success")})
        .catch((err) => {console.log("errore", err)});

        stateFun();
    };

    return (
        <div className="modal-container">
            <h1 style={{color : "white"}}> upload image </h1>
            <input  style = {{color : "white" }} onChange={handleChange} type="file"/>
        </div>
    ); 
};

export default UploadForm;
