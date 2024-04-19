import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    console.log("BONJOUR", user);
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default LoadingPage;
