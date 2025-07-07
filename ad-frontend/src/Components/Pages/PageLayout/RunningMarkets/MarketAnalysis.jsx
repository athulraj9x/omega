/** @format */
import React, { useState, memo, useRef } from "react";
import { Fragment } from "react";
import { CardBody, CardHeader, Col, Container, Label, Row, Media, Input, Button } from "reactstrap";
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
import { formatDate } from "../../../../utils/helper";
import { CiFilter } from "react-icons/ci";
import WidgetLMT from "./WidgetLMT";
import { getActiveFancies, getAnalysisData, getBetsAndBooks, getCurrency } from "../../../../redux/action";
import {
  BetFilters,
  BET_TABLE_OPTIONS,
  exchangeMarketPriority,
  layerRoles,
  ManagerRoles,
  RefreshValues,
} from "../../../../Constant";
import MarketsModal from "../modal/MarketsModal";
import { FiRefreshCw } from "react-icons/fi";
import { HorseRelatedSportsCode } from "../../../../utils/constants";

const MarketAnalysis = memo(() => {
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
  const [sharedBooks, setSharedBooks] = useState(true);

  let toShowBB = [
    ManagerRoles.ACCOUNTS_MANAGER,
    ManagerRoles.MANAGER,
    ManagerRoles.FANCY_MANAGER,
    ManagerRoles.OPERATIONAL_MANAGER,
    layerRoles.DIRECTOR,
  ].includes(adminData?.role);

  const [betFairBooks, setBetFairBooks] = useState(toShowBB);
  const [betIds, setBetIds] = useState([]);
  const [betUpdate, setBetUpdate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [filterBetAmount, setFilterBetAmount] = useState(0);
  const intervalRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);
  const [marketCodes, setMarketCodes] = useState([]);
  const [viewDeleted, setViewDeleted] = useState({
    label: "ACTIVE",
    value: "ACTIVE",
  });

  const [refreshTimer, setRefreshtimer] = useState(
    adminData?.role === 1 ? { label: "30 Seconds", value: 30 } : { label: "1 Minute", value: 60 }
  );
  const [isTimerOn, setIsTimerOn] = useState(adminData?.role === 1);
  const [isResolving, setIsResolving] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const [intervalId, setIntervalId] = useState(null);
  const [selectReport, setSelectedReport] = useState({
    label: "ADMIN",
    value: "ADMIN",
  });

  const [totalPLByColumnResult, setTotalPLByColumnResult] = useState([]);
  const [isColumnTotalNewBetCurrency, setIsColumnTotalNewBetCurrency] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const containerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const offset = containerRef.current.getBoundingClientRect().top;
      setIsSticky(offset <= 48); // 3rem = 48px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  const toggleLiveAccordion = () => {
    setOpenLive(!openLive);
  };

  const handleVolume = () => {
    setMute(!mute);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const offset = containerRef.current.getBoundingClientRect().top;
      setIsSticky(offset <= 48); // 3rem = 48px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [selectedCurrency, viewDeleted]);

  const init = (isMounted) => {
    setIsResolving(true);
    const currencyId = selectedCurrency?.value?._id;
    let type;
    if (location?.state?.path === "/running-markets/exchange") {
      type = "exchange";
    }
    dispatch(
      getBetsAndBooks({
        eventId: location?.state?.eventId,
        currencyId,
        deleted: viewDeleted?.value === "ACTIVE" ? false : true,
        type,
        filterBetAmount,
        callback: (data) => {
          if (isMounted) {
            let dataObj = {
              books: data?.data?.books,
            };
            setIsResolving(false);
            setMarketTypes(data?.data?.marketType);
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
        venueId: location?.state?.venueId,
        type,
        callback: (data) => {
          if (isMounted) {
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
    if (location?.state?.path === "/running-markets/bookmaker-fancy") {
      dispatch(getActiveFancies({ eventCode: location?.state?.eventCode })); // add event code
    }
  }, [dispatch, location?.state?.eventCode]);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const showAllBets = () => {
    handleModal();
  };

  const handleRefreshPanelClick = () => {
    init(true);
    setTriggerRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (isTimerOn && refreshTimer?.value) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        handleRefreshPanelClick();
      }, refreshTimer.value * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerOn, refreshTimer]);

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

  const handleBetAmountFilter = () => {
    init(true);
    setTriggerRefresh((prev) => !prev);
  };

  const iconStyle = {
    transform: isRotating ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s",
    cursor: "pointer", // Add cursor style for clickable icons
    color: " #54ba4a",
    fontSize: "20px",
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("RUNNING_MARKET_ANALYSIS")} title={title?.title} parent={title?.parent} />

      <div ref={containerRef}>
        {windowWidth < 800 && (
          <Container
            fluid={true}
            style={{
              position: isSticky ? "fixed" : "static",
              top: isSticky ? "3rem" : "auto",
              width: "100%",
              backgroundColor: "#fff",
              zIndex: isSticky ? 100 : "auto",
              transition: "all 0.2s ease",
            }}
          >
            <div className="d-flex flex-row-reverse px-2 align-items-center gap-2 p-2">
              <div>
                <span
                  className="p-2 d-flex justify-content-center align-items-center rounded gap-3"
                  style={{
                    backgroundColor: "#7367FD",
                    color: "white",
                    cursor: isTimerOn || isResolving ? "not-allowed" : "pointer",
                    opacity: isTimerOn || isResolving ? 0.5 : 1,
                  }}
                  onClick={!isTimerOn && !isResolving ? handleRefreshPanelClick : undefined}
                >
                  Refresh Panel
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 ">
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minWidth: "100px",
                    }),
                  }}
                  options={RefreshValues}
                  className="mySelect"
                  value={refreshTimer}
                  isDisabled={!isTimerOn || isResolving}
                  placeholder={t("1 Minute")}
                  onChange={(option) => {
                    setRefreshtimer(option);
                  }}
                />
              </div>
              <label
                className="input-border"
                style={{
                  cursor: isResolving ? "not-allowed" : "pointer",
                  opacity: isResolving ? 0.5 : 1,
                  margin: "0px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isTimerOn}
                  disabled={isResolving}
                  onClick={() => setIsTimerOn(!isTimerOn)}
                />
                <div className="custom-checkmark"></div>
              </label>
            </div>
          </Container>
        )}
      </div>

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
                            pagination={false} // bcs no pagination needed for fancy
                            viewDeleted={viewDeleted}
                            socketData={socketData}
                            eventId={location?.state?.eventId}
                            currency={selectedCurrency}
                            setBetIds={setBetIds}
                            sharedBooks={sharedBooks}
                            betFairBooks={betFairBooks}
                            marketType={marketTypes}
                            setIsResolving={setIsResolving}
                            triggerRefresh={triggerRefresh}
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
          {/* Left Section  */}
          <Col sm="12" md="12" lg="12" xl="7" className="px-0">
            <CardHeader className="manageEve-card bg-primary rounded mt-2">
              <Row className="">
                <Col>
                  {HorseRelatedSportsCode?.some((item) => item?.sportsCode === location?.state?.sportCode) ? (
                    <div className="toggle-button d-flex align-items-center justify-content-end">
                      <span
                        style={{ cursor: "pointer" }}
                        className="border d-flex align-items-center justify-content-end gap-2 px-2 rounded-3"
                      >
                        <p className=" manageEve-card-text d-flex align-items-center"></p>

                        <div className="live-score" style={{ width: "2rem", height: "2rem" }}>
                          <MdOutlineAutoGraph className="fs-3" />
                        </div>
                      </span>
                    </div>
                  ) : (
                    <div className="toggle-button d-flex align-items-center justify-content-end"></div>
                  )}
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
                      // onClick={(e) => handleSharedBooks(e)}
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
            <WidgetLMT raderId={location?.state?.raderId} />

            {markets?.length !== 0 && (
              <RunnersCard
                eventCode={location?.state?.eventCode}
                sportsCode={location?.state?.sportCode}
                marketCodes={marketCodes}
                eventId={location?.state?.eventId}
                triggerRefresh={triggerRefresh}
                eventMarkets={markets}
                sharedBooks={sharedBooks}
                setSharedBooks={setSharedBooks}
                betFairBooks={betFairBooks}
                setBetFairBooks={setBetFairBooks}
                setBetIds={setBetIds}
                betIds={betIds}
                currency={selectedCurrency}
                viewDeleted={viewDeleted}
                socketData={socketData}
                matchType={matchType}
                setTotalPLByColumnResult={setTotalPLByColumnResult}
                marketTypes={marketTypes}
                filterBetAmount={filterBetAmount}
              />
            )}
          </Col>
          {/* Right Section */}
          <Col sm="12" md="12" lg="5" className={`p-0 ps-lg-2 d-none d-xl-block`}>
            <div className="d-flex flex-row-reverse px-2 align-items-center gap-2 p-2">
              <div>
                <span
                  className="p-2 d-flex justify-content-center align-items-center rounded gap-3"
                  style={{
                    backgroundColor: "#7367FD",
                    color: "white",
                    cursor: isTimerOn || isResolving ? "not-allowed" : "pointer",
                    opacity: isTimerOn || isResolving ? 0.5 : 1,
                  }}
                  onClick={!isTimerOn && !isResolving ? handleRefreshPanelClick : undefined}
                >
                  Refresh Panel
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 ">
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minWidth: "150px",
                      fontSize: "13px",
                    }),
                  }}
                  options={RefreshValues}
                  className="mySelect"
                  value={refreshTimer}
                  isDisabled={!isTimerOn || isResolving}
                  placeholder={t("1 Minute")}
                  onChange={(option) => {
                    setRefreshtimer(option);
                  }}
                />
              </div>
              <label
                className="input-border"
                style={{
                  cursor: isResolving ? "not-allowed" : "pointer",
                  opacity: isResolving ? 0.5 : 1,
                  margin: "0px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isTimerOn}
                  disabled={isResolving}
                  onClick={() => setIsTimerOn(!isTimerOn)}
                />
                <div className="custom-checkmark"></div>
              </label>
            </div>
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
              {[layerRoles.DIRECTOR, ManagerRoles.FANCY_MANAGER, ManagerRoles.MANAGER]?.includes(adminData?.role) && (
                <>
                  <div className="d-flex align-items-center gap-2 ">
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: "100px",
                          fontSize: "13px",
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
                          minWidth: "100px",
                          fontSize: "13px",
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
                          minWidth: "100px",
                          fontSize: "13px",
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
              groupedBets?.length !== 0 &&
              marketTypes?.map((mrkt, index) => {
                if (matchType === "/running-markets/exchange") {
                  return (
                    <Row sm="12" className="right-row w-100 m-0 " key={index}>
                      <BetsTable
                        market={mrkt}
                        pagination={false}
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
                        selectReport={selectReport?.value}
                        setIsResolving={setIsResolving}
                        triggerRefresh={triggerRefresh}
                        filterBetAmount={filterBetAmount}
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
                        setIsResolving={setIsResolving}
                        triggerRefresh={triggerRefresh}
                        filterBetAmount={filterBetAmount}
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
          isMultiple={true}
          marketId={marketId}
          viewDeleted={viewDeleted}
          socketData={socketData}
          eventId={location?.state?.eventId}
          currency={selectedCurrency}
          matchType={matchType}
          marketType={marketTypes}
          marketTypes={marketTypes}
          filterBetAmount={filterBetAmount}
        />
      )}
    </Fragment>
  );
});

export default MarketAnalysis;
