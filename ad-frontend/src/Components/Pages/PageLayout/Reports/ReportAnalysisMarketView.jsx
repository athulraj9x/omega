import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import Loader from "../../../../Layout/Loader";
import { useTranslation } from "react-i18next";
import BreadcrumbsWithName from "../../../../CommonElements/Breadcrumbs/BreadCrumbWithName";
import usePageTitle from "../../../../Hooks/usePageTitle";

const ReportAnalysisMarketView = () => {
  const title = usePageTitle();
  const location = useLocation();
  const eventid = location?.state?.eventIdLink;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const state = location.state;
  const [loading, setLoading] = useState(false);
  const [filteredResultData, setFilteredResultData] = useState([]);

  const [lastDate, setLastDate] = useState(1);
  const [data, setData] = useState([]);

  const params = new URLSearchParams(location.search);
  const currentPage = params.get("currentPage");

  const handleFilter = () => {
    navigate(`/reports/analysis/${state?.encodedEventLink}?currentPage=${""}`, {
      state: {
        eventid: state?.eventid,
        eventIdLink: state?.params,
        encodedEventLink: state?.encodedEventLink,
      },
    });
  };

  //  EVENT IS A OBJECT THAT CONTAIN MARKETS RESULTS
  const handleDetailViewOfBets = (event) => {
    const eventName = state.event?.event?.name.trim().replace(/\s+/g, "");
    // const marketName = event.name.split(">").pop().replace(/\s+/g, "");
    const marketName = event.name
      .split(">")
      .pop()
      .replace(/[\/\s]+/g, "-")
      .toLowerCase();
    const marketBets = state.bets?.filter((bet) => bet.marketId === event.marketId);

    ///reports/analysis/:eventid/:market/details
    navigate(`/reports/analysis/${eventName}/${event?.type}/${marketName}`, {
      state: {
        ...location.state,
        bets: marketBets, // Send the bets as part of the state,
        // event: event,
        // params: eventid,
      },
    });
  };

  useEffect(() => {
    const marketData = state.event?.markets;

    // if (state && marketData?.lenght) {

    let grouped = {};
    for (const item of marketData) {
      const key = item.marketId;
      if (!grouped[key]) {
        grouped[key] = {
          totalCommission: 0,
          userBets: [],
          totalPl: 0,
          actualPl: 0,
          clientPL: 0,
          name: item.description,
          marketId: item.marketId,
          type: item.type,
          clientShares: item.clientShares || 0,
        };
      }

      const betData = { userData: item.userId, bets: item.individualBetsOfTheTransaction };
      grouped[key].totalPl += item.pl || 0;
      grouped[key].totalCommission += item.commission || 0;
      let clientShare = 0;
      if (item?.userId?.parents.length > 1) {
        clientShare = item?.userId?.parents[1]?.parent_id?.sportShares;
      } else {
        clientShare = 0;
      }
      grouped[key].actualPl += item.pl - (item.pl / 100) * clientShare;
      grouped[key].clientPL += (item.pl / 100) * clientShare;
      grouped[key].userBets.push(betData);
    }
    // return Object.values(grouped);
    setData(Object.values(grouped));
    // }
  }, [state]);

  return (
    <>
      <BreadcrumbsWithName
        mainTitle={t("Reports")}
        parent={{ name: `${title?.parent}-${title.title}`, link: `${title?.parent}/${title?.title}` }} //Report Analysis
        subParent={{
          name: `${state?.event?.event?.name}`,
          link: `${title.parent?.toLowerCase()}/${title.title?.toLowerCase()}`,
        }} // MatchName
        title={{ name: `${state?.event?.type}`, link: title?.title }} // MatchName
      />
      <Container fluid={true}>
        <Row className="px-3 mt-5">
          <Card className="px-0">
            <CardBody className="p-0">
              {loading && (
                <div className="d-flex justify-content-center align-items-center">
                  <Loader />
                </div>
              )}

              <Col md="12">
                <div className="overflow-auto" style={{ height: "auto", position: "relative", zIndex: 0 }}>
                  <table responsive className="table table-bordered table-hover ">
                    <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                      <tr className="text-left" style={{ border: "none " }}>
                        <th style={{ maxWidth: "40px" }}>{t("SL")}</th>
                        <th>{t("MARKETS")}</th>
                        <th>{t("PATH")}</th>
                        <th>{t("VIEW BETS")}</th>
                        <th>{t("TOTAL PL")}</th>
                        <th>{t("Actual PL")}</th>
                        <th>{t("CLIENT SHARES")}</th>
                        <th>{"COMMISSION"}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.length && (
                        <>
                          {data?.map((element, index) => {
                            return (
                              <tr className="text-left" key={index}>
                                <td style={{ maxWidth: "40px" }}>{index + 1}</td>
                                <td>{element?.type?.toUpperCase()}</td>
                                <td className="text-primary" style={{ cursor: "pointer" }}>
                                  <span onClick={() => handleFilter(lastDate)}>
                                    {element?.name?.split("> ").slice(0, -1).join("> ")}
                                  </span>
                                </td>

                                <td
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDetailViewOfBets(element)}
                                >{`${element?.name} `}</td>

                                <td className={`${element?.totalPl > 0 ? "text-danger" : "text-success"}`}>
                                  {element?.totalPl > 0
                                    ? +(-1 * element?.totalPl?.toFixed(2))
                                    : Math.abs(element?.totalPl?.toFixed(2))}
                                </td>
                                <td className={`${element?.actualPl > 0 ? "text-danger" : "text-success"}`}>
                                  {element?.actualPl > 0
                                    ? +(-1 * element?.actualPl?.toFixed(2))
                                    : Math.abs(element?.actualPl?.toFixed(2))}
                                </td>

                                <td className={`${element?.clientPL > 0 ? "text-danger" : "text-success"}`}>
                                  {element?.clientPL > 0
                                    ? +(-1 * element?.clientPL?.toFixed(2))
                                    : Math.abs(element?.clientPL?.toFixed(2))}
                                </td>
                                <td className={`${element?.totalCommission > 0 ? "text-success" : ""}`}>
                                  {element?.totalCommission?.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                          <th>Total PL</th>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td>&nbsp;</td>
                          <td className="border">
                            <h6
                              className={`
                                  ${state?.event?.totalPL > 0 ? "text-danger" : "text-success"}
                                     fw-bolder m-0 p-0`}
                            >
                              {state?.event?.totalPL > 0
                                ? +(-1 * state?.event?.totalPL?.toFixed(2))
                                : Math.abs(state?.event?.totalPL?.toFixed(2))}
                            </h6>
                          </td>
                          <td className="border">
                            <h6
                              className={`${
                                state?.event?.actualPl < 0 ? "text-success" : "text-danger"
                              } fw-bolder m-0 p-0`}
                            >
                              {state?.event?.actualPl > 0
                                ? +(-1 * state?.event?.actualPl?.toFixed(2))
                                : Math.abs(state?.event?.actualPl?.toFixed(2))}
                            </h6>
                          </td>

                          <td className={"border"}>
                            <h6
                              className={`m-0 p-0 fw-bolder ${
                                state?.event?.clientShares < 0 ? "text-success" : "text-danger"
                              }`}
                            >
                              {state?.event?.clientShares > 0
                                ? +(-1 * state?.event?.clientShares?.toFixed(2))
                                : Math.abs(state?.event?.clientShares?.toFixed(2))}
                            </h6>
                          </td>
                          <td className={"border"}>
                            <h6 className={`m-0 p-0 fw-bolder ${state?.event?.commission > 0 ? "text-success" : ""}`}>
                              {state?.event?.commission?.toFixed(2)}
                            </h6>
                          </td>
                        </>
                      )}
                    </tbody>
                  </table>
                  {loading === false && (data?.length === 0 || data === null) && (
                    <div className="d-flex justify-content-center">
                      <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                    </div>
                  )}
                </div>
              </Col>
              {!loading && filteredResultData?.length > 0 && (
                <Row className="px-3">
                  <Col md="12"></Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Row>
      </Container>
    </>
  );
};

export default ReportAnalysisMarketView;
