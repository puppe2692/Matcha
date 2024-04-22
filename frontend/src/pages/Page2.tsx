import React, { useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { User } from "../types";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import { set } from "react-hook-form";

type SortType = "" | "Age" | "Common interests" | "Distance" | "Fame rating";

const ProfileCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Paper className="p-3 flex flex-col h-64" elevation={4}>
      <div className="flex items-center mb-2">
        <Avatar
          src={user.profile_picture[0]}
          alt="Profile Picture"
          sx={{ width: 100, height: 100 }}
        />
        <div className="flex flex-col items-left ml-4 space-y-1 w-full overflow-hidden">
          <h6 className="w-full font-semibold text-l truncate">
            {user.username}, {user.age}
          </h6>
          <div className="flex items-center">
            <LocationOnIcon />
            <Typography variant="subtitle2">7 km away</Typography>
          </div>
          <div className="flex items-center">
            <StarIcon />
            <Typography variant="subtitle2">4.1</Typography>
          </div>
        </div>
      </div>
      <Divider className="w-full" sx={{ m: 1 }} />
      <div className="w-full overflow-hidden">
        <Typography
          variant="subtitle2"
          className="w-full truncate"
          sx={{ mb: 1 }}
        >
          {user.hashtags}
        </Typography>
        <Typography variant="body2" className="w-full line-clamp-4">
          {user.bio}
        </Typography>
      </div>
    </Paper>
  );
};

const ProfileGrid: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} sm={6} md={4} lg={3} zeroMinWidth key={user.id}>
          <ProfileCard user={user} />
        </Grid>
      ))}
    </Grid>
  );
};

const Page2: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [sortType, setSortType] = useState<SortType>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/all_interesting`,
          { withCredentials: true }
        );
        console.log(response);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const sortUsers = (sortingMode: SortType) => {
    setSortType(sortingMode);
    if (sortingMode === "") {
      // do the default sorting based on all elements => algo to define
      return;
    } else if (sortingMode === "Age") {
      setUsers((prevUsers) => prevUsers.sort((a, b) => a.age - b.age));
    }
  };

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.age >= minAge &&
          user.age <= maxAge &&
          (genderFilter === "All"
            ? true
            : user.gender === genderFilter.toLocaleLowerCase())
      )
    );
  }, [sortType, users, minAge, maxAge, genderFilter]);

  const handleGenderFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGenderFilter(event.target.value);
  };

  return (
    <div className="max-w-screen mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="w-1/3 mx-4 flex flex-col items-center">
          <label className="block mb-2 text-sm font-semibold" htmlFor="minAge">
            Filter by age:
          </label>
          <Slider
            getAriaLabel={() => "Age choice range"}
            value={[minAge, maxAge]}
            step={1}
            min={18}
            max={99}
            onChange={(_, newValue) => {
              if (Array.isArray(newValue)) {
                setMinAge(newValue[0]);
                setMaxAge(newValue[1]);
              }
            }}
            valueLabelDisplay="auto"
            getAriaValueText={(value) => value.toString()}
          />
          <p>
            {minAge} - {maxAge} year old
          </p>
        </div>
        <div className="w-1/3 mx-4">
          <label
            className="block mb-2 text-sm font-semibold"
            htmlFor="genderFilter"
          >
            Gender:
          </label>
          <select
            id="genderFilter"
            onChange={handleGenderFilterChange}
            value={genderFilter}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <FormControl fullWidth>
          <InputLabel id="sort-by">Sort by</InputLabel>
          <Select
            labelId="sort-by"
            id="sort-by"
            value={sortType}
            label="Sort by"
            onChange={(e) => sortUsers(e.target.value as SortType)}
          >
            {["", "Age", "Common interests", "Distance", "Fame rating"].map(
              (sortType, index) => (
                <MenuItem value={sortType} key={index}>
                  {sortType === "" ? <em>Default</em> : sortType}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </div>
      <ProfileGrid users={filteredUsers} />
    </div>
  );
};

export default Page2;
