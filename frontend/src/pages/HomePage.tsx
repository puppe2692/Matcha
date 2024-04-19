import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import FirstConnectionMod from "../components/users/firstConnectionMod";

const HomePage: React.FC = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();
  console.log("GENDER", user?.gender);
  return (
    <div>
      {user?.gender === undefined ? (
        <FirstConnectionMod
          title="FIRST CONNECTION"
          modalId={"First Connection"}
          closeModal={() => navigate("/")}
        />
      ) : (
        <h1>Homepage</h1>
      )}
    </div>
  );
};

export default HomePage;
