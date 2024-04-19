import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";

type SortType = "" | "Age" | "Common interests" | "Distance" | "Fame rating";

// Sample user data
const users = [
  { name: "Alice", age: 25, gender: "Female" },
  { name: "Bob", age: 30, gender: "Male" },
  { name: "Charlie", age: 22, gender: "Male" },
  { name: "Diana", age: 28, gender: "Female" },
];

const Page2: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(99);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>("");

  const filteredUsers = users.filter(
    (user) =>
      user.age >= minAge &&
      user.age <= maxAge &&
      (genderFilter ? user.gender === genderFilter : true) &&
      (searchTerm
        ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMinAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinAge(parseInt(event.target.value));
  };

  const handleMaxAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAge(parseInt(event.target.value));
  };

  const handleGenderFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGenderFilter(event.target.value === "All" ? null : event.target.value);
  };

  return (
    <div className="max-w-screen mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-1/3 px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
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
              console.log(newValue);
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
            value={genderFilter || "All"}
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
            onChange={(e) => setSortType(e.target.value as SortType)}
          >
            {["", "Age", "Common interests", "Distance", "Fame rating"].map(
              (sortType) => (
                <MenuItem value={sortType}>
                  {sortType === "" ? <em>Default</em> : sortType}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </div>
      <ul>
        {filteredUsers.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page2;
