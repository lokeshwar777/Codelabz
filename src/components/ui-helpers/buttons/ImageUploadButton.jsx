import React, { useState, useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton, LinearProgress } from "@mui/material";
import firebase from "../../../config";
import PropTypes from "prop-types";

function ImageUploadButton({ isUploading, setIsUploading, onImageUpload }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  async function handleImageUpload(event) {
    setIsUploading(true);
    const file = event.target.files[0];

    const uniqueId = new Date().getTime();
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const imageRef = storageRef.child(
      `tutorial_images/${uniqueId}_${file.name}`
    );

    try {
      const uploadTask = imageRef.put(file);

      // Update progress
      uploadTask.on("state_changed", snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      });

      // Get download URL when upload is complete
      uploadTask.then(async snapshot => {
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log(downloadURL)
        setSelectedImage(downloadURL); // Set selected image to display
        onImageUpload(downloadURL);
        setIsUploading(false);
        setUploadProgress(0); // Reset upload progress after upload
      });
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
    }
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {/* Hidden file input to trigger file selection */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      {/* Display upload progress */}
      {isUploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            height: 8, 
            borderRadius: 4, 
            backgroundColor: "rgba(0, 0, 0, 0.1)", 
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#03AAFA" 
            }
          }}
        />
      )}

      {/* Display uploaded image */}
      {!isUploading && selectedImage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 400,
            maxHeight: 400,
            overflow: "hidden" 
          }}
        >
          <img
            src={selectedImage}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain" 
            }}
          />
        </div>
      )}

      {/* Display image icon always, but disabled during upload */}
      <IconButton onClick={handleClick} disabled={isUploading}>
        <ImageIcon />
      </IconButton>
    </>
  );
}

ImageUploadButton.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  setIsUploading: PropTypes.func.isRequired,
};

export default ImageUploadButton;
