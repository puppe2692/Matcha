import React, { useState, useRef, useEffect } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";

const Avatar = ({
  index,
  setImageUpload,
}: {
  index: number;
  setImageUpload?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useUserContext();
  const [image, setImage] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Changing image");
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpg")
    ) {
      const newImageUrl = URL.createObjectURL(selectedFile);
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("url", newImageUrl);
      formData.append("index", String(index + 1));
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/upload_images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          updateUser({
            ...user,
            profile_picture: response.data.user.profile_picture,
          });
          setImage(true);
          console.log("IMAGE", image);
          if (setImageUpload) setImageUpload(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No file selected");
    }
  };

  const clearImage = () => {
    const formData = new FormData();
    console.log("INDEX F", index);
    console.log("INDEX +1 F", index);
    console.log("INDEX STRING F", String(index));
    formData.append("index", String(index));
    //console.log("FORMDATA", formData);
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/clear_image`,
        {
          index: index + 1,
        },
        { withCredentials: true }
      )
      .then((response) => {
        updateUser({
          ...user,
          profile_picture: response.data.user.profile_picture,
        });
        setImage(false);
        if (setImageUpload) setImageUpload(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="avatar-container relative">
      <img
        src={
          user && user.profile_picture && user.profile_picture[index]
            ? user.profile_picture[index]
            : "/avatar-default.jpg"
        }
        alt="User Avatar"
        className="w-[70px] h-[70px] object-cover rounded-full cursor-pointer mb-2"
        onClick={handleImageClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {image && (
        <button
          type="button"
          className="text-gray-400 bg-gray-700 border border-gray-600 rounded-lg text-sm w-6 h-6 ml-auto inline-flex justify-center items-center absolute -bottom-1 -right-1"
          onClick={clearImage}
        >
          X<span className="sr-only">Close modal</span>
        </button>
      )}
    </div>
  );
};

export default Avatar;
