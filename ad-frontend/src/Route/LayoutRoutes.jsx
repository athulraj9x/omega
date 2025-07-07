import React, { Fragment, memo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routes, protectedRoutes } from "./Routes";
import AppLayout from "../Layout/Layout";
import { getLocalStorageItem } from "../utils/helper";
import { ManagerRoles, layerRoles } from "../Constant";

const LayoutRoutes = memo(() => {
  const jwt_token = JSON.parse(getLocalStorageItem("userData"));
  return (
    <>
      <Routes>
        {jwt_token?.role !== layerRoles.DIRECTOR && jwt_token?.role >= 7
          ? routes.map(({ path, Component }, i) => (
              <Fragment key={i}>
                <Route element={<AppLayout />} key={i}>
                  <Route path={path} element={Component} />
                </Route>
              </Fragment>
            ))
          : protectedRoutes.map(({ path, Component, managerAccess }, i) => {
              if (
                jwt_token?.role === ManagerRoles.ACCOUNTS_MANAGER ||
                jwt_token?.role === ManagerRoles.FANCY_MANAGER ||
                jwt_token?.role === ManagerRoles.OPERATIONAL_MANAGER ||
                jwt_token?.role === ManagerRoles.MONITORING_MANAGER
              ) {
                if (managerAccess?.includes(jwt_token?.role)) {
                  return (
                    <Fragment key={i}>
                      <Route element={<AppLayout />} key={i}>
                        <Route path={path} element={Component} />
                      </Route>
                    </Fragment>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <Fragment key={i}>
                    <Route element={<AppLayout />} key={i}>
                      <Route path={path} element={Component} />
                    </Route>
                  </Fragment>
                );
              }
            })}
      </Routes>
    </>
  );
}, []);

export default LayoutRoutes;
