import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import TristanSection from "../components/TristanSection";
import AlreadyConnected from "../components/AlreadyConnected";
import { useUserContext } from "../context/UserContext";

const SignInPage: React.FC = () => {
  // eslint-disable-next-line
  const [username, setUsername] = useState<string>("");
  const { user } = useUserContext();
  return user ? (
    <AlreadyConnected />
  ) : (
    <TristanSection>
      <LoginForm setUsername={setUsername} />
    </TristanSection>
  );
};

export default SignInPage;
