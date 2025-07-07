import React, { useEffect, useLayoutEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ThemeCustomize from "../Layout/ThemeCustomizer";
import Footer from "./Footer";
import CustomizerContext from "../_helper/Customizer";
import { useDispatch, useSelector } from "react-redux";
import { fetchWhiteLabelData } from "../redux/action";

const AppLayout = ({ children, classNames, ...rest }) => {
  const [loading, setLoading]= useState(true);
  const { layout } = useContext(CustomizerContext);
  const { sidebarIconType } = useContext(CustomizerContext);

  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const sideBarIcon =
    localStorage.getItem("sidebar_icon_type") || sidebarIconType;
  const dispatch = useDispatch();
  const userData=useSelector((state)=>state.Login.userData);
  const [whiteLabelData, setWhiteLabelData] = useState({});

  useEffect(() => {
    dispatch(
      fetchWhiteLabelData({
        whiteLabelId: userData?.whiteLabelId,
        domain: window.location.origin,
        callback: (data) => {
          setWhiteLabelData(data);
          setLoading(false);
        },
      })
    );
  }, [userData]);

  useLayoutEffect(() => {
    if(window.location.origin!==process.env.REACT_APP_BETXFAIR_DOMAIN_ADMIN){
      const favicon = document.getElementById('favicon');
      const brandFaviconURL = whiteLabelData ? whiteLabelData.logo_dark : "" ;
      if (favicon && brandFaviconURL) {
        favicon.href = brandFaviconURL;
      }
    } else {
      document.title="Betxfair - Admin"
    }
    }, [whiteLabelData]);
    
  return (
    <>
      <div
        className={`page-wrapper ${layout1}`}
        sidebar-layout={sideBarIcon}
        id="pageWrapper"
      >
        <Header />
        <div className="page-body-wrapper">
          <Sidebar Loading={loading}/>
          <div className="page-body">
            <div>
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <ThemeCustomize />
      <ToastContainer />
    </>
  );
};
export default AppLayout;
