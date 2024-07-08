import React, { useState, useRef, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";

const Avatar = ({
  index,
  setImageUpload,
  setNewImage,
  setError,
}: {
  index: number;
  setImageUpload?: React.Dispatch<React.SetStateAction<boolean>>;
  setNewImage?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useUserContext();
  const [image, setImage] = useState<boolean>(false);
  const [imageUpdate, setImageUpdate] = useState<string | null>(null);

  useEffect(() => {
    const fetchImg = async () => {
      if (!user || !user?.profile_picture[index]) return;
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
          {
            params: { id: user?.id, index: index },
            responseType: "arraybuffer",
            withCredentials: true,
          }
        );
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageUpdate(`data:image/jpeg;base64,${base64Image}`);
        setImage(true);
      } catch {}
    };
    fetchImg();
  }, [user, index]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUpdate(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpg")
    ) {
      const formData = new FormData();
      formData.append("image", selectedFile);
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
          if (setError) setError("");
          if (setImageUpload) setImageUpload(true);
          if (setNewImage) setNewImage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (setError)
        setError("Invalid file type, you must upload a jpeg, jpg or png file");
      console.error("No file selected");
    }
  };

  const clearImage = () => {
    const formData = new FormData();
    formData.append("index", String(index));
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
        if (setImageUpdate) setImageUpdate(null);
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
        src={imageUpdate ? imageUpdate : "/avatar-default.jpg"}
        alt="User Avatar ta mere"
        className="w-[70px] h-[70px] object-cover rounded-full cursor-pointer mb-2"
        onClick={handleImageClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {image && index !== 0 && (
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
