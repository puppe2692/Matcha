import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import ProfileAvatar from "./ProfileAvatar";

const MenuLink: React.FC<{
  text: string;
  href: string;
  onClick: () => void;
}> = ({ text, href, onClick }) => {
  return (
    <li>
      <Link
        to={href}
        className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
        onClick={onClick}
      >
        {text}
      </Link>
    </li>
  );
};

const UserMenu: React.FC = () => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { user } = useUserContext();

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowInfo(false);
      }}
    >
      <div className="flex items-center relative justify-end">
        <button
          type="button"
          className="flex mr-3 text-sm bg-gray-800 rounded-full lg:mr-0 active:ring-4 active:ring-gray-600"
          onClick={() => setShowInfo((prevval) => !prevval)}
        >
          <ProfileAvatar profile={user!} width={32} height={32} />
        </button>

        {showInfo && (
          <div className="z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 block">
            <div className="px-4 py-3">
              <span className="block text-sm text-white">{user?.username}</span>
            </div>
            <ul className="py-2">
              <MenuLink
                text="Settings"
                href="/settings"
                onClick={() => setShowInfo((prevval) => !prevval)}
              />
              <MenuLink
                text="Sign out"
                href="/signout"
                onClick={() => {
                  setShowInfo((prevval) => !prevval);
                }}
              />
            </ul>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default UserMenu;
