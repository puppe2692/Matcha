import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useUserContext();

  return loading ? (
    <CircularProgress />
  ) : user ? (
    user.gender && user.hashtags && user.bio && user.age && user.sex_pref ? (
      <Outlet />
    ) : (
      <Navigate to="/firstco" />
    )
  ) : (
    <Navigate to="/signin" />
  );
};
