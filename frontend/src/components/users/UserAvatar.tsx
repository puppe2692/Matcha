import React, { useState } from 'react';
import axios from 'axios';

const Avatar = ({ index }: { index: number }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type if needed
      // if (!selectedFile.type.startsWith('image/')) {
      //   setError('Please select an image file');
      //   return;
      // }
      const formData = new FormData();
formData.append('index', String(index));
axios.post(`http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/upload_images`, formData, {
	headers: {
		'Content-Type': 'multipart/form-data',
	},
	withCredentials: true,
})
	.then((response) => {
		setImage(response.data.imageUrl);
		setError("");
	})
	.catch((error) => {
		console.error(error);
		setError('Error uploading image');
	});
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-1/4 bg-gray-100 p-4 rounded-lg mr-4">
      {image ? (
        <img src={image} alt={`Profile ${index}`} />
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Avatar;