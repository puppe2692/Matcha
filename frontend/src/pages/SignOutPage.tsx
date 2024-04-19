import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";

const SignOutPage: React.FC = () => {
  const [message, setMessage] = useState("Not logged in");
  const { logoutUser } = useUserContext();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const signOut = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/logout`,
          { withCredentials: true }
        );
        setMessage(response.data.message);
        logoutUser();
        navigate("/signin");
      } catch (error) {
        setError(true);
      }
    };
    signOut();
  }, [navigate, logoutUser]);

  if (error) {
    return <NotConnected message="Please signup or log in" />;
  } else {
    return <div>{message}</div>;
  }
};

export default SignOutPage;
