import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";
import NotFound from "../components/NotFound";
import Carousel from "../components/Carousel";
import ImageSlider from "../components/Caroussel";
import { useParams } from "react-router-dom";

const Yassine = require("./Imagetest/Yassine.jpeg");
const deux = require("./Imagetest/2.png");
const trois = require("./Imagetest/3.jpeg");

const images = [Yassine, deux, trois];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`/users/profile/${username}`);
        setUserProfile(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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
      <ImageSlider images={images} />
    </div>
  );
};

export default UserProfile;
