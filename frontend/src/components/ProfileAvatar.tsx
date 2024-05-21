import React, { useEffect } from "react";
import { User } from "../types";
import { Avatar } from "@mui/material";
import axios from "axios";

const ProfileAvatar: React.FC<{
  profile: User;
  width: number;
  height: number;
}> = ({ profile, width, height }) => {
  const [img, setImg] = React.useState<string>("");
  useEffect(() => {
    const fetchImg = async () => {
      if (!profile.isfake) {
        try {
          const response = await axios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${profile.id}`,
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
        setImg(profile.profile_picture[0]);
      }
    };
    fetchImg();
  }, []);
  return (
    <Avatar
      src={img}
      alt="Profile Picture"
      sx={{ width: width, height: height }}
    />
  );
};

export default ProfileAvatar;
