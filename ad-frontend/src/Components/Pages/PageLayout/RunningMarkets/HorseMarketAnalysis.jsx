/** @format */

import React, { useState, memo } from "react";
import { Fragment } from "react";
import { CardBody, CardHeader, Col, Container, Label, Row, Media } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { MdOutlineAutoGraph } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import Select from "react-select";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import volume from "../../../../assets/images/volume.png";
import volmute from "../../../../assets/images/mute.png";
import BetsTable from "./BetsTable";
import RunnersCard from "./RunnersCard";
import { convertINRToCurrency, formatDate, groupArrayasObject } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";

import { getActiveFancies, getAnalysisData, getBetsAndBooks, getCurrency } from "../../../../redux/action";
import {
  BetFilters,
  marketPriority,
  BET_TABLE_OPTIONS,
  exchangeMarketPriority,
  layerRoles,
  ManagerRoles,
} from "../../../../Constant";
import MarketsModal from "../modal/MarketsModal";
import { FiRefreshCw } from "react-icons/fi";

const HorseMarketAnalysis = memo(() => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const location = useLocation();
  const matchType = location?.state?.path;
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.Login.userData);

  const [openLive, setOpenLive] = useState(false);
  const [mute, setMute] = useState(false);
  const [groupedBets, setGroupedBets] = useState({});

  const [markets, setMarkets] = useState([]);
  const [marketId, setMarketId] = useState("");
  const [betsData, setBetsData] = useState({});
  const [marketTypes, setMarketTypes] = useState([]);
  const [socketData, setSocketData] = useState([]);

  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const [sharedBooks, setSharedBooks] = useState(false);
  const [betFairBooks, setBetFairBooks] = useState(false);
  const [betIds, setBetIds] = useState([]);
  const [betUpdate, setBetUpdate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [modalDatas, setModalDatas] = useState([]);
  const [marketCodes, setMarketCodes] = useState([]);
  const [viewDeleted, setViewDeleted] = useState({
    label: "ACTIVE",
    value: "ACTIVE",
  });
  const [selectReport, setSelectedReport] = useState({
    label: "ADMIN",
    value: "ADMIN",
  });
  const [totalPLByColumnResult, setTotalPLByColumnResult] = useState([]);
  const [isColumnTotalNewBet, setIsColumnTotalNewBet] = useState(false);
  const [isColumnTotalNewBetCurrency, setIsColumnTotalNewBetCurrency] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const line = "Line";
  // console.log("socketData",socketData);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  const toggleLiveAccordion = () => {
    setOpenLive(!openLive);
  };

  const handleVolume = () => {
    setMute(!mute);
  };

  const handleSharedBooks = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSharedBooks(!sharedBooks);
    setTotalPLByColumnResult([]);

    if (betFairBooks) {
      setBetFairBooks(false);
    }
  };

  const handleBetfairBooks = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setBetFairBooks(!betFairBooks);
    setTotalPLByColumnResult([]);
  };

  useEffect(() => {
    const handleNewBet = (data) => {
      setIsColumnTotalNewBet(true);
      setSocketData(data);
    };

    socket.on("new-bet", handleNewBet);

    return () => {
      socket.off("new-bet", handleNewBet);
    };
  }, [socket]);

  useEffect(() => {
    const handleBetStatusChange = (data) => {
      if (data && data?.length > 0) {
        let isMounted = true;
        init(isMounted);
      }
    };

    socket.on("betStatusChange", handleBetStatusChange);

    return () => {
      socket.off("betStatusChange", handleBetStatusChange);
    };
  }, [socket]);

  useEffect(() => {
    // Function to update the window dimensions
    const updateWindowDimensions = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    // Add an event listener to update dimensions when the window is resized
    window.addEventListener("resize", updateWindowDimensions);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    dispatch(
      getCurrency({
        callback: (data) => {
          setCurrencies([]);
          data.forEach((data) => {
            const { _id, name, value } = data;
            const obj = { label: name, value: { _id, value } };
            setCurrencies((prevArray) => [...prevArray, obj]);
          });
        },
      })
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    init(isMounted);
    return () => {
      isMounted = false; // Cancel the operation on unmount
    };
  }, [socketData, betIds, selectedCurrency, viewDeleted]);

  const init = (isMounted) => {
    const currencyId = selectedCurrency?.value?._id;
    let type;
    if (location?.state?.path === "/running-markets/exchange") {
      type = "exchange";
    }

    // console.log("location?.state?.path",location?.state?.path)

    dispatch(
      getBetsAndBooks({
        eventId: location?.state?.eventId,
        currencyId,
        deleted: viewDeleted?.value === "ACTIVE" ? false : true,
        type,
        horse: true,
        callback: (data) => {
          if (isMounted) {
            let currencyConversion = data?.data?.bets?.map((bet) => {
              return {
                ...bet,
                stake:
                  selectedCurrency?.value?.value === undefined
                    ? bet?.stake
                    : parseInt(convertINRToCurrency(bet?.stake, parseFloat(selectedCurrency?.value?.value))),
                liability:
                  selectedCurrency?.value?.value === undefined
                    ? bet?.liability
                    : parseInt(convertINRToCurrency(bet?.liability, parseFloat(selectedCurrency?.value?.value))),
              };
            });
            // console.log("data?.data?.books",data?.data?.books);
            let dataObj = {
              bets: currencyConversion,
              books: data?.data?.books,
            };
            setBetsData(dataObj);
          }
        },
      })
    );
  };

  useEffect(() => {
    let type;
    if (location?.state?.path === "/running-markets/exchange") {
      type = "exchange";
    }
    if (location?.state?.path === "/running-markets/bookmaker-fancy") {
      type = "";
    }
    let isMounted = true;
    dispatch(
      getAnalysisData({
        sportId: location?.state?.sportId,
        eventId: location?.state?.eventId,
        leagueId: location?.state?.leagueId,
        type,
        horse: true,
        callback: (data) => {
          if (isMounted) {
            // console.log("data?.marketDatas",data)
            setMarkets(data?.marketDatas);
            setMarketCodes(data?.marketCodes);
          }
        },
      })
    );
    return () => {
      isMounted = false; // Cancel the operation on unmount
    };
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(betsData).length !== 0) {
      let betsGrouped;

      if (matchType === "/running-markets/exchange") {
        const groupedBets = groupArrayasObject(betsData?.bets, "bettingType");
        // console.log("groupedBets",groupedBets)
        if (groupedBets) {
          let line;
          if (groupedBets?.ODDS && groupedBets?.ODDS !== undefined) {
            const { ODDS, ...rest } = groupedBets;
            line = rest;
          } else {
            const { ...rest } = groupedBets;
            line = rest;
          }
          const betsByMarketName = groupArrayasObject(groupedBets?.ODDS, "marketId", "marketName");

          if (line && line !== undefined) {
            betsGrouped = { ...line, ...betsByMarketName };
          } else {
            betsGrouped = { ...betsByMarketName };
          }
        }
      } else {
        // ELSE BLOCK FOR FANCY LINE MARKET
        betsGrouped = groupArrayasObject(betsData?.bets, "marketType");
      }
      // SETTING ALL MARKETS
      if (betsGrouped !== undefined) {
        // FOR BETS
        setGroupedBets(betsGrouped);
        // FOR MAP MARKET TYPES AND NAMES
        const marketOrder = ["Match Odds", "LINE", "Tied Match"];
        const sortedMarketTypes = Object.keys(betsGrouped).sort((a, b) => {
          const indexA = marketOrder.indexOf(a);
          const indexB = marketOrder.indexOf(b);

          // If a is in marketOrder, use its index; otherwise, assign a large number
          const orderA = indexA === -1 ? marketOrder.length : indexA;
          const orderB = indexB === -1 ? marketOrder.length : indexB;

          return orderA - orderB;
        });
        // console.log("markettypes",sortedMarketTypes);
        setMarketTypes(sortedMarketTypes);
        // setMarketTypes(Object.keys(betsGrouped));
      } else {
        setGroupedBets([]);
      }
    }
  }, [betsData]);

  useEffect(() => {
    dispatch(getActiveFancies({ eventCode: location?.state?.eventCode })); // add event code
  }, [dispatch, location?.state?.eventCode]);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const showAllBets = () => {
    handleModal();
  };

  const handleFilterByCurrencyReset = () => {
    setIsColumnTotalNewBetCurrency(false);
    if (selectedCurrency) {
      setSelectedCurrency("");
      setIsRotating(true);
      setTimeout(() => {
        setIsRotating(false);
      }, 100);
    }
  };

  const iconStyle = {
    transform: isRotating ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s",
    cursor: "pointer", // Add cursor style for clickable icons
    color: " #54ba4a",
    fontSize: "20px",
  };

  useEffect(() => {
    if (matchType === "/running-markets/bookmaker-fancy") {
      setModalDatas(betsData?.bets?.filter((data) => data?.marketType === "bookmaker" || data?.marketType === "fancy"));
    }
    if (matchType === "/running-markets/exchange") {
      setModalDatas(betsData?.bets?.filter((data) => data?.marketType === "exchange" || data?.marketType === "line"));
    }
  }, [openModal]);
  // console.log("marketTypes", marketTypes);
  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("RUNNING_MARKET_ANALYSIS")} title={title?.title} parent={title?.parent} />

      <Container fluid={true}>
        {/* <RightNavbar toggle={toggleSidebar} isOpen={sidebarIsOpen}  /> */}
        <div className="wrapper w-100">
          <>
            {/* <Collapse isOpen={rightBar}> */}
            {/* <div className={`sidebar ${sidebarIsOpen ? "is-open" : ""}`}> */}
            <CardBody className={`sidebar text-dark d-xl-none ${sidebarIsOpen ? "is-open" : ""}`}>
              <div
                className={`t-button btn btn-dark  p-1 ${sidebarIsOpen ? "" : "open"} d-xl-none`}
                onClick={toggleSidebar}
              >
                {sidebarIsOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-left"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                )}
              </div>
              {/* Left Section  */}
              <Col sm="10" md="12" className="pl-2">
                <div className="d-flex flex-row-reverse px-2 align-items-center">
                  <div>
                    <span
                      className="px-4 py-2 d-flex justify-content-center align-items-center  rounded gap-3"
                      style={{
                        backgroundColor: "white",
                        color: "#7367FD",
                        cursor: "pointer",
                      }}
                      onClick={() => showAllBets()}
                    >
                      <IoEye className="" style={{ fontSize: "20px" }} />
                      All Bets
                    </span>
                  </div>
                </div>
                {windowWidth <= 1024 &&
                  groupedBets !== undefined &&
                  groupedBets.length !== 0 &&
                  marketTypes
                    .sort((a, b) => {
                      const priorityA = exchangeMarketPriority[a] || 9999;
                      const priorityB = exchangeMarketPriority[b] || 9999;
                      return priorityA - priorityB;
                    })
                    .map((mrkt, index) => {
                      return (
                        <Row className="right-row w-100 m-0" key={index}>
                          <BetsTable
                            market={mrkt}
                            // bets={
                            //   betsData?.bets?.length !== 0
                            //     ? groupedBets?.[mrkt]
                            //     : []
                            // }
                            bets={groupedBets?.[mrkt]}
                            pagination={false} // bcs no pagination needed for fancy
                            // rowCount={rowCount}
                            // currentPage={currentPage}
                            // totalPages={totalPages}
                            // setCurrentPage={setCurrentPage}
                            // setRowCount={setRowCount}
                            // setActionTable={setActionTable}
                            viewDeleted={viewDeleted}
                            socketData={socketData}
                            eventId={location?.state?.eventId}
                            currency={selectedCurrency}
                            setBetUpdate={setBetUpdate}
                            setBetIds={setBetIds}
                            sharedBooks={sharedBooks}
                            betFairBooks={betFairBooks}
                            marketType={marketTypes}
                          />
                        </Row>
                      );
                    })}
              </Col>
            </CardBody>
            {/* </div> */}
            {/* </Collapse> */}
          </>
        </div>
        <Row className="p-2">
          {/* Right Section  */}
          <Col sm="12" md="12" lg="12" xl="7" className="px-0">
            <CardHeader className="manageEve-card bg-primary rounded mt-2">
              <Row className="">
                <Col>
                  <div className="toggle-button d-flex align-items-center justify-content-end">
                    <span
                      onClick={() => toggleLiveAccordion()}
                      style={{ cursor: "pointer" }}
                      className="border d-flex align-items-center justify-content-end gap-2 px-2 rounded-3"
                    >
                      <p className=" manageEve-card-text d-flex align-items-center">Live Score </p>

                      <div className="live-score" style={{ width: "2rem", height: "2rem" }}>
                        <MdOutlineAutoGraph className="fs-3" />
                      </div>
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center align-items-center">
                  <h4 className="m-2 text-white">{location?.state?.eventName}</h4>
                  <img
                    onClick={handleVolume}
                    src={mute ? volmute : volume}
                    alt="volume"
                    className="volume-img pointer"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="ml-2">
                  <p className=" manageEve-card-text">{formatDate(location?.state?.eventDate)}</p>
                </Col>
                <Col className="ml-2 d-flex gap-2 justify-content-end">
                  <Media body className={`${"text-left"} d-flex align-items-center justify-content-end gap-2`}>
                    <span
                      onClick={(e) => handleSharedBooks(e)}
                      style={{ cursor: "pointer" }}
                      className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                    >
                      <span className="fw-semibold fs-6 d-flex align-items-center">Shared Books </span>
                      <Label className={`m-0 ${"switch"}`}>
                        <input type="checkbox" checked={sharedBooks} />
                        <span
                          className="switch-state"
                          style={{
                            backgroundColor: sharedBooks ? "limegreen" : "lightgray",
                          }}
                        />
                      </Label>
                    </span>
                  </Media>
                </Col>
              </Row>
            </CardHeader>
            {openLive && (
              <div className="live-matches px-3 py-2 transition-transform duration-2000">
                <iframe
                  data-v-1220302c=""
                  width="100%"
                  height={285}
                  scrolling="no"
                  src={`https://nxbet247.com/live-score-card/${location?.state?.sportCode}/${location?.state?.raderId}`}
                  // src={`https://score.1cricket.co/?e=${location?.state?.raderId}&s=${location?.state?.sportCode}`}
                  title="Online Sport Live Score"
                  marginwidth="0"
                  marginheight="0"
                  frameborder="0"
                  allowfullscreen="allowfullscreen"
                  class="live-score-iframe"
                ></iframe>
              </div>
            )}
            {markets?.length !== 0 && (
              <RunnersCard
                eventName={location?.state?.eventName?.split(" v ")}
                eventCode={location?.state?.eventCode}
                sportCode={location?.state?.sportCode}
                marketCodes={marketCodes}
                eventId={location?.state?.eventId}
                eventMarkets={markets}
                allBets={betsData}
                sharedBooks={sharedBooks}
                setSharedBooks={setSharedBooks}
                betFairBooks={betFairBooks}
                setBetFairBooks={setBetFairBooks}
                setBetIds={setBetIds}
                betIds={betIds}
                currency={selectedCurrency}
                currencyId={selectedCurrency?.value?._id}
                viewDeleted={viewDeleted}
                socketData={socketData}
                matchType={matchType}
                setTotalPLByColumnResult={setTotalPLByColumnResult}
                totalPLByColumnResult={totalPLByColumnResult}
                isColumnTotalNewBet={isColumnTotalNewBet}
                setIsColumnTotalNewBet={setIsColumnTotalNewBet}
                isColumnTotalNewBetCurrency={isColumnTotalNewBetCurrency}
                setIsColumnTotalNewBetCurrency={setIsColumnTotalNewBetCurrency}
              />
            )}
          </Col>
          <Col sm="12" md="12" lg="5" className={`p-0 ps-lg-2 d-none d-xl-block`}>
            <div className="d-flex flex-row-reverse px-2 align-items-center gap-2">
              <div>
                <span
                  className="p-2 d-flex justify-content-center align-items-center  rounded gap-3"
                  style={{
                    backgroundColor: "#7367FD",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => showAllBets()}
                >
                  {/* <IoEye
                  size={10}
                  /> */}
                  View All Bets
                </span>
              </div>
              {[layerRoles.DIRECTOR, ManagerRoles.MANAGER]?.includes(adminData?.role) && (
                <>
                  <div className="d-flex align-items-center gap-2 ">
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: "150px",
                        }),
                      }}
                      options={currencies}
                      className="mySelect"
                      value={selectedCurrency}
                      placeholder={t("SELECT_CURRENCY")}
                      onChange={(option) => {
                        setSelectedCurrency(option);
                      }}
                    />
                    <FiRefreshCw style={iconStyle} onClick={handleFilterByCurrencyReset} />
                  </div>
                  <div className="d-flex align-items-center gap-2 ">
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: "150px",
                        }),
                      }}
                      options={BetFilters}
                      className="mySelect"
                      value={viewDeleted}
                      placeholder={t("FILTER_BETS")}
                      onChange={(option) => {
                        setViewDeleted(option);
                      }}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2 ">
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: "150px",
                        }),
                      }}
                      options={BET_TABLE_OPTIONS}
                      className="mySelect"
                      value={selectReport}
                      placeholder={t("FILTER_BETS")}
                      onChange={(option) => {
                        setSelectedReport(option);
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {windowWidth > 1024 &&
              groupedBets !== undefined &&
              groupedBets.length !== 0 &&
              marketTypes?.map((mrkt, index) => {
                if (matchType === "/running-markets/exchange") {
                  return (
                    <Row sm="12" className="right-row w-100 m-0 " key={index}>
                      <BetsTable
                        market={mrkt}
                        bets={groupedBets?.[mrkt]}
                        pagination={false}
                        // bcs no pagination needed for fancy mrkt !== "fancy" ? true : false
                        // rowCount={rowCount}
                        // currentPage={currentPage}
                        // totalPages={totalPages}
                        // setCurrentPage={setCurrentPage}
                        // setRowCount={setRowCount}
                        // setActionTable={setActionTable}
                        viewDeleted={viewDeleted}
                        socketData={socketData}
                        eventId={location?.state?.eventId}
                        setBetUpdate={setBetUpdate}
                        setBetIds={setBetIds}
                        currency={selectedCurrency}
                        matchType={matchType}
                        marketType={marketTypes}
                        sharedBooks={sharedBooks}
                        betFairBooks={betFairBooks}
                        betsData={betsData}
                        selectReport={selectReport?.value}
                      />
                    </Row>
                  );
                } else if (
                  matchType === "/running-markets/bookmaker-fancy" &&
                  (mrkt === "bookmaker" || mrkt === "fancy")
                ) {
                  return (
                    <Row sm="12" className="right-row w-100 m-0 " key={index}>
                      <BetsTable
                        market={mrkt}
                        bets={groupedBets?.[mrkt]}
                        pagination={false} // bcs no pagination needed for fancy mrkt !== "fancy" ? true : false
                        setBetUpdate={setBetUpdate}
                        setBetIds={setBetIds}
                        viewDeleted={viewDeleted}
                        socketData={socketData}
                        eventId={location?.state?.eventId}
                        currency={selectedCurrency}
                        matchType={matchType}
                        marketType={marketTypes}
                        selectReport={selectReport?.value}
                      />
                    </Row>
                  );
                }
              })}
          </Col>
        </Row>
      </Container>
      {openModal && (
        <MarketsModal
          isOpen={openModal}
          toggler={handleModal}
          size="lg"
          pagination={true}
          // role={role}
          // modalData={betsData?.bets?.length !== 0 ? modalDatas : []}
          isMultiple={true}
          marketId={marketId}
          viewDeleted={viewDeleted}
          socketData={socketData}
          eventId={location?.state?.eventId}
          currency={selectedCurrency}
          matchType={matchType}
          marketType={marketTypes}
        />
      )}
    </Fragment>
  );
});

export default HorseMarketAnalysis;
