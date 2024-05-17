import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import UserCard from "../components/UserCard";
import {
  LikeButton,
  UnlikeButton,
  BanButton,
  UnBanButton,
} from "../components/Buttons";

const UserProfile: React.FC = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState<User>({} as User);
  const [userId, setUserId] = useState<number | null>(null);
  const [updateUserRelation, setUpdateUserRelation] = useState<Boolean>(false);
  const [userRelation, setUserRelation] = useState<string>("view");
  const [userImage, setUserImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUserContext();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /////// Location //////
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

  /////// User data //////

  useEffect(() => {
    // Call getRelation only if userId is set
    if (userId) {
      getRelation();
      console.log("USER REELATION", userRelation);
    }
  }, [userId, updateUserRelation]);

  const getRelation = async () => {
    console.log("GET RELATION 1");
    if (!user || !userId) return;
    console.log("GET RELATION 2 user", user.id, "userId", userId);
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_relations`,
        {
          params: { originId: user.id, destinationId: userId },
          withCredentials: true,
        }
      );
      console.log("GET RELATION 3");
      console.log("RELATION", response.data);
      setUserRelation(response.data.status);
    } catch (error) {
      console.error(error);
    }
  };

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
        // setUserImage(userResponse.data.profile_picture);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
    // console.log("USER NOT ME STATE", userProfile);
    // console.log("USER NOT ME STATE ID", userId);
  }, [username, user, user?.latitude, user?.longitude, user?.hashtags]);

  useEffect(() => {
    const fetchImg = async () => {
      if (userProfile.isfake) {
        setUserImage(userProfile.profile_picture);
        return;
      }
      try {
        setUserImage([]); // Clear images before fetching new ones
        for (let i = 0; i < userProfile!.profile_picture.length; i++) {
          if (!userProfile.profile_picture[i]) {
            continue;
          }
          try {
            const response = await axios.get(
              `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${userId}`,
              {
                params: { id: userId, index: i },
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

    if (userProfile && userId) {
      fetchImg(); // Fetch images only if user data is available
    }
  }, [userProfile]); // Run this effect whenever user data changes

  /////// Like/Dislike/Block //////

  useEffect(() => {
    // Call getRelation only if userId is set
    if (userId) {
      handleView();
    }
  }, [userId]);

  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/like`,
        {
          originId: user.id,
          destinationId: userId,
        },
        { withCredentials: true }
      );
      setUpdateUserRelation((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/unlike`,
        {
          originId: user.id,
          destinationId: userId,
        },
        { withCredentials: true }
      );
      setUpdateUserRelation((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/block`,
        {
          originId: user.id,
          destinationId: userId,
        },
        { withCredentials: true }
      );
      setUpdateUserRelation((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnBlock = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/unblock`,
        {
          originId: user.id,
          destinationId: userId,
        },
        { withCredentials: true }
      );
      setUpdateUserRelation((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async () => {
    if (!user) return;
    try {
      await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/view`,
        {
          originId: user.id,
          destinationId: userId,
        },
        { withCredentials: true }
      );
      setUpdateUserRelation((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {userProfile && userImage ? (
        <UserCard profile={userProfile} userImage={userImage} />
      ) : null}
      <div className="flex justify-center gap-4">
        {userRelation === "blocked" ? null : userRelation === "liked" ? (
          <UnlikeButton onClick={handleUnlike} />
        ) : (
          <LikeButton onClick={handleLike} />
        )}
        {userRelation === "blocked" ? (
          <UnBanButton onClick={handleUnBlock} />
        ) : (
          <BanButton onClick={handleBlock} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
