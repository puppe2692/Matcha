import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import FirstConnectionMod from "../components/users/firstConnectionMod";
import MyPage from "./MyPage";

const HomePage: React.FC = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();
  return (
    <div>
      {user?.gender === undefined || user?.gender === null ? (
        <FirstConnectionMod
          title="FIRST CONNECTION"
          modalId={"First Connection"}
          closeModal={() => navigate("/")}
        />
      ) : (
        <MyPage />
      )}
    </div>
  );
};

export default HomePage;
