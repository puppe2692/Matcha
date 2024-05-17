import React, { useEffect, useState } from "react";
import {
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Drawer,
  Box,
  Divider,
  SelectChangeEvent,
  ListItemText,
  IconButton,
} from "@mui/material";
import { User } from "../types";
import { HASHTAGS } from "../shared/misc";
import Checkbox from "@mui/material/Checkbox";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useSearchParams } from "react-router-dom";
import { SortType } from "../pages/ResearchPage";

const SliderFilter: React.FC<{
  labelText: string;
  minVal: number;
  maxVal: number;
  setMinVal: React.Dispatch<React.SetStateAction<number>>;
  setMaxVal: React.Dispatch<React.SetStateAction<number>>;
  displayRange: number[];
  setDisplayRange: React.Dispatch<React.SetStateAction<number[]>>;
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
  displayRange,
  setDisplayRange,
  step,
  limitLow,
  limitHigh,
  additionalText,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="block mb-2 text-sm font-semibold" htmlFor="minAge">
        {labelText} {minVal} - {maxVal} {additionalText}
      </label>
      <Slider
        getAriaLabel={() => "Age choice range"}
        value={displayRange}
        step={step}
        min={limitLow}
        max={limitHigh}
        onChange={(_, newValue) => {
          if (Array.isArray(newValue)) {
            setDisplayRange(newValue);
          }
        }}
        onChangeCommitted={(_, newValue) => {
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
  sortUsers: (sortingMode: SortType, sortedAscending: boolean) => void;
}> = ({ users, setUsers, setFilteredUsers, sortUsers }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    minAge: "18",
    maxAge: "99",
    minDistance: "0",
    maxDistance: "1000",
    minFameRating: "0",
    maxFameRating: "100",
    genderFilter: "",
    sortType: "",
    interestFilter: "",
    ascending: "true",
    open: "false",
  });

  const minAge = parseInt(searchParams.get("minAge") || "18");
  const maxAge = parseInt(searchParams.get("maxAge") || "99");
  const minDistance = parseInt(searchParams.get("minDistance") || "0");
  const maxDistance = parseInt(searchParams.get("maxDistance") || "1000");
  const minFameRating = parseInt(searchParams.get("minFameRating") || "0");
  const maxFameRating = parseInt(searchParams.get("maxFameRating") || "100");
  const genderFilter = searchParams.get("genderFilter") || "";
  const sortType = (searchParams.get("sortType") as SortType) || "";
  const interestFilter = searchParams.get("interestFilter");
  const ascending = searchParams.get("ascending") === "true";
  const open = searchParams.get("open") === "true";
  const [rangeAge, setRangeAge] = useState<number[]>([minAge, maxAge]);
  const [rangeDistance, setRangeDistance] = useState<number[]>([
    minDistance,
    maxDistance,
  ]);
  const [rangeFameRating, setRangeFameRating] = useState<number[]>([
    minFameRating,
    maxFameRating,
  ]);

  useEffect(() => {
    const interestFilterList =
      !interestFilter || interestFilter === "" ? [] : interestFilter.split(",");
    setFilteredUsers(
      users.filter(
        (user) =>
          user.age >= minAge &&
          user.age <= maxAge &&
          user.distance >= minDistance &&
          user.distance <= maxDistance &&
          user.fame_rating >= minFameRating &&
          user.fame_rating <= maxFameRating &&
          interestFilterList.every((interest) =>
            user.hashtags.includes(interest)
          ) &&
          (genderFilter === ""
            ? true
            : user.gender === genderFilter.toLocaleLowerCase())
      )
    );
  }, [
    sortType,
    ascending,
    users,
    setFilteredUsers,
    minAge,
    maxAge,
    minDistance,
    maxDistance,
    minFameRating,
    maxFameRating,
    genderFilter,
    interestFilter,
  ]);

  const handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
    // setGenderFilter(event.target.value);
    setSearchParams(
      (prevParams) => {
        prevParams.set("genderFilter", event.target.value);
        return prevParams;
      },
      { replace: true }
    );
  };

  const handleInterestFilterChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSearchParams(
      (prevParams) => {
        prevParams.set(
          "interestFilter",
          typeof value === "string" ? value : value.join(",")
        );
        return prevParams;
      },
      { replace: true }
    );
  };

  return (
    <div className="flex justify-end items-center space-x-4">
      <Button
        onClick={() =>
          setSearchParams(
            (prevParams) => {
              prevParams.set("open", "true");
              return prevParams;
            },
            { replace: true }
          )
        }
      >
        Filter
      </Button>
      <Drawer
        open={open}
        onClose={() =>
          setSearchParams(
            (prevParams) => {
              prevParams.set("open", "false");
              return prevParams;
            },
            { replace: true }
          )
        }
      >
        <Box className="p-6 space-y-6" sx={{ width: 250 }} role="presentation">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Divider className="w-full" sx={{ m: 1 }} />
          <SliderFilter
            labelText="Age:"
            minVal={minAge}
            maxVal={maxAge}
            setMinVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("minAge", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            setMaxVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("maxAge", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            displayRange={rangeAge}
            setDisplayRange={setRangeAge}
            step={1}
            limitLow={18}
            limitHigh={99}
            additionalText="years old"
          />
          <SliderFilter
            labelText="Distance:"
            minVal={minDistance}
            maxVal={maxDistance}
            setMinVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("minDistance", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            setMaxVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("maxDistance", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            displayRange={rangeDistance}
            setDisplayRange={setRangeDistance}
            step={5}
            limitLow={0}
            limitHigh={1000}
            additionalText="km away"
          />
          <SliderFilter
            labelText="Fame rating:"
            minVal={minFameRating}
            maxVal={maxFameRating}
            setMinVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("minFameRating", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            setMaxVal={(val) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set("maxFameRating", val.toString());
                  return prevParams;
                },
                { replace: true }
              )
            }
            displayRange={rangeFameRating}
            setDisplayRange={setRangeFameRating}
            step={1}
            limitLow={0}
            limitHigh={100}
          />
          <FormControl fullWidth>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              value={genderFilter}
              label="gender"
              onChange={handleGenderFilterChange}
            >
              {["", "Male", "Female"].map((sortType, index) => (
                <MenuItem value={sortType} key={index}>
                  {sortType === "" ? <em>All</em> : sortType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="interest-filter">Interests</InputLabel>
            <Select
              labelId="interest-filter"
              id="interest-filter"
              multiple
              value={
                !interestFilter || interestFilter === ""
                  ? []
                  : interestFilter.split(",")
              }
              onChange={handleInterestFilterChange}
              renderValue={(selected) => (selected as string[]).join(", ")}
              label="Interests"
            >
              {HASHTAGS.map((interest, index) => (
                <MenuItem value={interest} key={index}>
                  <Checkbox
                    checked={
                      (interestFilter?.split(",") || []).indexOf(interest) > -1
                    }
                  />
                  <ListItemText primary={interest} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Drawer>
      <FormControl sx={{ width: 200 }}>
        <InputLabel id="sort-by">Sort by</InputLabel>
        <Select
          labelId="sort-by"
          id="sort-by"
          value={sortType}
          label="Sort by"
          onChange={(e) => {
            setSearchParams(
              (prevParams) => {
                prevParams.set("sortType", e.target.value as string);
                return prevParams;
              },
              { replace: true }
            );
            // return sortUsers(e.target.value as SortType, ascending);
          }}
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
      <IconButton
        onClick={() => {
          setSearchParams(
            (prevParams) => {
              prevParams.set("ascending", (!ascending).toString());
              return prevParams;
            },
            { replace: true }
          );
          // sortUsers(sortType, ascending);
        }}
      >
        <SwapVertIcon />
      </IconButton>
    </div>
  );
};

export default SearchFilterSection;
