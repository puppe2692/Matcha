import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const RecupPasswordTokenVerifPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const id = new URLSearchParams(useLocation().search).get("id");
  const token = new URLSearchParams(useLocation().search).get("token");
  const navigate = useNavigate();

  if (!id || !token) {
    setError("Invalid token");
  }

  const verifToken = async () => {
    try {
      console.log("token pas encore verifie");
      await axios.get(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/auth/resetpassword/${id}/${token}`,
        { withCredentials: true }
      );
      console.log("token verified");
      navigate(`/updatepassword?id=${id}&token=${token}`);
    } catch (error: any) {
      setError(error.response.data.error);
      console.log("error", error);
    }
  };
  verifToken();
  if (error) {
    return <div> {error} </div>;
  }

  return <div> verif page </div>;
};

export default RecupPasswordTokenVerifPage;
