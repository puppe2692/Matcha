import { io, Socket } from "socket.io-client";
import React, { useContext, useEffect } from "react";

const WebSocketContext = React.createContext<Socket | null>(null);

// need to add useEffect with userContext to get the user id
// have a socket.close() in the cleanup function

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = io("http://localhost:5000", {
    query: { id: 1 },
  });

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
