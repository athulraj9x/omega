import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import Language from "./Language";
import UserHeader from "./UserHeader";
import CurrencyChange from "./CurrencyChange";
import CommissionButton from "./commissionToggle/CommissionButton";
import BetRestrictToggle from "./betRestrictToggle/BetRestrictToggle";
import { UL } from "../../../AbstractElements";
import { ManagerRoles, layerRoles } from "../../../Constant";
import { socket } from "../../../context/socketContext";
import { playNotificationSound } from "../../../utils/helper";

const RightHeader = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const adminData = useSelector((state) => state.Login.userData);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleNewBet = (data) => {
      if (adminData?.userId?.toString() === data?.parent?.parent_id?.toString()) {
        playNotificationSound("placebet");
      } else if (adminData?.role < 1.9) {
        playNotificationSound("placebet");
      }
    };
  
    socket.on("new-bet", handleNewBet);
  
    return () => {
      socket.off("new-bet", handleNewBet);
    };
  }, []);
  

  const isMobile = windowWidth < 992;

  return (
    <Fragment>
      <Col
        xxl="7"
        xl="6"
        md="7"
        className="nav-right pull-right right-header col-10 p-0 ms-auto"
      >
        <UL attrUL={{ className: "simple-list nav-menus flex-row gap-2" }}>
          {/* <CurrencyChange /> */}
          <Language />
          <UserHeader />
        </UL>
      </Col>
    </Fragment>
  );
};

export default RightHeader;
