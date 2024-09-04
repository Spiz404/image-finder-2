import { useState } from "react";
import Gallery from "./Gallery";
import ButtonContainer from "./ButtonContainer";
import Sb from "./SearchBar";

type imageItem = {
    url : string,
    location : string
};

const ParentContainer = () => {

    const [images, setImages] = useState<Array<imageItem>>([]);

    return (

        <>

            <Sb setData={setImages}/>
            <ButtonContainer/>
            <Gallery data={images} setData={setImages}/>

        </>);
}

export default ParentContainer;