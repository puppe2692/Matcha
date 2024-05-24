import React, { useEffect } from "react";
import { User } from "../types";
import { Avatar } from "@mui/material";
import axios from "axios";

const ProfileAvatarUsername: React.FC<{
  profileUsername: string;
  width: number;
  height: number;
}> = ({ profileUsername, width, height }) => {
  const [img, setImg] = React.useState<string>("");
  const [profile, setProfile] = React.useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/profile/${profileUsername}`,
          {
            withCredentials: true,
          }
        );
        setProfile(response.data);
      } catch {}
    };
    fetchUser();
  }, [profileUsername]);

  useEffect(() => {
    const fetchImg = async () => {
      if (!profile!.isfake && profile!.profile_picture[0]) {
        try {
          const response = await axios.get(
            `http://${
              process.env.REACT_APP_SERVER_ADDRESS
            }:5000/users/get_img/${profile!.id}`,
            {
              params: { id: profile?.id, index: 0 },
              responseType: "arraybuffer",
              withCredentials: true,
            }
          );
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setImg(`data:image/jpeg;base64,${base64Image}`);
        } catch {}
      } else {
        setImg(profile!.profile_picture[0]);
      }
    };
    if (!profile) return;
    else fetchImg();
  }, [profile]);
  return (
    <Avatar
      src={img}
      alt="Profile Picture"
      sx={{ width: width, height: height }}
    />
  );
};

export default ProfileAvatarUsername;
