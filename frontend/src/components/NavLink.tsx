import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const TextNavLink: React.FC<{
  innerDivStyle: string;
  isActive: boolean;
  title: string;
}> = ({ innerDivStyle, isActive, title }) => {
  return (
    <div
      className={`${innerDivStyle} ${
        isActive
          ? "bg-blue-700 bg-transparent p-0 text-rose-600"
          : "p-0 text-white hover:text-rose-600 hover:bg-gray-700 hover:bg-transparent border-gray-700"
      }`}
    >
      {title}
    </div>
  );
};

const ImgNavLink: React.FC<{
  innerDivStyle: string;
  isActive: boolean;
  icon: string;
  title: string;
}> = ({ innerDivStyle, isActive, icon, title }) => {
  return (
    <div
      className={`${innerDivStyle} ${
        isActive ? "inset shadow-inner bg-indigo-700" : ""
      }`}
    >
      <img
        src={icon}
        className="w-6 h-6 mx-1 rounded-full"
        alt={`${title} icon`}
      />
    </div>
  );
};

const NavLink: React.FC<{
  title: string;
  current: string;
  link: string;
  icon: string;
  wideView: boolean;
}> = ({ title, current, link, icon, wideView }) => {
  const innerDivStyle = "block py-2 px-2 mb:px-4 rounded";
  const isActive = current === link;

  return (
    <li>
      <Link to={link}>
        {wideView ? (
          <TextNavLink
            innerDivStyle={innerDivStyle}
            isActive={isActive}
            title={title}
          />
        ) : (
          <ImgNavLink
            innerDivStyle={innerDivStyle}
            isActive={isActive}
            icon={icon}
            title={title}
          />
        )}
      </Link>
    </li>
  );
};

NavLink.propTypes = {
  title: PropTypes.string.isRequired,
  current: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  wideView: PropTypes.bool.isRequired,
};

export default NavLink;
