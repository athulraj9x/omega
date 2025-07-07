import React from "react";
import { Card, Container } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAllBets } from "../../../../redux/action";
import { useSelector } from "react-redux";
import { useState } from "react";

import Loader from "../../../../Layout/Loader";
import { socket } from "../../../../context/socketContext";
import ErrorBets from "./ErrorBets";
import { formatDate } from "../../../../utils/helper";

const RunningMarkets = () => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.GetAllBets?.loading);
  const [betDatas, setBetDatas] = useState([]);
  const [myMarketData, setMyMarketData] = useState([]);
  const [socketData, setSocketData] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    const handleNewBet = (data) => {
      setSocketData(data);
    };
  
    socket.on("new-bet", handleNewBet);
  
    return () => {
      socket.off("new-bet", handleNewBet);
    };
  }, [socket]);
  

  useEffect(() => {
    let type;
    if (pathname === "/running-markets/exchange") {
      type = "exchange";
    }
    if (pathname === "/running-markets/bookmaker-fancy") {
      type = "";
    }
    dispatch(
      getAllBets({
        type,
        callback: (data) => {
          setBetDatas(data);
        },
      })
    );
  }, [dispatch, socketData, pathname]);

  useEffect(() => {
    
    if (pathname === "/running-markets/exchange") {
      setMyMarketData(
        betDatas?.filter((data) => data?.marketType?.exchange > 0)
      );
    }
    if (pathname === "/running-markets/bookmaker-fancy") {
      setMyMarketData(
        betDatas?.filter(
          (data) =>
            data?.marketType?.bookmaker > 0 || data?.marketType?.fancy > 0
        )
      );
    }
  }, [pathname, betDatas]);
  if (pathname === "/running-markets/error-bets") {
    return(
      <ErrorBets />
    )
  } else
    return (
      <Fragment>
        <Breadcrumbs
          mainTitle={t("MY_MARKET")}
          title={title?.title}
          parent={title?.parent}
        />
        <Container fluid={true}>
          {/* {loading && (
            <div className="d-flex justify-content-center align-items-center">
              <Loader />
            </div>
          )} */}
          <Card className="p-0">
            <div
              className="overflow-auto"
              style={{ height: "62vh", position: "relative" }}
            >
              <table responsive className="table table-bordered table-hover ">
                <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                  <tr className="text-left" style={{ border: "none " }}>
                    <th>{t("DATE")}</th>
                    <th>{t("SPORT")}</th>
                    <th>{t("LEAGUE")}</th>
                    <th>{t("EVENT")}</th>
                    <th>{t("BETS")}</th>
                  </tr>
                </thead>
                <tbody>
                  {myMarketData?.map((item, index) => {
                    const encodedDynamicPart = encodeURIComponent(
                      item?.event?.name?.replace(/\s+/g, "-")
                    );
                    return (
                      <tr className="text-left" key={index}>
                        <td>{formatDate(item?.event?.date)}</td>
                        <td>{item?.sport?.name}</td>
                        <td>{item?.league?.name}</td>
                        <td>
                          <Link
                            to={`/running-markets/${encodedDynamicPart}`}
                            state={{
                              eventName: item?.event?.name,
                              eventId: item?.event?._id,
                              sportId: item?.sport?._id,
                              sportCode: item?.sport?.sportsCode,
                              leagueId: item?.league?._id,
                              eventDate: item?.event?.date,
                              eventCode: item?.event?.id,
                              venueId: item?.venueId?._id,
                              raderId: item?.event?.raderId,
                              path: pathname,
                            }}
                          >
                            {item?.event?.name}
                          </Link>
                        </td>
                        {pathname === "/running-markets/exchange" ? (
                          <td>{item?.marketType?.exchange}</td>
                        ) : (
                          <td>
                            {parseInt(
                              item?.marketType?.bookmaker
                                ? item?.marketType?.bookmaker
                                : 0
                            ) +
                              parseInt(
                                item?.marketType?.fancy
                                  ? item?.marketType?.fancy
                                  : 0
                              )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loading === false && myMarketData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </Card>
        </Container>
      </Fragment>
    );
};

export default RunningMarkets;
