import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useUserContext();

  return loading ? (
    <CircularProgress />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};
