import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { notification } from "./NavBar";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { User } from "../types";
import ProfileAvatar from "./ProfileAvatar";
import { Link } from "react-router-dom";

const NotificationLine: React.FC<{
  notification: notification;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<notification[]>>;
}> = ({ notification, setUnreadCount, setNotifications }) => {
  const [originUser, setOriginUser] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/profile/${notification.origin_username}`,
          {
            withCredentials: true,
          }
        );
        setOriginUser(response.data);
      } catch {}
    };
    fetchUser();
  }, []);
  const notifDate = new Date(notification.date);
  const formattedDate =
    notifDate.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
    }) +
    ", " +
    notifDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (notification.new) setUnreadCount((prev) => prev - 1);
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/notification/one`,
        {
          params: { notificationId: notification.id },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notification.id)
      );
    }, 500);
  };
  return originUser ? (
    <Link to={`/profile/${originUser.username}`}>
      <div
        className={`relative flex items-center px-4 py-3 border-b ${
          notification.seen
            ? "hover:bg-gray-100"
            : "bg-blue-100 hover:bg-blue-200"
        } -mx-2 ${
          isDeleting ? "opacity-0 -translate-x-full" : ""
        } transition-all duration-500 ease-in-out`}
      >
        <ProfileAvatar profile={originUser!} width={32} height={32} />
        <div className="flex flex-col">
          <p className="text-gray-600 max-w-40 text-sm mx-2 [overflow-wrap:anywhere]">
            {notification.content}
          </p>
          <p className="text-gray-400 text-xs mx-2 mt-1">{formattedDate}</p>
        </div>
        <button
          onClick={handleDelete}
          className="absolute top-[17px] right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg
            className="h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Link>
  ) : null;
};

const NotificationMenu: React.FC<{
  unread: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  notifications: notification[];
  setNotifications: React.Dispatch<React.SetStateAction<notification[]>>;
}> = ({ unread, setUnreadCount, notifications, setNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUserContext();

  const handleClick = async () => {
    if (!user) return;

    try {
      const notifications = await axios.get(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/notification/`,
        { params: { id: user.id }, withCredentials: true }
      );
      setNotifications(notifications.data);
      setShowNotifications((prevval) => !prevval);
      setUnreadCount(0);
      await axios.put(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/notification/read`,
        {},
        { params: { id: user.id }, withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowNotifications(false);
      }}
    >
      <div className="flex items-center relative">
        <button
          onClick={handleClick}
          className="relative inline-flex items-center text-sm font-medium text-center text-white rounded-lg hover:text-gray-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M470.346 403.26C468.655 400.18 466.169 397.611 463.146 395.82L441.487 382.82C433.033 377.737 426.038 370.553 421.183 361.967C416.327 353.381 413.776 343.684 413.777 333.82V216.66C413.756 182.674 402.73 149.609 382.347 122.414C361.964 95.2185 333.321 75.3562 300.707 65.8C299.296 65.3984 298.054 64.5512 297.165 63.3849C296.277 62.2187 295.79 60.7962 295.777 59.33C295.777 48.899 291.633 38.8953 284.257 31.5195C276.881 24.1437 266.877 20 256.447 20C246.016 20 236.012 24.1437 228.636 31.5195C221.26 38.8953 217.116 48.899 217.116 59.33C217.102 60.7957 216.614 62.2175 215.726 63.3834C214.837 64.5493 213.596 65.397 212.186 65.8C179.572 75.3562 150.929 95.2185 130.546 122.414C110.163 149.609 99.1367 182.674 99.1164 216.66V333.8C99.1173 343.664 96.566 353.361 91.7104 361.947C86.8548 370.533 79.8601 377.717 71.4065 382.8L49.7465 395.8C46.0067 398.033 43.0981 401.426 41.4629 405.463C39.8276 409.501 39.5551 413.961 40.6867 418.168C41.8184 422.374 44.2922 426.096 47.7324 428.767C51.1726 431.439 55.3911 432.915 59.7465 432.97H453.086C456.534 432.888 459.903 431.923 462.871 430.165C465.839 428.408 468.305 425.918 470.034 422.934C471.764 419.95 472.698 416.572 472.747 413.124C472.797 409.676 471.96 406.272 470.317 403.24L470.346 403.26Z" />
            <path d="M222.447 481.12C229.872 486.373 238.414 489.832 247.402 491.225C256.39 492.619 265.579 491.908 274.246 489.15C282.913 486.392 290.822 481.661 297.351 475.329C303.881 468.998 308.853 461.238 311.876 452.66H200.987C205.035 464.132 212.53 474.073 222.447 481.12Z" />
          </svg>
          <span className="sr-only">Notifications</span>
          {unread > 0 && (
            <div
              className={`absolute inline-flex items-center justify-center w-5 h-5 ${
                unread >= 100 ? "text-[7px]" : "text-[10px]"
              } font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900`}
            >
              {unread >= 100 ? "99+" : unread}
            </div>
          )}
        </button>
        {showNotifications && (
          <div
            className={`absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg overflow-y-auto overflow-hidden z-20 w-64 h-64 ${
              notifications.length === 0 ? "flex items-center" : ""
            }`}
          >
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 align-middle text-xl italic">
                You don't have any notification
              </p>
            ) : (
              notifications.map((notification, _) => (
                <NotificationLine
                  notification={notification}
                  setUnreadCount={setUnreadCount}
                  setNotifications={setNotifications}
                  key={notification.id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default NotificationMenu;
