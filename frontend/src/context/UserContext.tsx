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
        // console.log("USER FROM USER CONTEXT", response.data);
        setUser(response.data);
        //////////////////////////  RECUPERATION IMAGE //////////////////////////
        // for (let i = 0; i < user!.profile_picture.length; i++) {
        //   console.log("USER PROFIL LENGHT", user!.profile_picture.length);
        //   const responseImg = await axios.get(
        //     `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
        //     {
        //       params: { id: user?.id, index: i },
        //       responseType: "arraybuffer",
        //       withCredentials: true,
        //     }
        //   );
        //   console.log("RESPONSE ALL IMAGE", responseImg.data);
        //   const base64Image = btoa(
        //     new Uint8Array(responseImg.data).reduce(
        //       (data, byte) => data + String.fromCharCode(byte),
        //       ""
        //     )
        //   );
        //   setPrintableImage((prev) => [
        //     ...prev,
        //     `data:image/jpeg;base64,${base64Image}`,
        //   ]);
        // }
        // //console.log("PRINTABLE IMAGE", printableImage);
        // updateUser({ profile_picture: printableImage });
        //////////////////////////  RECUPERATION IMAGE //////////////////////////

        setLoading(false);
      } catch (error: any) {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // pourquoi le useeffect se lance 2 fois ?

  // useEffect(() => {
  //   const fetchImg = async () => {
  //     try {
  //       // console.log("ENTREE RECUPERATION IMAGE");
  //       // console.log("USER FROM USER IMG CONTEXT", user);
  //       //setPrintableImage([]);
  //       for (let i = 0; i < user!.profile_picture.length; i++) {
  //         console.log("USER PROFIL LENGHT", user!.profile_picture.length);
  //         const responseImg = await axios.get(
  //           `http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/get_img/${user?.id}`,
  //           {
  //             params: { id: user?.id, index: i },
  //             responseType: "arraybuffer",
  //             withCredentials: true,
  //           }
  //         );
  //         console.log("RESPONSE ALL IMAGE", responseImg.data);
  //         const base64Image = btoa(
  //           new Uint8Array(responseImg.data).reduce(
  //             (data, byte) => data + String.fromCharCode(byte),
  //             ""
  //           )
  //         );
  //         setPrintableImage((prev) => [
  //           ...prev,
  //           `data:image/jpeg;base64,${base64Image}`,
  //         ]);
  //       }
  //       //console.log("PRINTABLE IMAGE", printableImage);
  //       updateUser({ profile_picture: printableImage });
  //     } catch (error) {
  //       console.error("Error fetching user data Image:", error);
  //     }
  //   };

  //   if (user) {
  //     fetchImg(); // Fetch images only if user data is available
  //     console.log("USER FROM USER IMG CONTEXT", user);
  //   }
  // }, [user]); // Run this effect whenever user data changes

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
