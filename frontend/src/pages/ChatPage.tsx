import React, { useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NAVBAR_HEIGHT } from "../data/const";

const ChatPage: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<
    { text: string; sender: string }[]
  >([]);
  const socket = useWebSocketContext();

  const sendMessage = () => {
    if (!message) return;
    socket?.emit("chat message", message);
    setMessages((messages) => [...messages, { text: message, sender: "me" }]);
    setMessage("");
  };

  useEffect(() => {
    const handleMessageReception = (message: string) => {
      setMessages((messages) => [
        ...messages,
        { text: message, sender: "other" },
      ]);
    };
    socket?.on("receive-message", handleMessageReception);

    return () => {
      socket?.off("receive-message", handleMessageReception);
    };
  }, [socket]);

  return (
    <div
      className="w-full flex flex-col justify-between mx-auto"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <div className="flex flex-col p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg shadow-md break-all ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
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
