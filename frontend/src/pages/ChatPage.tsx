import React, { useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NAVBAR_HEIGHT } from "../data/const";
import ChatSidebar from "../components/ChatSidebar";

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
      className="flex overflow-hidden"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <ChatSidebar />
      <div className="flex-1">
        <header className="bg-white p-4 text-gray-700 shadow-md">
          <h1 className="text-2xl font-semibold">Alice</h1>
        </header>
        <div className="overflow-y-auto h-full p-4 pb-36">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[calc(1/2*100vw)] rounded-lg p-3 gap-3 break-all ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                <img
                  src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                ></img>
              </div>
            </div>
          ))}
        </div>
        <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
