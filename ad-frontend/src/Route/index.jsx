import React from "react";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Layout/Loader";
import LayoutRoutes from "../Route/LayoutRoutes";
import { authRoutes } from "./AuthRoutes";
import PrivateRoute from "./PrivateRoute";
import { ManagerRoles } from "../Constant";

const Routers = () => {
  const isLoggedIn = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("userData"))?.role;
  return (
    <BrowserRouter basename={"/"}>
      <>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                role === ManagerRoles.FANCY_MANAGER ? (
                  <Navigate to="/running-markets/bookmaker-fancy" replace={true} />
                ) : (
                  <Navigate to="/dashboard" replace={true} />
                )
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            {authRoutes?.map(({ path, Component }, i) => (
              <Route exact path={path} element={Component} key={i} />
            ))}
            <Route element={<PrivateRoute />}>
              <Route path={`/*`} element={<LayoutRoutes />} />
            </Route>
          </Routes>
        </Suspense>
      </>
    </BrowserRouter>
  );
};

export default Routers;
