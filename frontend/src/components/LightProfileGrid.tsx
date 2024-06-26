import { Paper, Typography, Grid } from "@mui/material";
import React from "react";
import { User } from "../types";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ProfileAvatar from "./ProfileAvatar";

const LightProfileCard: React.FC<{ profile: User }> = ({ profile }) => {
  const hashtagsString = profile.hashtags.join(", ");
  return (
    <Paper
      className="p-3 flex flex-col m-2"
      elevation={4}
      component={Link}
      to={`/profile/${profile.username}`}
      style={{ textDecoration: "none" }}
    >
      <div className="flex items-center mb-2">
        <ProfileAvatar profile={profile} height={100} width={100} />
        <div className="flex flex-col items-left ml-4 space-y-1 w-full overflow-hidden">
          <h6 className="w-full font-semibold text-l truncate">
            {profile.username}, {profile.age}
          </h6>
          <div className="flex items-center">
            <LocationOnIcon />
            <Typography variant="subtitle2">
              {profile.distance < 5
                ? profile.distance.toFixed(1)
                : profile.distance.toFixed(0)}{" "}
              km away
            </Typography>
          </div>
          <div className="w-full overflow-hidden">
            <Typography
              variant="subtitle2"
              className="w-full truncate"
              sx={{ mb: 1 }}
            >
              {hashtagsString}
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
};

const LightProfileGrid: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <Grid container spacing={0}>
      {users.map((profile) => (
        <Grid item xs={12} zeroMinWidth key={profile.id}>
          <LightProfileCard profile={profile} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LightProfileGrid;
