import Button from '@mui/material/Button'
import { useState } from 'react';
import UploadForm from './UploadForm';
import DeleteForm from './DeleteForm';

const ButtonContainer = () => {

    const [OpenModal, setOpenModal] = useState<boolean>(false);

    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    function closeDelete() {
        setDeleteModal(false);
    }

    function closeModal () {
        setOpenModal(false);
    };
    // <Button variant='contained' onClick={(e) => setDeleteModal(true)} color = 'error' className='delete-button'>Delete Image</Button> 
    return  (
        <div>
            {!OpenModal ?  
                (
                    <div className='button-container'>
                        <Button variant='contained' onClick={(e) => setOpenModal(true)} color= 'success' className ='upload-button'>Upload</Button>
                    </div> 
                )
                : 
                (
                   <UploadForm stateFun={closeModal}></UploadForm>
                )
            }

            { !OpenModal && deleteModal && 

                    <DeleteForm></DeleteForm>
            }
        </div>
    );
}

export default ButtonContainer;