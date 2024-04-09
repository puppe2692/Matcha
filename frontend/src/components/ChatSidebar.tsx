import React from "react";

const contacts: string[] = ["Alice", "Bob", "Charlie", "David", "Ella"];
const image: string =
  "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato";

const ChatContact: React.FC<{ name: string; image: string }> = ({
  name,
  image,
}) => {
  return (
    <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
        <img
          src={image}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        ></img>
      </div>
      <h2 className="text-lg font-semibold">{name}</h2>
    </div>
  );
};

const ChatSidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white shadow-md">
        <h1 className="text-2xl font-semibold">Chats</h1>
      </header>
      <div className="overflow-y-auto h-full p-3 mb-9 pb-20">
        {contacts.map((contact, index) => (
          <ChatContact key={index} name={contact} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
