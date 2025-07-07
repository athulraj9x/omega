import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getEventBasedBets } from "../../../../redux/action";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import Loader from "../../../../Layout/Loader";
import { useTranslation } from "react-i18next";
import { generateLink } from "../../../../utils/helper";
import BreadcrumbsWithName from "../../../../CommonElements/Breadcrumbs/BreadCrumbWithName";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useSelector } from "react-redux";

const EventView = () => {
  const title = usePageTitle();
  const location = useLocation();

  const eventid = location?.state?.eventIdLink;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [actualPl, setActualPl] = useState(0);
  const [totalBetfairPl, setTotalBetfairPl] = useState(0);
  const [clientShares, setClientShares] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [currentType, setCurrentType] = useState("ALL");
  const [filteredResultData, setFilteredResultData] = useState([]);
  const [lastDate, setLastDate] = useState(1);
  const [data, setData] = useState([]);

  const params = new URLSearchParams(location.search);
  const currentPage = params.get("currentPage");

  const handleFilter = () => {
    navigate(`/reports/analysis?currentPage=${encodeURIComponent(currentPage)}`);
  };

  //  EVENT IS A OBJECT THAT CONTAIN MARKETS RESULTS
  const handleDetailViewOfBets = (event) => {
    const eventName = event?.event?.name.trim().replace(/\s+/g, "");
    navigate(`/reports/analysis/${eventName}/${event?.type}`, {
      state: {
        ...location.state,
        bets: event.markets, // Send the bets as part of the state,
        event: event,
        params: eventid,
      },
    });
  };

  useEffect(() => {
    if (eventid && eventid !== null) {
      setLoading(true);
      generateLink(eventid)
        .then((eventId) => {
          dispatch(
            getEventBasedBets({
              data: {
                eventId,
                lastDate,
              },
              callback: (data) => {
                setData(data);
                try {
                  const transformedData = Object.keys(data).map((key) => ({
                    type: data[key].type,
                    description: data[key].description,
                    totalPL: data[key].totalPl,
                    actualPl: data[key].actualPl,
                    clientShares: data[key].clientShares,
                    league: data[key].league,
                    sports: data[key].sports,
                    event: data[key].event,
                    _id: data[key].marketId,
                    markets: data[key].markets,
                    commission: data[key].commission,
                  }));

                  const totalSum = transformedData?.reduce((acc, curr) => acc + curr.totalPL, 0);
                  const actualPl = transformedData?.reduce((acc, curr) => acc + curr.actualPl, 0);
                  const client_shares = transformedData?.reduce((acc, curr) => acc + curr.clientShares, 0);
                  const total_commission = transformedData?.reduce((acc, curr) => acc + curr.commission, 0);
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                  setClientShares(client_shares);
                  setTotalRevenue(totalSum);
                  setActualPl(actualPl);
                  setTotalCommission(total_commission);
                  setFilteredResultData(transformedData);
                  setCurrentType("EVENT-VIEW");
                } catch (error) {
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                  console.error("Error in callback transformation:", error);
                }
              },
            })
          );
        })
        .catch((err) => console.error("Decryption error:", err));
    }
  }, [eventid]);

  return (
    <>
      <BreadcrumbsWithName
        mainTitle={t("Reports")}
        parent={{ name: `${title?.parent}-${title.title}`, link: `${title?.parent}/${title?.title}` }} //Report Analysis
        title={{ name: data[0]?.event?.name, link: title?.title }} // MatchName
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
                        {currentType === "ALL" && <th>{t("DATE")}</th>}

                        <th>{t(currentType === "ALL" ? "EVENTS" : "MARKETS")}</th>
                        {currentType === "EVENT-VIEW" && <th>{t("PATH")}</th>}
                        {currentType === "EVENT-VIEW" && <th>{t("VIEW BETS")}</th>}

                        <th>{t("TOTAL PL")}</th>
                        <th>{t("Actual PL")}</th>
                        <th>{t("CLIENT SHARES")}</th>
                        <th>{"COMMISSION"}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentType === "EVENT-VIEW" &&
                        filteredResultData !== null &&
                        filteredResultData?.map((element, index) => {
                          // const actualplAfterCommission = element?.actualPl - element?.commission ?? 0;
                          return (
                            <tr className="text-left" key={index}>
                              <td style={{ maxWidth: "40px" }}>{index + 1}</td>
                              <td>{element?.type?.toUpperCase()}</td>
                              <td className="text-primary" style={{ cursor: "pointer" }}>
                                <span onClick={() => handleFilter(lastDate)}>
                                  {element?.sports?.name} {">"}
                                </span>
                              </td>

                              <td
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDetailViewOfBets(element)}
                              >{`${element?.sports?.name} > ${element?.league?.name} > ${
                                element?.event?.name
                              }  > ${element?.type?.toUpperCase()}`}</td>
                              <td className={`${element?.totalPL > 0 ? "text-danger" : "text-success"}`}>
                                {element?.totalPL > 0
                                  ? +(-1 * element?.totalPL?.toFixed(2))
                                  : Math.abs(element?.totalPL?.toFixed(2))}
                              </td>
                              <td className={`${element?.actualPl > 0 ? "text-danger" : "text-success"}`}>
                                {element?.actualPl > 0
                                  ? +(-1 * element?.actualPl?.toFixed(2))
                                  : Math.abs(element?.actualPl?.toFixed(2))}
                              </td>

                              <td className={`${element?.clientShares > 0 ? "text-danger" : "text-success"}`}>
                                {element?.clientShares > 0
                                  ? +(-1 * element?.clientShares?.toFixed(2))
                                  : Math.abs(element?.clientShares?.toFixed(2))}
                              </td>
                              <td className={`${element?.commission > 0 ? "text-success" : "text-warning"}`}>
                                {element?.commission?.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}

                      {currentType === "EVENT-VIEW" &&
                        filteredResultData !== null &&
                        filteredResultData?.length > 0 && (
                          <>
                            <th>Total PL</th>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td className="border">
                              <h6
                                className={`
                                  ${totalRevenue > 0 ? "text-danger" : "text-success"}
                                     fw-bolder m-0 p-0`}
                              >
                                {totalRevenue > 0
                                  ? +(-1 * totalRevenue?.toFixed(2))
                                  : Math.abs(totalRevenue?.toFixed(2))}
                              </h6>
                            </td>
                            <td className="border">
                              <h6 className={`${actualPl < 0 ? "text-success" : "text-danger"} fw-bolder m-0 p-0`}>
                                {actualPl > 0 ? +(-1 * actualPl?.toFixed(2)) : Math.abs(actualPl?.toFixed(2))}
                              </h6>
                            </td>

                            <td className={"border"}>
                              <h6 className={`m-0 p-0 fw-bolder ${clientShares < 0 ? "text-success" : "text-danger"}`}>
                                {clientShares > 0
                                  ? +(-1 * clientShares?.toFixed(2))
                                  : Math.abs(clientShares?.toFixed(2))}
                              </h6>
                            </td>
                            <td className={"border"}>
                              <h6
                                className={`m-0 p-0 fw-bolder ${totalCommission > 0 ? "text-success" : "text-warning"}`}
                              >
                                {totalCommission?.toFixed(2)}
                              </h6>
                            </td>
                          </>
                        )}
                    </tbody>
                  </table>
                  {loading === false && (filteredResultData?.length === 0 || filteredResultData === null) && (
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

export default EventView;
