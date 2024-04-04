import { io, Socket } from "socket.io-client";
import React, { useContext } from "react";

const WebSocketContext = React.createContext<Socket | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = io("http://localhost:5000");

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
