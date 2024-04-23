import React, { useEffect, useState } from "react";
import {
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Drawer,
  Box,
  Divider,
} from "@mui/material";
import { User } from "../types";

type SortType = "" | "Age" | "Common interests" | "Distance" | "Fame rating";

const SliderFilter: React.FC<{
  labelText: string;
  minVal: number;
  maxVal: number;
  setMinVal: React.Dispatch<React.SetStateAction<number>>;
  setMaxVal: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  limitLow: number;
  limitHigh: number;
  additionalText?: string;
}> = ({
  labelText,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
  step,
  limitLow,
  limitHigh,
  additionalText,
}) => {
  return (
    <div className="flex flex-col">
      <label className="block mb-2 text-sm font-semibold" htmlFor="minAge">
        {labelText} {minVal} - {maxVal} {additionalText}
      </label>
      <Slider
        getAriaLabel={() => "Age choice range"}
        value={[minVal, maxVal]}
        step={step}
        min={limitLow}
        max={limitHigh}
        onChange={(_, newValue) => {
          if (Array.isArray(newValue)) {
            setMinVal(newValue[0]);
            setMaxVal(newValue[1]);
          }
        }}
        valueLabelDisplay="auto"
        getAriaValueText={(value) => value.toString()}
      />
    </div>
  );
};

const SearchFilterSection: React.FC<{
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
}> = ({ users, setUsers, setFilteredUsers }) => {
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [minDistance, setMinDistance] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(1000);
  const [minFameRating, setMinFameRating] = useState<number>(0);
  const [maxFameRating, setMaxFameRating] = useState<number>(100);
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [sortType, setSortType] = useState<SortType>("");
  const [open, setOpen] = useState(false);

  const sortUsers = (sortingMode: SortType) => {
    setSortType(sortingMode);
    if (sortingMode === "") {
      // do the default sorting based on all elements => algo to define
      return;
    } else if (sortingMode === "Age") {
      setUsers((prevUsers) => prevUsers.sort((a, b) => a.age - b.age));
    } else if (sortingMode === "Distance") {
      setUsers((prevUsers) =>
        prevUsers.sort((a, b) => a.distance - b.distance)
      );
    } else if (sortingMode === "Fame rating") {
      setUsers((prevUsers) =>
        prevUsers.sort((a, b) => a.fame_rating - b.fame_rating)
      );
    } else if (sortingMode === "Common interests") {
      setUsers((prevUsers) =>
        prevUsers.sort((a, b) => b.commonInterests - a.commonInterests)
      );
    }
  };

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.age >= minAge &&
          user.age <= maxAge &&
          user.distance >= minDistance &&
          user.distance <= maxDistance &&
          user.fame_rating >= minFameRating &&
          user.fame_rating <= maxFameRating &&
          (genderFilter === "All"
            ? true
            : user.gender === genderFilter.toLocaleLowerCase())
      )
    );
  }, [
    sortType,
    users,
    minAge,
    maxAge,
    minDistance,
    maxDistance,
    minFameRating,
    maxFameRating,
    genderFilter,
  ]);

  const handleGenderFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGenderFilter(event.target.value);
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Filter</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box className="p-4 space-y-6" sx={{ width: 250 }} role="presentation">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Divider className="w-full" sx={{ m: 1 }} />
          <SliderFilter
            labelText="Age:"
            minVal={minAge}
            maxVal={maxAge}
            setMinVal={setMinAge}
            setMaxVal={setMaxAge}
            step={1}
            limitLow={18}
            limitHigh={99}
            additionalText="years old"
          />
          <SliderFilter
            labelText="Distance:"
            minVal={minDistance}
            maxVal={maxDistance}
            setMinVal={setMinDistance}
            setMaxVal={setMaxDistance}
            step={5}
            limitLow={0}
            limitHigh={1000}
            additionalText="km away"
          />
          <SliderFilter
            labelText="Fame rating:"
            minVal={minFameRating}
            maxVal={maxFameRating}
            setMinVal={setMinFameRating}
            setMaxVal={setMaxFameRating}
            step={1}
            limitLow={0}
            limitHigh={100}
          />
          <div className="flex flex-col">
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
        </Box>
      </Drawer>
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
  );
};

export default SearchFilterSection;
