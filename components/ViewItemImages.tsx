import { Box, Modal, ImageList, ImageListItem } from "@mui/material";
import Image from "next/image";

const ViewItemImages = ( {images, setShowImages, setImages} ) => {

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const handleClose = () => {
        setShowImages(false);
        setImages([]);
    }

  return (
    <div>
        <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <ImageList sx={{ width: 1, height: 1 }} cols={2} rowHeight={'auto'}>
            {images.map((image) => {
                return (
                <ImageListItem key={image.name}>
                    <img 
                    src={image.src} 
                    alt={image.name} 
                    className="custom-image-display" 
                    width="100%" 
                    height="100%"
                    ></img>
                </ImageListItem>
                );
            })}
            </ImageList>
        </Box>
        </Modal>
    </div>
  );
};

export default ViewItemImages;