import React, { useEffect } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NAVBAR_HEIGHT } from "../data/const";
import ChatSidebar from "../components/ChatSidebar";
import axios from "axios";

export interface Contact {
  connectedUser: string;
  connectedUserId: number;
  date: Date;
}

export interface Message {
  sender_id: number;
  receiver_id: number;
  date_sent: Date;
  content: string;
  seen: boolean;
}

const userId = 3;

const ChatPage: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = React.useState<Contact>();
  const socket = useWebSocketContext();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/contacts`,
          {
            params: { id: userId },
          }
        );
        setContacts(response.data);
        setSelectedContact(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    console.log("contact selected " + selectedContact?.connectedUserId);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/messages`,
          {
            params: { id: userId },
          }
        );
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [selectedContact]);

  const sendMessage = () => {
    if (!message) return;
    // socket?.emit("chat message", message);
    // setMessages((messages) => [...messages, { content: message, senderId: userId }]);
    // setMessage("");
  };

  // useEffect(() => {
  //   const handleMessageReception = (message: string) => {
  //     setMessages((messages) => [
  //       ...messages,
  //       { text: message, sender: "other" },
  //     ]);
  //   };
  //   socket?.on("receive-message", handleMessageReception);

  //   return () => {
  //     socket?.off("receive-message", handleMessageReception);
  //   };
  // }, [socket]);

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <ChatSidebar contacts={contacts} onSelectContact={setSelectedContact} />
      <div className="flex-1">
        <header className="bg-white p-4 text-gray-700 shadow-md">
          <h1 className="text-2xl font-semibold">
            {selectedContact?.connectedUser || ""}
          </h1>
        </header>
        <div className="overflow-y-auto h-full p-4 pb-36">
          {messages
            .filter(
              (msg) =>
                msg.sender_id === selectedContact?.connectedUserId ||
                msg.receiver_id === selectedContact?.connectedUserId
            )
            .map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  msg.sender_id === userId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender_id !== userId && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    ></img>
                  </div>
                )}
                <div
                  className={`flex max-w-[calc(1/2*100vw)] rounded-lg p-3 gap-3 break-all ${
                    msg.sender_id === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.sender_id === userId && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    ></img>
                  </div>
                )}
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
