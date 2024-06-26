import { Paper, Typography, Divider } from "@mui/material";
import React from "react";
import { User } from "../types";
import StarIcon from "@mui/icons-material/Star";
import ImageSlider from "./Caroussel";
import LikedViewCard from "./LikedViewCard";

const MeCard: React.FC<{ profile: User; userImage: string[] }> = ({
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
          <div className="flex items-center mb-2">
            <div className="flex flex-col items-left ml-4 space-y-1 w-full overflow-hidden">
              <h6 className="w-full font-semibold text-l truncate">
                {profile.username}, {profile.age}
              </h6>
              <div className="flex items-center">
                <StarIcon />
                <Typography variant="subtitle2">
                  {profile.fame_rating}
                </Typography>
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
        <Paper
          className="p-3 flex flex-col mt-4"
          elevation={4}
          style={{
            maxWidth: "800px",
            // width: "100%",
            // aspectRatio: "16/9",
            // margin: "0 auto",
          }}
        >
          <LikedViewCard profile={profile} />
        </Paper>
      </div>
    </div>
  );
};

export default MeCard;
