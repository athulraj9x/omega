import React, { useContext, useState } from "react";
import { Menu } from "react-feather";
import { Link } from "react-router-dom";
import { Image } from "../../AbstractElements";
import OfficialIconLight from "../../assets/images/logo/logo-light-white.png";
import OfficialIconDark from "../../assets/images/logo/logo-dark.png";
import CustomizerContext from "../../_helper/Customizer";
import adminLogo from "../../assets/images/adminLogo.png";
import { useSelector } from "react-redux";
import { ManagerRoles } from "../../Constant";


const SidebarLogo = ({ Loading }) => {
  const role = JSON.parse(localStorage.getItem("userData"))?.role;
  const { mixLayout, toggleSidebar, layout, layoutURL } =
    useContext(CustomizerContext);

  const [toggle, setToggle] = useState(false);
  const NavData = useSelector((state) => state?.FetchWhiteLabelData?.data);

  const openCloseSidebar = () => {
    setToggle(!toggle);
    toggleSidebar(toggle);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const defaultUrl = "https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/xxexch247.com/xxexch247.com-light.png"

  return (
    <div className="logo-wrapper top-left-box">
      {layout1 !== "compact-wrapper dark-sidebar" &&
        layout1 !== "compact-wrapper color-sidebar" &&
        mixLayout ? (
        <Link to={`${role === ManagerRoles.FANCY_MANAGER ? "/running-markets/bookmaker-fancy" : "/dashboard"}`}>  
          <Image
            attrImage={{
              className: "img-fluid d-inline w-75",
              src: `${!Loading ? NavData ? NavData?.data?.whiteLabel[0]?.logo_dark : adminLogo : ""}`,
              alt: "Logo",
            }}
          />
        </Link>
      ) : (
        <Link to={`${role === ManagerRoles.FANCY_MANAGER ? "/running-markets/bookmaker-fancy" : "/dashboard"}`}>
          <Image
            attrImage={{
              className: "img-fluid d-inline w-75",
              src: `${!Loading ? NavData ? NavData?.data?.whiteLabel[0]?.logo_dark : adminLogo : ""}`,
              alt: "",
            }}
          />
        </Link>
      )}
      <div className="back-btn" onClick={() => openCloseSidebar()}>
        <i className="fa fa-angle-left"></i>
      </div>
      <div className="toggle-sidebar mt-1" onClick={openCloseSidebar}>
        <Menu className="status_toggle middle sidebar-toggle" />
      </div>
    </div>
  );
};

export default SidebarLogo;
//change here
