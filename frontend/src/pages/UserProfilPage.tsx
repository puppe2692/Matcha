import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Avatar, Typography, Divider, Grid } from "@mui/material";
import { User } from "../types";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotFound from "../components/NotFound";
import ImageSlider from "../components/Caroussel";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import UserCard from "../components/UserCard";

// const Yassine = require("./Imagetest/Yassine.jpeg");
// const deux = require("./Imagetest/2.png");
// const trois = require("./Imagetest/3.jpeg");

// const images = [Yassine, deux, trois];

// interface userProfils {
//   username: string;
//   gender: string;
//   sex_pref: string;
//   bio: string;
//   age: number;
//   hashtags: string[];
//   profile_picture: string[];
//   latitude: number;
//   longitude: number;
//   fame_rating: number;
//   distance: number;
//   commonInterests: number;
//   matchingScore: number;
// }

const UserProfile: React.FC = () => {
  //const { user } = useUserContext();
  const { username } = useParams();

  const [userProfile, setUserProfile] = useState<User>({} as User);
  const [userId, setUserId] = useState<number | null>(null);
  const [userImage, setUserImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUserContext();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const findDistanceUser = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const r = 6371;
    const p = Math.PI / 180;
    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p))) /
        2;

    return 2 * r * Math.asin(Math.sqrt(a));
  };

  const updateUserLocation = async () => {
    if (!location || !user) {
      return;
    }
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/update_location`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        { withCredentials: true }
      );
      updateUser({
        ...user,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIPLocation = async () => {
    const response = await axios.get("https://ipapi.co/json/");
    setLocation({
      latitude: response.data.latitude,
      longitude: response.data.longitude,
    });
    updateUserLocation();
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          updateUserLocation();
        },
        () => {
          fetchIPLocation();
        }
      );
    } else {
      fetchIPLocation();
    }
  };

  useEffect(() => {
    if (!user) return;
    getLocation();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`/users/profile/${username}`);
        setUserProfile(userResponse.data);
        setUserProfile((prev) => ({
          ...prev,
          distance: findDistanceUser(
            user!.latitude,
            user!.longitude,
            userResponse.data.latitude,
            userResponse.data.longitude
          ),
        }));
        setUserId(userResponse.data.id);
        console.log("USER NOT ME", userResponse.data);
        setUserImage(userResponse.data.profile_picture);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
    console.log("USER NOT ME STATE", userProfile);
    console.log("USER NOT ME STATE ID", userId);
  }, [username, user, user?.latitude, user?.longitude, user?.hashtags]);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        setUserImage([]); // Clear images before fetching new ones
        for (let i = 0; i < userProfile!.profile_picture.length; i++) {
          const response = await axios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${userId}`,
            {
              params: { id: userId, index: i },
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

    if (userProfile && userId) {
      fetchImg(); // Fetch images only if user data is available
    }
  }, [userProfile]); // Run this effect whenever user data changes

  return (
    <div>
      {userProfile && userImage ? (
        <UserCard profile={userProfile} userImage={userImage} />
      ) : null}
    </div>
  );
};

export default UserProfile;

{
  /* <div
style={{
  maxWidth: "1200px",
  width: "100%",
  aspectRatio: "16/9",
  margin: "0 auto",
}}
>
<ImageSlider images={userImage} />
</div> */
}
