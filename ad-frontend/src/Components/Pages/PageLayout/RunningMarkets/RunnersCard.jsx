import React, { memo, useCallback, useState } from "react";
import { Fragment } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { useEffect } from "react";
import MarketsModal from "../modal/MarketsModal";
import { eventMarketPriority } from "../../../../Constant";
import MatchOddsCard from "./odds/MatchOddsCard";
import BookMakerCard from "./odds/BookMakerCard";
import BookView from "./BookView";
import { useTranslation } from "react-i18next";
import { findFancyRunnerBooks } from "../../../../utils/helper";
import FancyOddsCard from "./odds/FancyOddsCard";
import { useSelector } from "react-redux";
import api from "../../../../utils/oddApi";
import { getFancyMarketBets, } from "../../../../redux/action";
import { useDispatch } from "react-redux";

const RunnersCard = ({
  eventMarkets,
  marketCodes,
  allBets,
  eventCode,
  eventId,
  setBetFairBooks,
  betFairBooks,
  sharedBooks,
  setSharedBooks,
  setBetIds,
  betIds,
  currency,
  matchType,
  viewDeleted,
  socketData,
  setTotalPLByColumnResult,
  marketTypes,
  triggerRefresh,
  filterBetAmount,
}) => {
  let fancyData = useSelector((state) => state?.getFancyMarkets?.fancyData?.data);
  const marketBooksData = useSelector((state) => state.GetBetsAndBooks?.allData?.books);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [groupedBets, setGroupedBets] = useState([]);
  const [modalTitle, setModalTitle] = useState([]);
  const [marketId, setMarketId] = useState("");
  const [fancyBets, setFancyBets] = useState([]);
  const [fancyMarkets, setFancyMarkets] = useState([]);
  const [marketOdds, setMarketOdds] = useState([]);
  const [fancyOdds, setFancyOdds] = useState([]);
  const [marketType, setMarketType] = useState("");

  useEffect(() => {
    if (matchType && matchType === "/running-markets/bookmaker-fancy") {
      getFancyMarkets();
    }
  }, []);

  const getFancyMarkets = useCallback(() => {
    dispatch(
      getFancyMarketBets({
        filterBetAmount,
        eventId: eventId,
        callback: (data) => {
          setFancyBets(data);
        },
      })
    );
  }, [eventId, dispatch]);

  useEffect(() => {
    if (matchType && matchType === "/running-markets/bookmaker-fancy") {
      dispatch(
        getFancyMarketBets({
          filterBetAmount,
          eventId: eventId,
          callback: (data) => {
            setFancyBets(data);
          },
        })
      );
    }
  }, [triggerRefresh]);

  useEffect(() => {
    let interval;
    if (marketCodes?.length > 0) {
      if (matchType === "/running-markets/exchange") {
        api
          .post("/odds/admin-event-exch", marketCodes)
          .then((response) => {
            if (response?.data?.data?.length > 0) {
              setMarketOdds(response?.data?.data);
            }
          })
          ?.catch((error) => {
            console.log("error", error);
          });
      } else {
        api
          .get(`/odds/admin-event-fancy?id=${eventCode}`)
          .then((response) => {
            if (response?.data?.data && response?.data?.data !== null) {
              setFancyOdds(response?.data?.data);
            }
          })
          ?.catch((error) => {
            console.log("error", error);
          });
      }
    }
    if (marketCodes?.length > 0) {
      if (matchType === "/running-markets/exchange") {
        interval = setInterval(() => {
          api
            .post("/odds/admin-event-exch", marketCodes)
            .then((response) => {
              if (response?.data?.data?.length > 0) {
                setMarketOdds(response?.data?.data);
              }
            })
            ?.catch((error) => {
              console.log("error", error);
            });
        }, 5000);
      } else {
        interval = setInterval(() => {
          api
            .get(`/odds/admin-event-fancy?id=${eventCode}`)
            .then((response) => {
              if (response?.data?.data && response?.data?.data !== null) {
                setFancyOdds(response?.data?.data);
              }
            })
            ?.catch((error) => {
              console.log("error", error);
            });
        }, 5000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [marketCodes]);

  useEffect(() => {
    if (fancyData?.data != null) {
      // Update the value of arrayOfObjects inside the useEffect
      const updatedArrayOfObjects = Object?.entries(fancyData?.data)?.map(([key, value]) => {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      });
      setFancyMarkets(updatedArrayOfObjects);
    }
  }, [fancyData]);

  const handleShowModal = (marketId, marketName, type) => {
    setOpenModal(!openModal);
    setMarketId(marketId);
    setModalTitle(marketName);
    setMarketType(type);
  };

  const handleShowFancyModal = (marketId, marketName) => {
    const bets = allBets?.bets?.filter((bet) => bet?.selectionId === marketId);
    setMarketId(marketId);
    setMarketId(marketId);
    setOpenModal(!openModal);
    setModalTitle(marketName);
  };

  return (
    <Fragment>
      {eventMarkets
        ?.sort((a, b) => {
          const priorityA = eventMarketPriority[a.marketName] || 9999;
          const priorityB = eventMarketPriority[b.marketName] || 9999;

          return priorityA - priorityB || a.marketName.localeCompare(b.marketName);
        })
        ?.map((market, index) => {
          let odds;
          if (market?.type === "exchange") {
            odds = marketOdds?.find((odds) => odds?.marketId === market?.marketId);
          } else if (market?.type === "bookmaker") {
            odds = fancyOdds?.bkmr;
          } else {
            odds = fancyOdds?.fancy;
          }
          if (odds && market?.runners?.length !== 0) {
            if (
              odds?.runners?.[0]?.ex?.availableToBack?.length === 0 &&
              odds?.runners?.[0]?.ex?.availableToLay?.length === 0
            ) {
              return null;
            }

            if (
              (matchType === "/running-markets/exchange" && market?.type === "exchange") ||
              (matchType === "/running-markets/bookmaker-fancy" && market?.type === "bookmaker")
            ) {
              return (
                <Card className="mt-3" key={index}>
                  {matchType === "/running-markets/exchange" && market?.type === "exchange" ? (
                    <>
                      <CardHeader className="p-0">
                        <div className="d-flex align-items-center px-3 py-2">
                          <Col className=" market-type">{market?.marketName}</Col>
                          <Col className="d-flex justify-content-end">
                            <button
                              className="btn d-flex gap-1 align-items-center text-center bet-button"
                              onClick={() => handleShowModal(market?._id, market?.marketName, market?.bettingType)}
                            >
                              <span className="d-flex gap-1 align-items-center m-auto">
                                <span className="fs-6 text-light d-flex" style={{ fontSize: "12px" }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-file-text"
                                    style={{ height: "18px" }}
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                </span>
                                <span className="text-light">{t("BETS")}</span>
                              </span>
                            </button>
                          </Col>
                        </div>
                        {groupedBets !== undefined && (
                          <BookView
                            setBetFairBooks={setBetFairBooks}
                            betFairBooks={betFairBooks}
                            marketId={market?._id}
                            sharedBooks={sharedBooks}
                            setSharedBooks={setSharedBooks}
                            currency={currency}
                            setTotalPLByColumnResult={setTotalPLByColumnResult}
                          />
                        )}
                      </CardHeader>
                      <CardBody className="p-0 pt-2 pb-4 px-2" key={index}>
                        <MatchOddsCard
                          market={market}
                          marketId={market?._id}
                          sharedBooks={sharedBooks}
                          odds={odds}
                          currency={currency}
                          betFairBooks={betFairBooks}
                          line={market?.bettingType === "LINE" ? "LINE" : null}
                          runners={market?.runners}
                        />

                        <Row className="">
                          <p className="stake-amt text-black">
                            Min: <span>100 </span> | Max: <span>100K</span>
                          </p>
                        </Row>
                      </CardBody>
                    </>
                  ) : null}
                  {matchType === "/running-markets/bookmaker-fancy" && market?.type === "bookmaker" ? (
                    <>
                      <CardHeader className="p-0">
                        <div className="d-flex align-items-center px-3 py-2">
                          <Col className=" market-type">{market?.marketName}</Col>
                          <Col className="d-flex justify-content-end">
                            <button
                              className="btn d-flex gap-1 align-items-center text-center bet-button"
                              onClick={() => handleShowModal(market?._id, market?.marketName)}
                            >
                              <span className="d-flex gap-1 align-items-center m-auto">
                                <span className="fs-6 text-light d-flex" style={{ fontSize: "12px" }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-file-text"
                                    style={{ height: "18px" }}
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                </span>
                                <span className="text-light">{t("BETS")}</span>
                              </span>
                            </button>
                          </Col>
                        </div>
                      </CardHeader>
                      <CardBody className="p-0 pt-2 pb-4 px-2" key={index}>
                        <BookMakerCard
                          runners={market?.runners}
                          runnerBook={marketBooksData !== undefined && marketBooksData[market?._id]}
                          sharedBooks={sharedBooks}
                          odds={odds}
                        />

                        <Row className="">
                          <p className="stake-amt text-black">
                            Min: <span>100 </span> | Max: <span>100K</span>
                          </p>
                        </Row>
                      </CardBody>
                    </>
                  ) : null}
                </Card>
              );
            }
          }
        })}

      {fancyOdds?.fancy !== undefined && fancyMarkets?.length > 0 ? (
        <>
          {fancyMarkets?.map((runner, index) => {
            const eventFancy = fancyOdds?.fancy;
            let currentRunnerodd;
            let marketBooks;

            if (eventFancy && Object?.values(eventFancy)?.length !== 0) {
              currentRunnerodd = eventFancy[runner?.id];
              currentRunnerodd = currentRunnerodd && JSON.parse(currentRunnerodd);
              if (fancyBets?.hasOwnProperty(runner?.id)) {
                marketBooks = findFancyRunnerBooks(fancyBets[runner?.id]);
              }

              if (fancyOdds?.length !== 0) {
                return (
                  <Card key={index} className="pb-1 p-2">
                    <Row className="p-2">
                      <Col className=" market-type">{runner?.name}</Col>
                      <Col className="d-flex justify-content-end">
                        <button
                          className="btn px-3 d-flex gap-1 align-items-center text-center bet-button"
                          onClick={() => handleShowFancyModal(runner?.id, runner?.name)}
                        >
                          <span className="d-flex gap-1 align-items-center m-auto">
                            <span className="fs-6 text-light d-flex" style={{ fontSize: "12px" }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-file-text"
                                style={{ height: "18px" }}
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </span>
                            <span className="text-light">{t("BETS")}</span>
                          </span>
                        </button>
                      </Col>
                    </Row>
                    <hr className="my-0" style={{ borderTop: "1px solid #ccc" }} />
                    <FancyOddsCard currentRunnerodd={currentRunnerodd} marketBooks={marketBooks} />
                  </Card>
                );
              }
            }
          })}
        </>
      ) : (
        <>
          {eventMarkets?.map((market, index) => {
            if (market.type === "fancy" && fancyBets !== undefined) {
              const marketBooks = findFancyRunnerBooks(fancyBets[market?.selectionId]);
              return (
                <Card key={index} className="pb-1 p-2">
                  <Row className="p-2">
                    <Col className=" market-type">{market?.marketName}</Col>
                    <Col className="d-flex justify-content-end">
                      <button
                        className="btn px-3 d-flex gap-1 align-items-center text-center bet-button"
                        onClick={() => handleShowFancyModal(market?._id, market?.marketName)}
                      >
                        <span className="d-flex gap-1 align-items-center m-auto">
                          <span className="fs-6 text-light d-flex" style={{ fontSize: "12px" }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-file-text"
                              style={{ height: "18px" }}
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </span>
                          <span className="text-light">Bets</span>
                        </span>
                      </button>
                    </Col>
                  </Row>
                  <hr className="my-0" style={{ borderTop: "1px solid #ccc" }} />
                  <FancyOddsCard
                    // currentRunnerodd={}
                    // runner={market}
                    marketBooks={marketBooks}
                  />
                </Card>
              );
            }
          })}
        </>
      )}
      {openModal && (
        <MarketsModal
          isOpen={openModal}
          title={modalTitle}
          toggler={handleShowModal}
          size="lg"
          // modalData={marketBets}
          betIds={betIds}
          setBetIds={setBetIds}
          pagination={true}
          isMultiple={false}
          marketId={marketId}
          viewDeleted={viewDeleted}
          socketData={socketData}
          eventId={eventId}
          currency={currency}
          matchType={matchType}
          marketType={marketType}
          marketTypes={marketTypes}
          filterBetAmount={filterBetAmount}
        />
      )}
    </Fragment>
  );
};

export default memo(RunnersCard);
