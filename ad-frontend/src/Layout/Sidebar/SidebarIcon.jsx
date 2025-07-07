import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import sideBarIcon from "../../assets/images/ball.png";

const SidebarIcon = () => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <div className="logo-icon-wrapper border border-danger">
      <Link to={`${process.env.PUBLIC_URL}/pages/sample-page/${layoutURL}`}>
        <img style={{width:"3rem"}} className="img-fluid" src={sideBarIcon} alt="" />
      </Link>
    </div>
  );
};

export default SidebarIcon;
