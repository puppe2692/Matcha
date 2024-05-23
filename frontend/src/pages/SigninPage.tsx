import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import AlreadyConnected from "../components/AlreadyConnected";
import { useUserContext } from "../context/UserContext";
import TristanSectionNoNavBar from "../components/TristanSectionNoNavBar";

const SignInPage: React.FC = () => {
  // eslint-disable-next-line
  const [username, setUsername] = useState<string>("");
  const { user } = useUserContext();
  return user ? (
    <AlreadyConnected />
  ) : (
    <TristanSectionNoNavBar>
      <LoginForm setUsername={setUsername} />
    </TristanSectionNoNavBar>
  );
};

export default SignInPage;
