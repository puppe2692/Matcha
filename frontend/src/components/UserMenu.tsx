import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

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

const UserMenu: React.FC<{
  wideView: boolean;
}> = ({ wideView }) => {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const { logoutUser } = useUserContext();
  const size = 8;

  return (
    <div onClick={() => setShowInfo(true)}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setShowInfo(false);
          setUserMenuOpen(false);
        }}
      >
        <div
          className="flex items-center relative justify-end"
          onClick={() => {
            setShowInfo(true);
          }}
        >
          <button
            type="button"
            className="flex mr-3 text-sm bg-gray-800 rounded-full lg:mr-0 active:ring-4 active:ring-gray-600"
            onClick={() => setUserMenuOpen((prevval) => !prevval)}
          >
            <img
              className={`w-${size} h-${size} rounded-full`}
              src="/norminet.jpeg"
              alt="Default user profile"
            />
          </button>

          {showInfo && (
            <div
              className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 ${
                userMenuOpen ? "block" : "hidden"
              }`}
              onClick={() => {
                setShowInfo(true);
              }}
            >
              <div className="px-4 py-3">
                {/* to update to make variable */}
                <span className="block text-sm text-white">Norminet</span>
              </div>
              <ul className="py-2">
                <MenuLink
                  text="Settings"
                  href="/settings"
                  onClick={() => setUserMenuOpen((prevval) => !prevval)}
                />
                <MenuLink
                  text="Sign out"
                  href="/signout"
                  onClick={() => {
                    setUserMenuOpen((prevval) => !prevval);
                    logoutUser();
                  }}
                />
              </ul>
            </div>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default UserMenu;
