// components/ImagePreview.tsx
import React from "react";
import Image from "next/image";
import { ImageList, ImageListItem } from "@mui/material";

type Props = {
  images;
};

const ImagePreview = ({ images }: Props) => {
  return (
    <ImageList sx={{ width: 500, height: 164 }} cols={2} rowHeight={164}>
      {images.map((image) => {
        return (
          <ImageListItem key={image.name}>
            {/* <img
              src={image.src}
              // srcSet={`${image.src}`}
              alt={image.name}
              loading="lazy"
              className="custom-image-display"
            /> */}
            <Image 
              src={image.src} 
              alt={image.name} 
              className="custom-image-display" 
              width="164" 
              height="164"
              ></Image>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default ImagePreview;
