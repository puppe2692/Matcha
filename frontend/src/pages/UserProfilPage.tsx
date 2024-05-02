import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";
import NotFound from "../components/NotFound";
import Carousel from "../components/Carousel";
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

const UserProfile: React.FC = () => {
  const { user } = useUserContext();
  const { username } = useParams();

  const [userProfile, setUserProfile] = useState<userProfils | null>(null);
  const [userImage, setUserImage] = useState<string[] | null>(null);
  const [carouImage, setCarouImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`/users/profile/${username}`);
        setUserProfile(userResponse.data);
        console.log("USER ", user);
        setUserImage(userResponse.data.profile_picture);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    fetchImg();
    console.log("CAROUSEL IMAGE 1", carouImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchImg();
    console.log("CAROUSEL IMAGE 2", carouImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchImg = async () => {
    if (!user) return <NotConnected message="User profile not found" />;
    if (!userProfile) return <NotFound />;
    try {
      for (let i = 0; i < userProfile.profile_picture.length; i++) {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
          {
            params: { id: user?.id, index: i },
            responseType: "arraybuffer",
            withCredentials: true,
          }
        );
        console.log("RESPONSE ALL IMAGE", response.data);
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setCarouImage((prev) => [
          ...prev,
          `data:image/jpeg;base64,${base64Image}`,
        ]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <NotConnected message="User profile not found" />;
  if (!userProfile) return <NotFound />;

  return (
    <div
      style={{
        maxWidth: "1200px",
        width: "100%",
        aspectRatio: "16/9",
        margin: "0 auto",
      }}
    >
      <ImageSlider images={carouImage} />
    </div>
  );
};

export default UserProfile;
