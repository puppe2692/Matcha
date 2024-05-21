import React, { useContext, useEffect, useState } from "react";
import { User } from "../types";
import axios from "axios";

interface Prop {
  user: User | null;
  online: boolean;
  loading: boolean;
  loginUser: (userData: User | null) => void;
  logoutUser: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const UserContext = React.createContext<Prop>({
  user: null,
  online: false,
  loading: true,
  loginUser: () => {},
  logoutUser: () => {},
  updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [online, setOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [printableImage, setPrintableImage] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/me`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setUser(null);
          setLoading(false);
        } else {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, []);

  const loginUser = (userData: User | null) => {
    setUser(userData);
    setOnline(true);
    setLoading(false);
  };

  const logoutUser = () => {
    setUser(null);
    setOnline(false);
    setLoading(false);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser: any) => {
      if (prevUser) {
        return { ...prevUser, ...userData };
      }
      return null;
    });
  };

  return (
    <UserContext.Provider
      value={{ user, online, loading, loginUser, logoutUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
