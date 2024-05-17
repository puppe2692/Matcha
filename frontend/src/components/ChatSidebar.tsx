import React, { useEffect } from "react";
import { Contact } from "../pages/ChatPage";
import { Badge, styled } from "@mui/material";
import { useWebSocketContext } from "../context/WebSocketContext";

const image: string =
  "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato";

const ConnectedBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const DisconnectedBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#e6092a",
    color: "#e6092a",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const ChatContact: React.FC<{
  contact: Contact;
  image: string;
  onSelectContact: (contact: Contact) => void;
}> = ({ contact, image, onSelectContact }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const socket = useWebSocketContext();

  useEffect(() => {
    socket?.emit(
      "check-connection",
      contact.connectedUserId.toString(),
      (connected: boolean) => {
        setIsConnected(connected);
      }
    );
  }, [socket, contact.connectedUserId]);

  useEffect(() => {
    const handleConnection = (userId: string) => {
      if (userId === contact.connectedUserId.toString()) {
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
  }, [socket, contact.connectedUserId]);

  return (
    <div
      className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
      onClick={() => onSelectContact(contact)}
    >
      <div className="relative inline-flex w-12 h-12 bg-gray-300 rounded-full mr-3">
        {isConnected ? (
          <ConnectedBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            color="primary"
            variant="dot"
          >
            <img
              // TODO: change the image source to the real contact profile picture
              src={image}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            ></img>
          </ConnectedBadge>
        ) : (
          <DisconnectedBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            color="primary"
            variant="dot"
          >
            <img
              // TODO: change the image source to the real contact profile picture
              src={image}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            ></img>
          </DisconnectedBadge>
        )}
        {contact.unreadMessages > 0 && (
          <div
            className={`absolute inline-flex items-center justify-center w-6 h-6 ${
              contact.unreadMessages >= 100 ? "text-[10px]" : "text-xs"
            } font-bold text-white bg-blue-800 border-2 border-white rounded-full -top-2 -right-1.5 dark:border-white`}
          >
            {contact.unreadMessages >= 100 ? "99+" : contact.unreadMessages}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold">{contact.connectedUser}</h2>
    </div>
  );
};

const ChatSidebar: React.FC<{
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}> = ({ contacts, onSelectContact }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-blue-800 text-white shadow-md">
        <h1 className="text-2xl font-semibold">Chats</h1>
      </header>
      <div className="overflow-y-auto h-[calc(100vh-211px)] p-3 mb-9 pb-20">
        {contacts.map((contact, index) => (
          <ChatContact
            key={index}
            contact={contact}
            image={image}
            onSelectContact={onSelectContact}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
