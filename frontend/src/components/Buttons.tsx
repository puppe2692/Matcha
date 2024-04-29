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
      className="relative flex items-center text-sm font-medium text-center text-white rounded-lg hover:text-gray-300 hover:scale-110 mx-auto"
    >
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 512 512"
      >
        <path d="M256 352c-16.53 0-33.06-5.422-47.16-16.41L0 173.2V400C0 426.5 21.49 448 48 448h416c26.51 0 48-21.49 48-48V173.2l-208.8 162.5C289.1 346.6 272.5 352 256 352zM16.29 145.3l212.2 165.1c16.19 12.6 38.87 12.6 55.06 0l212.2-165.1C505.1 137.3 512 125 512 112C512 85.49 490.5 64 464 64h-416C21.49 64 0 85.49 0 112C0 125 6.01 137.3 16.29 145.3z" />
      </svg>
      <span className="sr-only">Messages</span>
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
  );
};

export const BasicButton: React.FC<{
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
