import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";
import NotFound from "../components/NotFound";
import ImageSlider from "../components/Caroussel";
import { useParams } from "react-router-dom";
import { set } from "react-hook-form";

// const Yassine = require("./Imagetest/Yassine.jpeg");
// const deux = require("./Imagetest/2.png");
// const trois = require("./Imagetest/3.jpeg");

// const images = [Yassine, deux, trois];

interface userProfils {
  username: string;
  gender: string;
  sex_pref: string;
  bio: string;
  age: number;
  hashtags: string[];
  profile_picture: string[];
  latitude: number;
  longitude: number;
  fame_rating: number;
  distance: number;
  commonInterests: number;
  matchingScore: number;
}

const MyPage: React.FC = () => {
  const { user } = useUserContext();
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string[]>([]);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        setUserImage([]); // Clear images before fetching new ones
        for (let i = 0; i < user!.profile_picture.length; i++) {
          const response = await axios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
            {
              params: { id: user?.id, index: i },
              responseType: "arraybuffer",
              withCredentials: true,
            }
          );
          //console.log("RESPONSE ALL IMAGE", response.data);
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
    <div
      style={{
        maxWidth: "1200px",
        width: "100%",
        aspectRatio: "16/9",
        margin: "0 auto",
      }}
    >
      <ImageSlider images={userImage} />
    </div>
  );
};

export default MyPage;
