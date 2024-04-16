import React, { useEffect, useRef, useCallback } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { NAVBAR_HEIGHT } from "../data/const";
import ChatSidebar from "../components/ChatSidebar";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

export interface Contact {
  connectedUser: string;
  connectedUserId: number;
  date: Date;
  unreadMessages: number;
}

export interface Message {
  sender_id: number;
  receiver_id: number;
  date_sent: Date;
  content: string;
  seen: boolean;
}

//211 px is the sum of the navbar (72), the header (64) and the footer (75)
// need to be entered manually or else tailwind doesn't work

const ChatPage: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const lastMessageRef = useRef<null | HTMLDivElement>(null);
  const [selectedContact, setSelectedContact] = React.useState<Contact>();
  const socket = useWebSocketContext();
  const { user } = useUserContext();

  console.log(user);

  const readMessages = useCallback(async () => {
    if (!user || !selectedContact) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/chat/readMessages`,
        {
          senderId: selectedContact.connectedUserId,
          receiverId: user.id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  }, [user, selectedContact]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/chat/contacts`,
          {
            params: { id: user!.id },
            withCredentials: true,
          }
        );
        setContacts(response.data);
        setSelectedContact(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContacts();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/chat/messages`,
          {
            params: { id: user!.id },
            withCredentials: true,
          }
        );
        setMessages(
          response.data.sort(
            (a: Message, b: Message) =>
              new Date(a.date_sent).getTime() - new Date(b.date_sent).getTime()
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [user]);

  const sendMessage = () => {
    if (!message) return;
    socket?.emit("chat message", {
      content: message,
      sender_id: user!.id,
      receiver_id: selectedContact!.connectedUserId,
    });
    setMessages((messages) => [
      ...messages,
      {
        sender_id: user!.id,
        receiver_id: selectedContact!.connectedUserId,
        date_sent: new Date(),
        content: message,
        seen: false,
      },
    ]);
    setContacts((prevContacts) =>
      prevContacts
        .map((contact) =>
          contact.connectedUserId === selectedContact!.connectedUserId
            ? { ...contact, date: new Date(), unreadMessages: 0 }
            : contact
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    setMessage("");
    readMessages();
  };

  useEffect(() => {
    readMessages();
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.connectedUserId === selectedContact!.connectedUserId
          ? { ...contact, date: new Date(), unreadMessages: 0 }
          : contact
      )
    );
  }, [selectedContact, readMessages]);

  useEffect(() => {
    const handleMessageReception = (message: Message) => {
      setMessages((messages) => [...messages, message]);
      setContacts((prevContacts) =>
        prevContacts
          .map((contact) =>
            contact.connectedUserId === message.sender_id
              ? {
                  ...contact,
                  date: new Date(),
                  unreadMessages: contact.unreadMessages + 1,
                }
              : contact
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
      );
    };
    socket?.on("receive-message", handleMessageReception);

    return () => {
      socket?.off("receive-message", handleMessageReception);
    };
  }, [socket]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div
      className="flex"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      {contacts.length !== 0 ? (
        <>
          <ChatSidebar
            contacts={contacts}
            onSelectContact={setSelectedContact}
          />
          <div className="flex-1">
            <header className="bg-white p-4 text-gray-700 shadow-md">
              <h1 className="text-2xl font-semibold">
                {selectedContact?.connectedUser || ""}
              </h1>
            </header>
            <div className="overflow-hidden overflow-y-auto p-1 h-[calc(100vh-211px)]">
              {messages
                .filter(
                  (msg) =>
                    msg.sender_id === selectedContact?.connectedUserId ||
                    msg.receiver_id === selectedContact?.connectedUserId
                )
                .map((msg, index) => (
                  <div
                    ref={
                      index ===
                      messages.filter(
                        (msg) =>
                          msg.sender_id === selectedContact?.connectedUserId ||
                          msg.receiver_id === selectedContact?.connectedUserId
                      ).length -
                        1
                        ? lastMessageRef
                        : null
                    }
                    key={index}
                    className={`flex mb-2 ${
                      msg.sender_id === user!.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.sender_id !== user!.id && (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img
                          src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full"
                        ></img>
                      </div>
                    )}
                    <div
                      className={`flex max-w-[calc(1/2*100vw)] rounded-lg p-3 gap-3 [overflow-wrap:anywhere] ${
                        msg.sender_id === user?.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.sender_id === user!.id && (
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
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          You don't have any contact yet, start matching before you can chat
        </div>
      )}
    </div>
  );
};

export default ChatPage;
