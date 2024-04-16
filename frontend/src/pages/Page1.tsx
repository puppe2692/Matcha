import React from "react";

const Page1: React.FC = () => {
  const handleClick = (action: string) => {
    console.log(action);
  };

  const targetId = 1;
  const targetUsername = "cheveuxdefeu";

  return (
    <div className="flex justify items-center flex-col gap-4 p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleClick("like")}
      >
        Like
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleClick("view")}
      >
        View
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleClick("unlike")}
      >
        Unlike
      </button>
    </div>
  );
};

export default Page1;
