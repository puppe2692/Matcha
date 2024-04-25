import axios from "axios";
import React from "react";
import { useUserContext } from "../context/UserContext";

const Page1: React.FC = () => {
  const { user } = useUserContext();
  const targetId = 5;
  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/like`,
        {
          originId: user.id,
          destinationId: targetId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async () => {
    if (!user) return;
    try {
      await axios.post(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/view`,
        {
          originId: user.id,
          destinationId: targetId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async () => {
    if (!user) return;
    try {
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/action/unlike`,
        {
          originId: user.id,
          destinationId: targetId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify items-center flex-col gap-4 p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleLike()}
      >
        Like
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleView()}
      >
        View
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 w-64 rounded-md hover:bg-blue-600"
        onClick={() => handleUnlike()}
      >
        Unlike
      </button>
    </div>
  );
};

export default Page1;
