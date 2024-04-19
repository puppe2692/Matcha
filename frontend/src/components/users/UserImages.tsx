import React from "react";
import Avatar from "./UserAvatar";

interface Props {
  controllerName: string;
  label: string;
  setImageUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserImage: React.FC<Props> = ({
  controllerName,
  label,
  setImageUpload,
}) => {
  return (
    <div>
      <label
        htmlFor={controllerName}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div className="flex flex-row items-center justify-center w-full bg-gray-100 bg-opacity-0 p-4 space-x-4">
        <Avatar index={0} setImageUpload={setImageUpload} />
        <Avatar index={1} />
        <Avatar index={2} />
        <Avatar index={3} />
        <Avatar index={4} />
      </div>
    </div>
  );
};

export default UserImage;