import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Container, Row, Card, Col, CardHeader, CardBody, CardText, Button } from "reactstrap";
import { convertINRToCurrency } from "../../../../utils/helper";
import ViewMarketBetsModal from "../modal/ViewMarketBetsModal";
import usePageTitle from "../../../../Hooks/usePageTitle";
import BreadcrumbsWithName from "../../../../CommonElements/Breadcrumbs/BreadCrumbWithName";

function ViewMarketBetsByEvent() {
  const { t } = useTranslation();
  const title = usePageTitle();
  const location = useLocation();
  const adminData = useSelector((state) => state.Login.userData);
  const [Bets, setBets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const bets = location.state?.bets;
  const state = location.state;
  const [grandTotalPL, setGrandTotalPL] = useState(0);
  const [grandActualPL, setGrandActualPL] = useState(0);
  const [grandClientShare, setGrandClientShare] = useState(0);
  const [grandCommission, setGrandCommission] = useState(0);
  const [groupedBets, setGroupedBets] = useState([]);

  const HandleBetModal = (data) => {
    setBets(data);
    setShowModal(true);
  };
  //Grouping user bets
  useEffect(() => {
    const grouped = bets.reduce((acc, item) => {
      const userId = item.userId._id;

      const actualPl = item.pl;
      let clientShare;

      if (item?.userId?.parents?.length === 1) {
        clientShare = 0;
      } else {
        clientShare = item?.userId.parents[1]?.parent_id?.sportShares ?? 0;
      }
      if (!acc[userId]) {
        let clientname;
        if (item?.userId?.parents?.length === 1) {
          clientname = "Admin";
        } else {
          clientname = item?.userId.parents[1]?.parent_id?.username ?? 0;
        }
        acc[userId] = {
          userId: item.userId,
          username: item.userId.username,
          totalPl: 0,
          totalCommission: 0,
          totalActualPl: 0,
          individualBetsOfTheTransaction: [],
          type: item.type,
          marketId: item.marketId,
          description: item?.description,
          clientShare,
          clientname,
          clientPl: 0,
        };
      }

      const clientPl = (item?.pl / 100) * clientShare;

      acc[userId].totalPl += item.pl;
      acc[userId].totalCommission += item.commission;
      acc[userId].totalActualPl += actualPl;
      acc[userId].clientPl += clientPl;

      acc[userId].individualBetsOfTheTransaction.push(...item.individualBetsOfTheTransaction);

      return acc;
    }, {});
    console.log(Object.values(grouped), "grouped");

    setGroupedBets(Object.values(grouped));
  }, [bets]);
  //to calculate grand Total which will be displayed at the bottom of the table;
  useEffect(() => {
    let totalPL = 0;
    let totalActualPl = 0;
    let totalClientShare = 0;
    let totalCommission = 0;
    bets?.forEach((data) => {
      let clientShare;
      if (data?.userId?.parents?.length === 1) {
        clientShare = 0;
      } else {
        clientShare = data?.userId.parents[1]?.parent_id?.sportShares ?? 0;
      }
      totalPL += data?.pl ?? 0;
      totalActualPl += data?.pl - (data?.pl / 100) * (clientShare ?? 0) ?? 0;
      totalClientShare += (data?.pl / 100) * (clientShare ?? 0);
      totalCommission += data?.commission ?? 0;
    });

    setGrandTotalPL(totalPL);
    setGrandActualPL(totalActualPl);
    setGrandClientShare(totalClientShare);
    setGrandCommission(totalCommission);
  }, [bets]);

  return (
    <>
      <BreadcrumbsWithName
        marginTop="mt-5"
        mainTitle={t("Reports")}
        parent={{ name: `${title?.parent}-${title.title}`, link: `${title?.parent}/${title?.title}` }} // parent
        subParent={{ name: state?.event?.event?.name, link: `${title?.parent}/${title?.title}/${state?.params}` }} //event
        title={{ name: bets[0].type, link: bets[0].type }} //exchange
        crypto={{ payload: state }}
      />
      <Container fluid={true} className="">
        <Row className="">
          <Card className="px-0">
            <CardHeader className="py-3 d-flex align-items-center justify-content-between fs-6">
              <CardText md="16">Reports of {bets[0]?.description}</CardText>
              <Button>
                {" "}
                <span className="d-flex gap-1 align-items-center m-auto">
                  <span className="fs-6 text-dark d-flex" style={{ fontSize: "12px" }}>
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
                  <span className="text-dark">{t("Graph")}</span>
                </span>
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              <Col md="12">
                <div className="overflow-auto" style={{ height: "auto", position: "relative", zIndex: 0 }}>
                  <div className="overflow-auto">
                    <table className="table table-bordered">
                      <thead>
                        <tr className="">
                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {t("User")}
                          </th>
                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {"Total P/L"}
                          </th>
                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {"Actual P/L"}
                          </th>

                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {"Client Share"}
                          </th>

                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {"Commission"}
                          </th>
                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {t("ip")}
                          </th>

                          <th scope="col" className="text-nowrap text-uppercase text-dark">
                            {"Bets"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedBets?.length <= 0 ? (
                          <>
                            <tr className="text-center">
                              <td colSpan={7} className="py-4">
                                {t("NO_DATA_AVAILABLE")}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            {groupedBets?.map((data, index) => {
                              const actualPl = data?.totalPl - (data.clientPl ? data.clientPl : 0);
                              return (
                                <tr className={`${"table-primary"} `} key={index}>
                                  <td className="table-text  text-start">
                                    {`${data?.userId?.username}${data?.clientname ? ` (${data?.clientname})` : ""}
                                  -
                                    [${data?.userId?.currencyId?.code}]
                              `}
                                  </td>

                                  <td
                                    className={`table-text  text-start Total P/L  ${
                                      data?.totalPl > 0 ? "text-danger" : "text-success"
                                    }`}
                                  >
                                    {adminData?.currencyId?.value
                                      ? convertINRToCurrency(
                                          data?.totalPl > 0
                                            ? +(-1 * data?.totalPl.toFixed(2))
                                            : Math.abs(data?.totalPl?.toFixed(2)),
                                          parseFloat(adminData?.currencyId?.value)
                                        )
                                      : data?.totalPl > 0
                                      ? +(-1 * data?.totalPl?.toFixed(2))
                                      : Math.abs(data?.totalPl?.toFixed(2))}
                                  </td>
                                  <td
                                    className={`table-text  text-start actualPl ${
                                      actualPl > 0 ? "text-danger" : "text-success"
                                    }`}
                                  >
                                    {adminData?.currencyId?.value
                                      ? convertINRToCurrency(
                                          actualPl > 0 ? +(-1 * actualPl).toFixed(2) : Math.abs(actualPl).toFixed(2),
                                          parseFloat(adminData?.currencyId?.value)
                                        )
                                      : actualPl > 0
                                      ? +(-1 * actualPl).toFixed(2)
                                      : Math.abs(actualPl).toFixed(2)}
                                  </td>
                                  <td
                                    className={`table-text  text-start clientShare ${
                                      data?.clientPl > 0 ? "text-danger" : "text-success"
                                    }`}
                                  >
                                    {adminData?.currencyId?.value
                                      ? convertINRToCurrency(
                                          data?.clientPl > 0
                                            ? +(-1 * data?.clientPl).toFixed(2)
                                            : Math.abs(data?.clientPl).toFixed(2),
                                          parseFloat(adminData?.currencyId?.value)
                                        )
                                      : data?.clientPl > 0
                                      ? +(-1 * data?.clientPl).toFixed(2)
                                      : Math.abs(data?.clientPl).toFixed(2)}
                                  </td>

                                  <td
                                    className={`table-text  text-start commission ${
                                      data?.totalCommission > 0 ? "text-success" : ""
                                    }`}
                                  >
                                    {data?.totalCommission ? data.totalCommission : 0}
                                  </td>
                                  <td className="table-text-blue  text-start">
                                    {data?.userId?.ip_address?.system_ip
                                      ? data?.userId?.ip_address?.system_ip?.slice(0, 12)
                                      : "-"}
                                  </td>
                                  {/* <td className="table-text  text-start">
                                    {new Date(data?.createdAt)?.toLocaleString()}
                                  </td> */}
                                  <td className="table-text  text-center">
                                    <Button
                                      onClick={() => {
                                        HandleBetModal(data);
                                      }}
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
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="table-secondary">
                              <td colSpan={1} className="table-text text-start">
                                <strong>{t("GRAND_TOTAL")}</strong>
                              </td>
                              <td
                                className={`table-text  text-start betfairPL ${
                                  grandTotalPL > 0 ? "text-danger" : "text-success"
                                }`}
                              >
                                <strong>
                                  {adminData?.currencyId?.value
                                    ? convertINRToCurrency(
                                        grandTotalPL > 0
                                          ? +(-1 * grandTotalPL.toFixed(2))
                                          : Math.abs(grandTotalPL?.toFixed(2)),
                                        parseFloat(adminData?.currencyId?.value)
                                      )
                                    : grandTotalPL > 0
                                    ? +(-1 * grandTotalPL?.toFixed(2))
                                    : Math.abs(grandTotalPL?.toFixed(2))}
                                </strong>
                              </td>
                              <td
                                className={`table-text  text-start betfairPL ${
                                  grandActualPL > 0 ? "text-danger" : "text-success"
                                }`}
                              >
                                <strong>
                                  {adminData?.currencyId?.value
                                    ? convertINRToCurrency(
                                        grandActualPL > 0
                                          ? +(-1 * grandActualPL.toFixed(2))
                                          : Math.abs(grandActualPL?.toFixed(2)),
                                        parseFloat(adminData?.currencyId?.value)
                                      )
                                    : grandActualPL > 0
                                    ? +(-1 * grandActualPL?.toFixed(2))
                                    : Math.abs(grandActualPL?.toFixed(2))}
                                </strong>
                              </td>
                              <td
                                className={`table-text  text-start betfairPL ${
                                  grandClientShare > 0 ? "text-danger" : "text-success"
                                }`}
                              >
                                <strong>
                                  {adminData?.currencyId?.value
                                    ? convertINRToCurrency(
                                        grandClientShare > 0
                                          ? +(-1 * grandClientShare.toFixed(2))
                                          : Math.abs(grandClientShare?.toFixed(2)),
                                        parseFloat(adminData?.currencyId?.value)
                                      )
                                    : grandClientShare > 0
                                    ? +(-1 * grandClientShare?.toFixed(2))
                                    : Math.abs(grandClientShare?.toFixed(2))}
                                </strong>
                              </td>

                              <td className={`table-text  text-start  ${grandCommission > 0 ? "text-success" : ""}`}>
                                <strong>{grandCommission.toFixed(2)}</strong>
                              </td>
                              <td colSpan={3}></td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </CardBody>
          </Card>
        </Row>
      </Container>
      {showModal && <ViewMarketBetsModal modaldata={Bets} toggler={setShowModal} isOpen={showModal} size="xl" />}
    </>
  );
}

export default ViewMarketBetsByEvent;
