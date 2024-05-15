import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";
import NotFound from "../components/NotFound";
import ImageSlider from "../components/Caroussel";
import MeCard from "../components/MeCard";
import { useParams } from "react-router-dom";
import { set } from "react-hook-form";

const MyPage: React.FC = () => {
  const { user } = useUserContext();
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string[]>([]);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        setUserImage([]); // Clear images before fetching new ones
        for (let i = 0; i < user!.profile_picture.length; i++) {
          try {
            const response = await axios.get(
              `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
              {
                params: { id: user?.id, index: i },
                responseType: "arraybuffer",
                withCredentials: true,
              }
            );
            //console.log("RESPONSE ALL IMAGE", response.data);
            if (response.status !== 404) {
              const base64Image = btoa(
                new Uint8Array(response.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
              setUserImage((prev) => [
                ...prev,
                `data:image/jpeg;base64,${base64Image}`,
              ]);
            }
          } catch (error) {
            // Log the error for the specific image request and continue to the next iteration
            console.error(`Error fetching user image ${i}:`, error);
          }
        }
      } catch (error) {
        console.error("Error fetching user data Image:", error);
      }
    };

    if (user) {
      fetchImg(); // Fetch images only if user data is available
    }
  }, []); // Run this effect whenever user data changes

  while (!userLoaded) {
    if (user) {
      setUserLoaded(true);
    }
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && userImage ? (
        <MeCard profile={user} userImage={userImage} />
      ) : null}
    </div>
  );
};

export default MyPage;
