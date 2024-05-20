import React, { useState, useEffect } from "react";
import { NAVBAR_HEIGHT, NAVBAR_BREAKPOINT, CORNERS_WIDTH } from "../data/const";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import NavLink from "./NavLink";
import { NavBarButton, ChatButton } from "./Buttons";
import { useUserContext } from "../context/UserContext";
import UserMenu from "./UserMenu";
import axios from "axios";
import { useWebSocketContext } from "../context/WebSocketContext";
import NotificationMenu from "./NotificationMenu";

export interface notification {
  id: number;
  user_id: number;
  origin_username: string;
  date: Date;
  seen: boolean;
  new?: boolean;
  content: string;
}

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
          title="My Profile"
          link="/"
          icon="/favicon.ico"
        />
        <NavLink
          current={current}
          wideView={wideView}
          title="Find your match"
          link="/research"
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
  const { user } = useUserContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const socket = useWebSocketContext();

  useEffect(() => {
    const getUnreadMessages = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/chat/unreadMessages`,
          {
            params: { id: user.id },
            withCredentials: true,
          }
        );
        setUnreadCount(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUnreadMessages();
  }, [user]);

  useEffect(() => {
    const handleMessageNotification = () => {
      setUnreadCount((prev) => prev + 1);
    };
    const handleReadMessages = (readcount: number) => {
      setUnreadCount((prev) => prev - readcount);
    };
    const handleNotification = (notif: notification) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadNotifications((prev) => prev + 1);
    };
    socket?.on("receive-message", handleMessageNotification);
    socket?.on("notify-read", handleReadMessages);
    socket?.on("notification", handleNotification);

    return () => {
      socket?.off("receive-message", handleMessageNotification);
      socket?.off("notify-read", handleReadMessages);
      socket?.off("notification", handleNotification);
    };
  }, [socket]);

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
              <NotificationMenu
                unread={unreadNotifications}
                setUnreadCount={setUnreadNotifications}
                notifications={notifications}
                setNotifications={setNotifications}
              />
              <ChatButton
                onClick={() => navigate("/chat")}
                unread={unreadCount}
              />
              {user ? (
                <UserMenu />
              ) : (
                <NavBarButton
                  text="Sign In"
                  onClick={() => {
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
