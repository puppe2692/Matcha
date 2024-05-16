import React from "react";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          User's age Not Found or the user you're looking for does not exist
        </h1>
      </div>
    </div>
  );
}

export default NotFound;
