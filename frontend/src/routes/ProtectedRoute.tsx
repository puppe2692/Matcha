import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useUserContext();
  const location = useLocation();
  const isProtectedFirstConnection = ["/signout", "/welcome"].includes(
    location.pathname
  );

  return loading ? (
    <CircularProgress />
  ) : user ? (
    isProtectedFirstConnection ||
    (user.gender && user.hashtags && user.bio && user.age && user.sex_pref) ? (
      <Outlet />
    ) : (
      <Navigate to="/firstco" />
    )
  ) : (
    <Navigate to="/signin" />
  );
};
