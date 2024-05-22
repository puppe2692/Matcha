import { Paper, Typography, Divider } from "@mui/material";
import React from "react";
import { User } from "../types";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageSlider from "./Caroussel";
import OnlineBadge from "./OnlineBadge";

const UserCard: React.FC<{ profile: User; userImage: string[] }> = ({
  profile,
  userImage,
}) => {
  const hashtagsString = profile?.hashtags?.join(", ");
  return (
    <div className="flex justify-center items-center ">
      <div className="p-3 flex flex-col">
        <Paper
          elevation={4}
          style={{
            maxWidth: "800px",
            width: "100%",
            aspectRatio: "16/9",
            // margin: "0 auto",
          }}
        >
          <ImageSlider images={userImage} />
        </Paper>
        <Paper
          className="p-3 flex flex-col h-64 mt-4"
          elevation={4}
          style={{
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <div className="relative flex flex-row">
            <div className="flex items-center mb-2">
              <div className="flex flex-col items-left ml-4 space-y-1 w-full overflow-hidden">
                <h6 className="w-full font-semibold text-l truncate">
                  {profile.username}, {profile.age}
                </h6>
                <div className="flex items-center">
                  <LocationOnIcon />
                  <Typography variant="subtitle2">
                    {profile.distance < 5
                      ? profile?.distance?.toFixed(1)
                      : profile?.distance?.toFixed(0)}{" "}
                    km away
                  </Typography>
                </div>
                <div className="flex items-center">
                  <StarIcon />
                  <Typography variant="subtitle2">
                    {profile.fame_rating}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 mt-0 mr-4">
              <OnlineBadge profile={profile} />
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
      </div>
    </div>
  );
};

export default UserCard;
