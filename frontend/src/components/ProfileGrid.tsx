import { Paper, Avatar, Typography, Divider, Grid } from "@mui/material";
import React from "react";
import { User } from "../types";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ProfileAvatar from "./ProfileAvatar";

const ProfileCard: React.FC<{ profile: User }> = ({ profile }) => {
  const hashtagsString = profile.hashtags.join(", ");
  return (
    <Paper
      className="p-3 flex flex-col h-64 mt-4"
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
          <div className="flex items-center">
            <StarIcon />
            <Typography variant="subtitle2">{profile.fame_rating}</Typography>
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
          {hashtagsString}
        </Typography>
        <Typography variant="body2" className="w-full line-clamp-4">
          {profile.bio}
        </Typography>
      </div>
    </Paper>
  );
};

const ProfileGrid: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <Grid container spacing={2}>
      {users.map((profile) => (
        <Grid item xs={12} sm={6} md={4} lg={3} zeroMinWidth key={profile.id}>
          <ProfileCard profile={profile} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileGrid;
