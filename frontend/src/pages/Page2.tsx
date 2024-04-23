import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import { User } from "../types";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import ProfileGrid from "../components/ProfileGrid";
import SearchFilterSection from "../components/SearchFilterSection";

const Page2: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { user } = useUserContext();

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

  const findCommonInterests = (user1: User, user2: User) => {
    var i = 0;
    for (const interest in user1.hashtags) {
      if (user2.hashtags.includes(interest)) {
        i++;
      }
    }
    return i;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/all_interesting`,
          { withCredentials: true }
        );
        console.log(response);
        setUsers(response.data.users);
        setUsers((prevUsers) =>
          prevUsers.map((curUser) => {
            curUser.distance = findDistanceUser(
              user.latitude,
              user.longitude,
              curUser.latitude,
              curUser.longitude
            );
            curUser.commonInterests = findCommonInterests(user, curUser);
            return curUser;
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [user]);

  return (
    <div className="max-w-screen mx-auto p-4">
      <SearchFilterSection
        users={users}
        setUsers={setUsers}
        setFilteredUsers={setFilteredUsers}
      />

      {user ? (
        <ProfileGrid users={filteredUsers} />
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </div>
  );
};

export default Page2;
