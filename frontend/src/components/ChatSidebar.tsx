import React from "react";
import { Contact } from "../pages/ChatPage";

const image: string =
  "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato";

const ChatContact: React.FC<{
  contact: Contact;
  image: string;
  onSelectContact: (contact: Contact) => void;
}> = ({ contact, image, onSelectContact }) => {
  return (
    <div
      className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
      onClick={() => onSelectContact(contact)}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
        <img
          src={image}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        ></img>
      </div>
      <h2 className="text-lg font-semibold">{contact.connectedUser}</h2>
    </div>
  );
};

const ChatSidebar: React.FC<{
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}> = ({ contacts, onSelectContact }) => {
  console.log(contacts);
  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white shadow-md">
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
