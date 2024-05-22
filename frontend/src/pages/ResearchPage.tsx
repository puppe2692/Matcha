import React, { useEffect, useState } from "react";
import { User } from "../types";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import ProfileGrid from "../components/ProfileGrid";
import SearchFilterSection from "../components/SearchFilterSection";
import { useSearchParams } from "react-router-dom";

export type SortType =
  | ""
  | "Age"
  | "Common interests"
  | "Distance"
  | "Fame rating";

const ResearchPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { user, updateUser } = useUserContext();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const searchParams = useSearchParams({
    sortType: "",
    ascending: "true",
  })[0];

  const sortType = (searchParams.get("sortType") as SortType) || "";
  const ascending = searchParams.get("ascending") === "true";

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

  const calculateScore = (user1: User, user2: User) => {
    // we calculate a compund score based on distance, age gap, common interests and fame rating
    // for each score we calculate a value between 0 and 1

    // for distance we use an exponential decay function in order to give more weight to closer users
    // here for instance a user 1km away will have a score of 0.99, a user 10km away a score of 0.9 and a user 100km away will have a score of 0.37
    const distanceScore = 1 / Math.exp(user2.distance / 100);

    //same for age gap with a lower scale factor
    const ageScore = 1 / Math.exp(Math.abs(user1.age - user2.age) / 5);

    // for common interests we use a defined value that gives more value to the first common interests
    let commonInterestsScore = 0;
    if (user2.commonInterests >= 5) {
      commonInterestsScore = 1;
    } else if (user2.commonInterests === 4) {
      commonInterestsScore = 0.9;
    } else if (user2.commonInterests === 3) {
      commonInterestsScore = 0.75;
    } else if (user2.commonInterests === 2) {
      commonInterestsScore = 0.55;
    } else if (user2.commonInterests === 1) {
      commonInterestsScore = 0.3;
    }

    // for fame rating we use a linear scale based on the maximum fame rating of 100
    const fameRatingScore = user2.fame_rating / 100;

    // and then we use different weights, age is the most important then distance then common interests and fame rating
    return (
      3 * distanceScore +
      5 * ageScore +
      2 * commonInterestsScore +
      fameRatingScore
    );
  };

  const sortUsers = (
    sortingMode: SortType,
    sortedAscending: boolean = true
  ) => {
    if (sortingMode === "") {
      // in default mode we don't sort by ascending or descending we just show the most relevant users
      setUsers((prevUsers) =>
        [...prevUsers].sort((a, b) => b.matchingScore - a.matchingScore)
      );
      return;
    } else if (sortingMode === "Age") {
      setUsers((prevUsers) =>
        [...prevUsers].sort((a, b) =>
          sortedAscending ? a.age - b.age : b.age - a.age
        )
      );
    } else if (sortingMode === "Distance") {
      setUsers((prevUsers) =>
        [...prevUsers].sort((a, b) =>
          sortedAscending ? a.distance - b.distance : b.distance - a.distance
        )
      );
    } else if (sortingMode === "Fame rating") {
      setUsers((prevUsers) =>
        [...prevUsers].sort((a, b) =>
          sortedAscending
            ? a.fame_rating - b.fame_rating
            : b.fame_rating - a.fame_rating
        )
      );
    } else if (sortingMode === "Common interests") {
      setUsers((prevUsers) =>
        [...prevUsers].sort((a, b) =>
          sortedAscending
            ? a.commonInterests - b.commonInterests
            : b.commonInterests - a.commonInterests
        )
      );
    }
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
    const fetchUsers = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/all_interesting`,
          { withCredentials: true }
        );
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
            curUser.matchingScore = calculateScore(user, curUser);
            return curUser;
          })
        );
        sortUsers(sortType, ascending);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setUsers, user?.latitude, user?.longitude, user?.hashtags]);

  useEffect(() => {
    if (!user) return;
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user || !users) return;
    sortUsers(sortType, ascending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, ascending, user]);

  return (
    <div className="max-w-screen mx-auto p-4">
      {user ? (
        location ? (
          <>
            <SearchFilterSection
              users={users}
              setUsers={setUsers}
              setFilteredUsers={setFilteredUsers}
              sortUsers={sortUsers}
            />

            <ProfileGrid users={filteredUsers} />
          </>
        ) : (
          <p>Please select geolocation option</p>
        )
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
};

export default ResearchPage;
