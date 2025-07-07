import React, { useRef } from "react";
import { Col, Row } from "reactstrap";
import Widgets1 from "../../../Common/Component/CommonWidgets/Widgets1";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ActiveClientsModal from "../modal/ActiveClientsModal";
import LiveExposureModal from "../modal/LiveExposureModal";
import { useEffect } from "react";
import SkeletonLoading from "../../../Common/Component/CommonWidgets/SkeletonLoading";
import { getDashboardData } from "../../../../redux/action/dashboard/getDashboardDataAction";
import TotalPlModal from "../modal/TotalPlModal";
import TotalClientModal from "../modal/TotalClientModal";
import ClientBalanceModal from "../modal/ClientBalanceModal";
import { useDispatch } from "react-redux";
import { getLocalStorageItem } from "../../../../utils/helper";
import { PAGINATION, ManagerRoles } from "../../../../Constant";
const WidgetsWrapper = React.memo(({ selectedOption,setDashboardLoading }) => {
  const { t } = useTranslation();
  const adminData = useSelector((state) => state.Login.userData);
  const [activeClientsModal, setActiveClientsModal] = useState(false);
  const [liveExposureModal, setLiveExposureModal] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [activeClients, setActiveClients] = useState({});
  const [totalClient, setTotalClient] = useState(false);
  const [dashboardData, setDashboardData] = useState({})
  const [totalClientsBalance, setTotalClientsBalance] = useState(false);
  const [totalPl, setTotalPl] = useState(false);
  const [selectionType, setSelectionType] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActiveClients = () => {
    setActiveClientsModal(true);
    setSelectionType("activeUsers")
  };
  const handleLiveExposure = () => {
    setLiveExposureModal(true);
  };
  const handleTotalClients = () => {
    setTotalClient(true);
    setSelectionType("allClient")
  };
  const handleAllClientBalance = () => {
    setTotalClientsBalance(true);
    setSelectionType("clientWithBalance")
  };
  const handleTotalPl = () => {
    setTotalPl(true);
    setSelectionType("totalPlData")
  };

  useEffect(() => {
    const userData = getLocalStorageItem("userData");
    if (userData) {
      setDashboardLoading(true)
      dispatch(getDashboardData({
        selectedOption,
        callback: (data) => {
          setDashboardData(data.data);
          setDashboardLoading(false)
        }
      }));
    } else {
      navigate("/login");
      return;
    }
  }, [dispatch,selectedOption]);


  useEffect(() => {
    const count = dashboardData?.activeUserCount - userIds?.length;

    const activeClients = {
      title: "ACTIVE_CLIENTS",
      total: count ? count : "0",
      color: "primary",
      icon: "rate",
    };
    setActiveClients(activeClients);
  }, [dashboardData?.activeUserCount, userIds]);
  
  const liveExposure = {
    title: "LIVE_EXPOSURE",

    total: dashboardData?.total_Exposure,

    color: "primary",
    icon: "rate",
  };
  const totalClients = {
    title: "TOTAL_CLIENTS",
    total: dashboardData?.totalClientCount,
    color: "success",
    icon: "rate",
  };
  const creditReference = {
    title: "CREDIT_REFERENCE",
    total: dashboardData?.myCreditReference?.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    color: "success",
    icon: "rate",
  };
  const totalBalance = {
    title: "TOTAL_BALANCE",
    total: dashboardData?.totalBalance?.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    color: "success",
    icon: "rate",
  };
  const myBalance = {
    title: "MY_BALANCE",
    total: dashboardData?.myBalance?.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    color: "success",
    icon: "rate",
  };
  const clientsBalance = {
    title: "CLIENT_BALANCE",
    total: dashboardData?.totalClientBalance?.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    color: "success",
    icon: "rate",
  };
  const totalPL = {
    title: "TOTAL_PL",
    total: dashboardData?.totalP_L?.toLocaleString("en-us", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    color: "success",
    icon: "rate",
  };

  const [data, setData] = useState(null); // Replace null with your actual initial data

  useEffect(() => {
    // Simulate API call or data loading
    setTimeout(() => {
      // Replace with actual data
      setData({
        color: "blue",
        icon: "your-icon-id",
        total: 123,
        title: "Your Widget Title",
      });
    }, 2000); // Simulating a 2-second loading time
  }, []);

  return (
    <>
      <Col xxl="4" xl="3" sm="6" className="box-col-6 flex-grow-1">
        <Row>
          <Col xl="12">
            <Link onClick={() => handleActiveClients()}>
              {data ? <Widgets1 data={activeClients} /> : <SkeletonLoading />}
            </Link>
          </Col>
          <Col xl="12">
            <Link>
              {data ? (
                <Widgets1
                  className="pointer"
                  data={liveExposure}
                  decimal={true}
                  handleLiveExposure={handleLiveExposure}
                />
              ) : (
                <SkeletonLoading />
              )}
            </Link>
          </Col>
          <Col xl="12">
            <Link onClick={() => handleTotalClients()}>
              {data ? <Widgets1 data={totalClients} /> : <SkeletonLoading />}
            </Link>
          </Col>
          <Col xl="12">
            <Link onClick={() => handleAllClientBalance()}>
              {data ? (
                <Widgets1 data={clientsBalance} decimal={true} />
              ) : (
                <SkeletonLoading />
              )}
            </Link>
          </Col>
        </Row>
      </Col>
      <Col xxl="4" xl="3" sm="6" className="box-col-6">
        <Row>
          <Col xl="12">
            {data ? (
              <Widgets1 data={creditReference} decimal={true} />
            ) : (
              <SkeletonLoading />
            )}
          </Col>
          <Col xl="12">
            {data ? (
              <Widgets1 data={totalBalance} decimal={true} />
            ) : (
              <SkeletonLoading />
            )}
          </Col>
          <Col xl="12">
            {data ? (
              <Widgets1 data={myBalance} decimal={true} />
            ) : (
              <SkeletonLoading />
            )}
          </Col>
          {adminData?.role !== ManagerRoles.MONITORING_MANAGER && <Col xl="12" className="flex-grow-1">
            <Link onClick={() => handleTotalPl()}>
              {data ? (
                <Widgets1 data={totalPL} decimal={true} />
              ) : (
                <SkeletonLoading />
              )}
            </Link>
          </Col>}
        </Row>
      </Col>


      {activeClientsModal && (
        <ActiveClientsModal
          isOpen={activeClientsModal}
          title={"Active Clients"}
          setActiveClients={setActiveClients}
          toggler={setActiveClientsModal}
          setUserIds={setUserIds}
          userIds={userIds}
          size="xl"
        />
      )}
      {liveExposureModal && (
        <LiveExposureModal
          isOpen={liveExposureModal}
          title={"Active Bets"}
          toggler={setLiveExposureModal}
          size="xl"
        />
      )}
      {totalClient && (
        <TotalClientModal
          isOpen={totalClient}
          title={"Total Client Details"}
          toggler={setTotalClient}
          size=""
        />
      )}
      {totalClientsBalance && (
        <ClientBalanceModal
          isOpen={totalClientsBalance}
          title={"Total Client Balance"}
          toggler={setTotalClientsBalance}
          size="l"
        />
      )}
      {totalPl && (
        <TotalPlModal
          isOpen={totalPl}
          title={"Total PL"}
          toggler={setTotalPl}
          size="l"
        />
      )}
    </>
  );
});

export default WidgetsWrapper;
