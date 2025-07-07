import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const jwt_token = localStorage.getItem("token");

  return jwt_token ? <Outlet /> : <Navigate exact to={`/login`} replace={true} />;
};

export default PrivateRoute;
