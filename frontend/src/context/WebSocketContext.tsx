import { io, Socket } from "socket.io-client";
import React, { useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";

const WebSocketContext = React.createContext<Socket | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserContext();
  useEffect(() => {
    // console.log("Connecting to websocket with user: ", user);
    if (user?.id) {
      const s = io(`http://${process.env.REACT_APP_SERVER_ADDRESS}:5000`, {
        query: { id: user.id },
      });
      setSocket(s);
      return () => {
        // console.log("Disconnecting from websocket with user: ", user);
        s.close();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
