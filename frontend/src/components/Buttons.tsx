import React from "react";

export const NavBarButton: React.FC<{
  disabled?: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.FormEvent) => void;
}> = ({ disabled = false, text, type, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    type={type}
    className={`flex items-center justify-center px-3 mb:px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 w-auto  bg-gray-900 text-gray-200 border-gray-700 ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-600"
    }`}
  >
    <span>{text}</span>
  </button>
);

export const ChatButton: React.FC<{
  onClick: (event: React.FormEvent) => void;
  unread: number;
}> = ({ onClick, unread }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 16"
      >
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
      </svg>
      <span className="sr-only">Notifications</span>
      {unread > 0 && (
        <div
          className={`absolute inline-flex items-center justify-center w-6 h-6 ${
            unread >= 100 ? "text-[10px]" : "text-xs"
          } font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900`}
        >
          {unread >= 100 ? "99+" : unread}
        </div>
      )}
    </button>
  );
};
