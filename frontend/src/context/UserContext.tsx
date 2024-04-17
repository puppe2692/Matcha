import React, { useContext, useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';

interface Prop {
    user: User | null;
    online: boolean;
    loginUser: (userData: User | null) => void;
    logoutUser: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const UserContext = React.createContext<Prop>({
    user: null,
    online: false,
    loginUser: () => {},
    logoutUser: () => {},
    updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [online, setOnline] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:5000/users/me`, {
                    withCredentials: true,
                });
                console.log("USER FROM USER CONTEXT", response.data);
                setUser(response.data);
            } catch (error: any) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const loginUser = (userData: User | null) => {
        setUser(userData);
        setOnline(true);
    };

    const logoutUser = () => {
        setUser(null);
        setOnline(false);
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
            value={{ user, online,  loginUser, logoutUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};