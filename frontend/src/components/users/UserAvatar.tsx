import React, { useState, useRef } from 'react';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';

const Avatar = ({ index }: { index: number }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useUserContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log("PROFILE PICTURE", user?.profile_picture);
    console.log("SELECTED FILE", selectedFile);
    if (selectedFile && ( selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg')) {
        const newImageUrl = URL.createObjectURL(selectedFile);
        console.log("NEW IMAGE URL", newImageUrl);
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('url', newImageUrl);
        formData.append('index', String(index));
        axios.post(`http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/upload_images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
	        },
	        withCredentials: true,
        })
	      .then((response) => {
          // Copy the profile_picture array
          let newProfilePicture = response.data.user.profile_picture;
          // Update the user object with the modified profile_picture array
          updateUser({ ...user, profile_picture: newProfilePicture });
          setImage(response.data.imageUrl);
	      	setError("");
	      })
	      .catch((error) => {
	      	console.error(error);
	      	setError('Error uploading image');
	      });
    } else {
      console.error('No file selected');
    }
  };

const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

  return (
		<div className="avatar-container">
			<img 
				src={user && user.profile_picture && user.profile_picture[index] ? user.profile_picture[index] : '../../../public/avatar-default.jpg'} 
				alt="User Avatar" 
				className="w-20 h-20 object-cover rounded-full cursor-pointer mb-2" 
				onClick={handleImageClick} 
			/>
			<input 
				type="file" 
				ref={fileInputRef} 
				onChange={handleImageChange} 
				className="hidden" 
			/>
		</div>
  );
};

export default Avatar;