import React, { useState, useEffect } from "react";
import { NAVBAR_HEIGHT, NAVBAR_BREAKPOINT, CORNERS_WIDTH } from "../data/const";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import NavLink from "./NavLink";
import { ChatIcon } from "../utils/icons";
import { NavBarButton } from "./Buttons";
import { useUserContext } from "../context/UserContext";
import UserMenu from "./UserMenu";

const NavLinks: React.FC<{ current: string; wideView: boolean }> = ({
  current,
  wideView,
}) => {
  return (
    <div className="items-center justify-between flex w-auto">
      <ul className="text-xl lg:text-base flex font-medium p-0 rounded-lg flex-row space-x-2 lg:space-x-8 mt-0 border-0 bg-gray-900 border-gray-700">
        <NavLink
          current={current}
          wideView={wideView}
          title="Home"
          link="/"
          icon="/favicon.ico"
        />
        <NavLink
          current={current}
          wideView={wideView}
          title="Page 1"
          link="/page1"
          icon="/favicon.ico"
        />
        <NavLink
          current={current}
          wideView={wideView}
          title="Page 2"
          link="/page2"
          icon="/favicon.ico"
        />
      </ul>
    </div>
  );
};

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const wideView: boolean = !!(width && width >= NAVBAR_BREAKPOINT);
  const [user, setUser] = useState(false);
  const { user: currentUser } = useUserContext();

  useEffect(() => {
    // Update user state when currentUser changes
    console.log("currentUser: ", currentUser);
    setUser(!!currentUser);
  }, [currentUser]);

  const isSignIn = location.pathname === "/signin";
  const isSignUp = location.pathname === "/signup";

  return (
    <nav
      className="sticky top-0 border-gray-200 bg-gray-900 z-50"
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div
        className={`max-w-full flex flex-wrap items-center justify-between mx-auto ${
          width >= NAVBAR_BREAKPOINT ? "p-2" : "p-4"
        }`}
      >
        <Link
          to="/"
          className="items-center"
          style={
            wideView
              ? { display: "flex", width: CORNERS_WIDTH }
              : { display: "none" }
          }
        >
          <img
            src="/logo192.png"
            className="w-8 h-8 mr-3"
            alt="ft_tinder logo"
          />
          <div className="flex flex-col whitespace-nowrap text-white">
            <span className="text-2xl font-semibold">ft_tinder.com</span>
            <span className="text-m italic">Plus tu paies, plus t'es beau</span>
          </div>
        </Link>
        {!isSignIn && !isSignUp && (
          <>
            <NavLinks current={location.pathname} wideView={wideView} />
            <div
              className="flex items-center justify-end space-x-4"
              style={wideView ? { width: CORNERS_WIDTH } : {}}
            >
              <button
                onClick={() => navigate("/chat")}
                className="w-6 h-6 hover:scale-110"
              >
                <ChatIcon />
              </button>
              {user ? (
                <UserMenu wideView={wideView} updateUserStatus={setUser} />
              ) : (
                <NavBarButton
                  text="Sign In"
                  onClick={() => {
                    setUser((prevUser) => !prevUser);
                    navigate("/signin");
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
