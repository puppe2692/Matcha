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
    if (user?.id) {
      const s = io(`http://${process.env.REACT_APP_SERVER_ADDRESS}:5000`, {
        query: { id: user.id },
      });
      setSocket(s);
      return () => {
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
