import React, { useEffect } from "react";
import { User } from "../types";
import { useWebSocketContext } from "../context/WebSocketContext";
import CircleIcon from "@mui/icons-material/Circle";
import axios from "axios";

const OnlineBadge: React.FC<{
  profile: User;
}> = ({ profile }) => {
  const [isConnected, setIsConnected] = React.useState(true);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const socket = useWebSocketContext();

  useEffect(() => {
    console.log("PROFILE: ", profile);
    socket?.emit(
      "check-connection",
      profile.id.toString(),
      (connected: boolean) => {
        setIsConnected(connected);
      }
    );
  }, []);

  useEffect(() => {
    const handleConnection = (userId: string) => {
      if (userId === profile.id.toString()) {
        setIsConnected(true);
      }
    };
    const handleDisconnection = (userId: string) => {
      setIsConnected(false);
    };
    socket?.on("user-connected", handleConnection);
    socket?.on("user-left", handleDisconnection);

    return () => {
      socket?.off("user-connected", handleConnection);
      socket?.off("user-left", handleDisconnection);
    };
  }, [socket]);

  useEffect(() => {
    const onlineDate = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/profile/${profile.username}`,
          {
            withCredentials: true,
          }
        );
        setUpdatedAt(response.data.updatedAt);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isConnected) {
      onlineDate();
    }
  }, [isConnected]);

  return (
    <div>
      {isConnected ? (
        <div className="flex flex-row">
          <CircleIcon color="success" />
          <p className="text-black-900">Online</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <CircleIcon color="error" />
            <p className="text-black-900 ml-2">Offline</p>
          </div>
          <div className="flex flex-row">
            <p className="font-semibold text-l truncate">Last seen:</p>
            <p className="text-black-900 ml-2">
              {updatedAt ? updatedAt.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineBadge;
