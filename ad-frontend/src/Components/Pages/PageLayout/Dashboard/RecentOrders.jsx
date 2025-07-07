import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { H5, UL, LI, H4 } from "../../../../AbstractElements";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CreditReference, MyBalance, layerRoles, ManagerRoles } from "../../../../Constant";
import ActualPlModal from "../modal/ActualPlModal";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { OrderContentSkeleton } from "../../../Common/Component/CommonWidgets/DashboardLeftLoading";
import Widgets1 from "../../../Common/Component/CommonWidgets/Widgets1";
import Widgets3B2C from "../../../Common/Component/CommonWidgets/Widgets3B2C";
import SkeletonLoading from "../../../Common/Component/CommonWidgets/SkeletonLoading";
import { getWithdrawal, getDepositList } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import { socket } from "../../../../context/socketContext";
import { WhiteLabelB2CTransactionStatus } from "../../../../utils/constants";
const RecentOrders = ({ dashboardLoading }) => {
  const { t } = useTranslation();
  const [actualPl, setActualPl] = useState(0);
  const [isActualPl, setIsActualPl] = useState(false);
  const [dashboardLeftData, setDashboardLeftData] = useState(null); // Replace with your actual state
  const userData = useSelector((state) => state.Login.userData);
  const adminData = useSelector((state) => state.Login.userData);
  const dispatch = useDispatch();
  const whiteLabelType = useSelector(
    (state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType
  );
  const dashboardData = useSelector((state) => state?.GetDashboardData?.dashboardData?.data);
  const [totalDepostAmount, setTotalDepositAmount] = useState(0);
  const [pendingDepositNo, setPendingDeposits] = useState(0);
  const [totalWithdrawalAmount, setTotalWithdrawalAmount] = useState(0);
  const [pendingWithdrawalNo, setPendingWithdrawals] = useState(0);
  const [cryptoPendingWithdrawalNo, setCryptoPendingWithdrawalNo] = useState(0);

  const totalActualPL = {
    title: "ACTUAL_PL",
    total:
      dashboardData?.pl > 0 ? Math.round(-dashboardData?.pl)?.toFixed(2) : Math.round(-dashboardData?.pl)?.toFixed(2),
    color: "success",
    icon: "rate",
  };

  const deposit = {
    title: "Total Deposit",
    total: totalDepostAmount,
    pending: pendingDepositNo,
    color: "success",
    icon: "rate",
  };
  const withdrawal = {
    title: "Total Withdrawal",
    total: totalWithdrawalAmount,
    pending: pendingWithdrawalNo,
    cryptoPending: cryptoPendingWithdrawalNo,
    color: "secondary",
    icon: "rate",
  };

  const getWhitelabelB2CDeposit = () => {
    dispatch(
      getDepositList({
        data: WhiteLabelB2CTransactionStatus.ALL,
        callback: (data) => {
          setTotalDepositAmount(data?.data?.totalAmount);
          setPendingDeposits(data?.data?.pendingCount);
        },
      })
    );
  };
  const getWhitelabelB2CWithdrawal = () => {
    dispatch(
      getWithdrawal({
        data: WhiteLabelB2CTransactionStatus.ALL,
        callback: (data) => {
          console.log({ data });
          setTotalWithdrawalAmount(data.totalAmount);
          setPendingWithdrawals(data?.pendingCount);
          setCryptoPendingWithdrawalNo(data?.pendingCryptoCount);
        },
      })
    );
  };

  useEffect(() => {
    const HandleNewDeposit = () => {
      getWhitelabelB2CDeposit();
      // notifySuccess("Deposit Request Recieved");
      // playNotificationSound("cash");
    };
    if (whiteLabelType && whiteLabelType === "B2C") {
      socket.on("DepositRequestRaised", HandleNewDeposit);
    }

    return () => {
      socket.off("DepositRequestRaised", HandleNewDeposit);
    };
  }, [socket, whiteLabelType]);

  //to get deposit and Withdrawal data;
  useEffect(() => {
    if (whiteLabelType && whiteLabelType === "B2C") {
      getWhitelabelB2CDeposit();
      getWhitelabelB2CWithdrawal();
    }
  }, [whiteLabelType]);

  useEffect(() => {
    const HandleNewWithdrawal = () => {
      // playNotificationSound("withdraw");
      getWhitelabelB2CWithdrawal();
      // notifySuccess("Withdrawal Request Recieved");
    };
    if (whiteLabelType && whiteLabelType === "B2C") {
      socket.on("WithdrawRequestRaised", HandleNewWithdrawal);
    }

    return () => {
      socket.off("WithdrawRequestRaised", HandleNewWithdrawal);
    };
  }, [socket, whiteLabelType]);

  useEffect(() => {
    if (dashboardLoading) {
      setDashboardLeftData(null);
    } else {
      setDashboardLeftData(dashboardData);
    }
  }, [dashboardLoading]);

  useEffect(() => {
    setTimeout(() => {
      // Replace with actual data
      setDashboardLeftData({
        totalP_L: 123,
        myCreditReference: 456,
        myBalance: 789,
      });
    }, 2000); // Simulating a 2-second loading time
  }, []);

  useEffect(() => {
    setActualPl(dashboardData?.pl > 0 ? -dashboardData?.pl : -dashboardData?.pl);
  }, [dashboardData?.pl]);
  // if (dashboardData?.totalP_L > 0) {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#2FE10B";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#2FE10B";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#4DF703";
  // } else if (dashboardData?.totalP_L < 0) {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#EB1C19";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#EB1C19";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#F73455";
  // } else {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#EEE";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#EEE";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#EEE";
  // }

  // if (dashboardData?.pl > 0) {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#2FE10B";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#2FE10B";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#4DF703";
  // } else if (dashboardData?.pl < 0) {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#EB1C19";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#EB1C19";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#F73455";
  // } else {
  //   RecentOrderChart.options.fill.gradient.gradientToColors = "#EEE";
  //   RecentOrderChart.options.fill.gradient.colorStops[0].color = "#EEE";
  //   RecentOrderChart.options.fill.gradient.colorStops[1].color = "#EEE";
  // }

  // Calculate the diameter of the CircularProgressbar based on the text length and text size
  // const diameter = 16 * actualPl?.toString()?.length + 10 * 2;
  // const textSize = Math.min(40, Math.floor(200 / actualPl?.toString()?.length));
  return (
    <>
      <Col xxl="4" xl="7" md="6" sm="5" className="box-col-6">
        <Card className="height-equal skeleton-loading" style={{ height: "auto" }}>
          <CardBody className="d-flex align-items-center flex-grow-1 skeleton-loading">
            <Row className="recent-wrapper flex-grow-1">
              {dashboardLeftData ? (
                <>
                  <Col xl="6" className="p-0 flex-grow-1">
                    <div
                      className="recent-chart"
                      style={{
                        width: "200px", // Set a fixed width for the container
                        height: "200px", // Set a fixed height for the container
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <ReactApexChart
                        type="radialBar"
                        height={329}
                        options={RecentOrderChart.options}
                        // series={[(dashboardData?.totalP_L ?? 0)]}
                        series={[
                          Math.round(
                            dashboardData?.pl
                          )?.toFixed(2) ?? 0, 
                        ]}
                      /> */}
                      {adminData?.role === layerRoles?.DIRECTOR ||
                      Object.values(ManagerRoles).includes(adminData?.role) ? (
                        <CircularProgressbar
                          strokeWidth={10}
                          value={100}
                          // text={`${Math.round(actualPl)?.toFixed(2) ?? 0}`}
                          text={`${actualPl?.toFixed(2) ?? 0}`}
                          styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0.25,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: "butt",

                            // Text size
                            textSize: `${12}px`,

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: `rgba(62, 152, 199, ${10 / 100})`,
                            textColor: "#000000",
                            trailColor:
                              dashboardData?.pl === 0 ? "#EEE" : dashboardData?.pl > 0 ? "#EB1C19" : "#2FE10B",
                            // backgroundColor: "#3e98c7",
                          })}
                        />
                      ) : (
                        <CircularProgressbar
                          strokeWidth={10}
                          value={100}
                          // text={`${Math.round(actualPl)?.toFixed(2) ?? 0}`}
                          text={`${dashboardData?.totalP_L?.toFixed(2) ?? 0}`}
                          styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0.25,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: "butt",

                            // Text size
                            textSize: `${12}px`,

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: `rgba(62, 152, 199, ${10 / 100})`,
                            textColor: "#000000",
                            trailColor:
                              dashboardData?.totalP_L === 0
                                ? "#EEE"
                                : dashboardData?.totalP_L < 0
                                ? "#EB1C19"
                                : "#2FE10B",
                            // backgroundColor: "#3e98c7",
                          })}
                        />
                      )}
                    </div>
                  </Col>
                  <Col xl="6" className="flex-grow-1">
                    <UL attrUL={{ className: "order-content" }}>
                      <LI>
                        <span className="recent-circle bg-primary"> </span>
                        <div>
                          <span className="f-light f-w-500">{t(`${CreditReference}`)}</span>
                          <H4 attrH4={{ className: "mt-1 mb-0" }}>
                            {dashboardData?.myCreditReference?.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            {/* {convertINRToCurrency(
                              dashboardData?.myCreditReference,
                              parseFloat(userData?.currencyId?.value)
                            )} */}
                          </H4>
                        </div>
                      </LI>
                      <LI>
                        <span className="recent-circle bg-info" />
                        <div>
                          <span className="f-light f-w-500">{t(`${MyBalance}`)}</span>
                          <H4 attrH4={{ className: "mt-1 mb-0" }}>
                            {dashboardData?.myBalance?.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            {/* {convertINRToCurrency(
                              dashboardData?.myBalance,
                              parseFloat(userData?.currencyId?.value)
                            )} */}
                          </H4>
                        </div>
                      </LI>
                    </UL>
                  </Col>
                </>
              ) : (
                <>
                  <OrderContentSkeleton />
                </>
              )}
            </Row>
          </CardBody>
        </Card>
        {/* {(adminData?.role === layerRoles.DIRECTOR ||
          Object.values(ManagerRoles).includes(adminData?.role)) && ( */}
        <Row>
          {adminData?.role === layerRoles.DIRECTOR && (
            <Col xl="12" className="flex-grow-1">
              <Link onClick={() => setIsActualPl(true)}>
                {dashboardLeftData ? <Widgets1 data={totalActualPL} decimal={true} /> : <SkeletonLoading />}
              </Link>
            </Col>
          )}
          {/* whitelabeldepositwithdrawalHere */}
          {whiteLabelType && whiteLabelType === "B2C" && (
            <>
              <Col xl="12" className="flex-grow-1">
                <Link to={"/deposit-list"}>
                  {whiteLabelType ? <Widgets3B2C data={deposit} decimal={true} /> : <SkeletonLoading />}
                </Link>
              </Col>

              <Col xl="12" className="flex-grow-1">
                {/* <Link to={"/withdrawal-list"}> */}
                {whiteLabelType ? <Widgets3B2C data={withdrawal} decimal={true} /> : <SkeletonLoading />}
                {/* </Link> */}
              </Col>
            </>
          )}
        </Row>
        {/* )} */}
      </Col>

      {isActualPl && <ActualPlModal isOpen={isActualPl} title={"Total PL"} toggler={setIsActualPl} size="l" />}
    </>
  );
};

export default RecentOrders;
