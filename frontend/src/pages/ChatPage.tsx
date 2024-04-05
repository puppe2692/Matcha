import React, { useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NAVBAR_HEIGHT } from "../data/const";

const ChatPage: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const socket = useWebSocketContext();

  const sendMessage = () => {
    socket?.emit("chat message", message);
    console.log("emitting message", message);
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    const handleMessageReception = (message: string) => {
      console.log("receiving message", message);
      setMessages((messages) => [...messages, message]);
    };
    socket?.on("receive-message", handleMessageReception);

    return () => {
      socket?.off("receive-message", handleMessageReception);
    };
  }, [socket]);

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="bg-white p-2 rounded-lg shadow-md">{msg}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded-md border border-gray-400 focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
