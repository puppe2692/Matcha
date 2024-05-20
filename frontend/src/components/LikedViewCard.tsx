import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { User } from "../types";
import axios from "axios";
import LightProfileGrid from "./LightProfileGrid";

const LikedViewCard: React.FC<{ profile: User }> = ({ profile }) => {
  const { user, updateUser } = useUserContext();
  const [likeUsers, setLikeUsers] = useState<User[]>([]);
  const [viewUsers, setViewUsers] = useState<User[]>([]);
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
    const fetchLikeUsers = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/liked_users`,
          { withCredentials: true }
        );
        setLikeUsers(response.data.users);
        setLikeUsers((prevLikeUsers) =>
          prevLikeUsers.map((curLikeUser) => {
            curLikeUser.distance = findDistanceUser(
              user.latitude,
              user.longitude,
              curLikeUser.latitude,
              curLikeUser.longitude
            );
            return curLikeUser;
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    const fetchViewUsers = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/viewed_users`,
          { withCredentials: true }
        );
        setViewUsers(response.data.users);
        setViewUsers((prevViewUsers) =>
          prevViewUsers.map((curViewUser) => {
            curViewUser.distance = findDistanceUser(
              user.latitude,
              user.longitude,
              curViewUser.latitude,
              curViewUser.longitude
            );
            return curViewUser;
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikeUsers();
    fetchViewUsers();
  }, [
    user,
    setLikeUsers,
    setViewUsers,
    user?.latitude,
    user?.longitude,
    user?.hashtags,
  ]);

  useEffect(() => {
    if (!user) return;
    getLocation();
  }, [user]);

  return (
    <div>
      <div className="p-3 flex flex-row">
        <div className="flex flex-col w-1/2 items-center">
          <h6 className="w-full font-semibold text-l truncate text-center">
            View
          </h6>
          <Divider className="w-11/12" sx={{ m: 1 }} />
        </div>
        <div className="flex flex-col w-1/2 items-center">
          <h6 className="w-full font-semibold text-l truncate text-center">
            Like
          </h6>
          <Divider className="w-11/12" sx={{ m: 1 }} />
        </div>
      </div>
      <div className="p-3 flex flex-row">
        <LightProfileGrid users={viewUsers.slice(0, 3)} />
        <LightProfileGrid users={likeUsers.slice(0, 3)} />
      </div>
      <div className="p-3 flex flex-row">
        {viewUsers.length > 3 ? (
          <div className="flex flex-col w-1/2 items-center">
            <Link to="/view" className="text-blue-500">
              See More
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-1/2 items-center"></div>
        )}
        {likeUsers.length > 3 ? (
          <div className="flex flex-col w-1/2 items-center">
            <Link to="/like" className="text-blue-500">
              See More
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-1/2 items-center"></div>
        )}
      </div>
    </div>
  );
};

export default LikedViewCard;
