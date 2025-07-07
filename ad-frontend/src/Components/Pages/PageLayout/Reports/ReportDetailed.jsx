import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { useLocation } from "react-router";
import {
  getResultTransationDetail,
  getUserBetsEvent,
  getCasinoBetsByDate,
} from "../../../../redux/action";
import { Badges, Breadcrumbs } from "../../../../AbstractElements";
import BetsModal from "../modal/BetsModal";
import Loader from "../../../../Layout/Loader";
import usePageTitle from "../../../../Hooks/usePageTitle";
import ProfitLossModal from "../modal/ProfitLossModal";
import ProfitLossCasinoModal from "../modal/ProfitLossCasinoModal";
import { currencyConversion } from "../../../../utils/helper";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import { Link } from "react-router-dom";
import "./style.css";

const ReportDetailed = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const location = useLocation();
  const currencyValue = useSelector(
    (state) => state?.globalCurrencyValueReducer?.globalCurrencyValue
  );
  const [transactionData, setTransactionData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [casinoModalOpen, setCasinoModalOpen] = useState(false);
  const [totalPl, setTotalPl] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState({});
  const [layerPaths, setLayerPaths] = useState([]);
  const [firstLayerRole, setFirstLayerRole] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    let casino = location?.state?.desc?.split("_")[0];
    setLoading(true);

    if (casino === "Casino") {
      let data = {
        description: location?.state?.desc,
        createdAt: location?.state?.date,
        roundId: location?.state?.roundId,
        casino_type: location?.state?.casino_type,
      };
      if (location?.state?.resultTransaction) {
        data = {
          ...data,
          userId: undefined,
        };
      } else {
        data = {
          ...data,
          userId: location?.state?.userId,
        };
      }

      dispatch(
        getCasinoBetsByDate({
          data,
          callback: (data) => {
            if (location?.state?.resultTransaction) {
              setFirstLayerRole(data?.[0].username)
            }
            setTransactionData(data);
            const total_PL = data?.reduce((total, data) => {
              return total + parseFloat(data.pl);
            }, 0);
            setTotalPl(total_PL);
            setLoading(false);
          },
        })
      );
    } else {
      let data = {};
      if (location?.state?.resultTransaction) {
        data = {
          marketId: location?.state?.marketId,
          userId: undefined,
        };
      } else {
        data = {
          marketId: location?.state?.marketId,
          userId: location?.state?.userId,
          role: location?.state?.role,
        };
      }

      dispatch(
        getResultTransationDetail({
          data,
          callback: (data) => {
            setTransactionData(data?.data);
            // Calculate total P/L
            const total_PL = data?.data.reduce((total, data) => {
              return total + parseFloat(data.pl);
            }, 0);
            setTotalPl(total_PL);
            //ITERATING FOR FINDING PARENT
            data?.data?.forEach((element) => {
              if (element.parent) {
                setParent(element.parent);
              }
            });
            setLoading(false);
          },
        })
      );
    }
  }, []);

  useEffect(() => {
    // Find the index of the selected username
    let layer_index = layerPaths?.findIndex(eliminate => eliminate?.username === selectedUsername);
    // Create a new array that includes elements before the found index
    let newLayerPaths = layerPaths.filter((eliminate, index) => index < layer_index + 1);
    // Remove only one element at that index
    if (layer_index !== -1) {
      setLayerPaths(newLayerPaths);
    }
  }, [selectedUsername])

  const handleChildClick = (userId, role, data) => {
    handleChildOnClick(data);
    setLoading(true);
    let casino = location?.state?.desc?.split("_")[0];
    if (casino === "Casino") {
      let data = {
        description: location?.state?.desc,
        createdAt: location?.state?.date,
        roundId: location?.state?.roundId,
        casino_type: location?.state?.casino_type,
        userId,
        role,
      };

      dispatch(
        getCasinoBetsByDate({
          data,
          callback: (data) => {
            setTransactionData(data);
            setTotalPl(data[0]?.pl);
            setLoading(false);
          },
        })
      );
    } else {
      const data = {
        marketId: location?.state?.marketId,
        userId,
        role,
      };
      dispatch(
        getResultTransationDetail({
          data,
          callback: (data) => {
            setTransactionData(data?.data);
            // Calculate total P/L
            const total_PL = data?.data.reduce((total, data) => {
              return total + parseFloat(data.pl);
            }, 0);
            setTotalPl(total_PL);
            setLoading(false);
          },
        })
      );
    }
  };

  const handleShowBets = (userId, username, parent, data) => {

    let casino = location?.state?.desc?.split("_")[0];
    if (casino === "Casino") {
      // let bet = transactionData?.filter(user => user?.username === username);
      setModalData({
        username,
        parent,
        userId: userId,
        desc: location?.state?.desc,
        casino_type: data?.casinoType
      });
      setCasinoModalOpen(true);
    } else {
      const data = { marketId: location?.state?.marketId, userId };
      dispatch(
        getUserBetsEvent({
          data,
          callback: (data) => {
            setModalData({ bets: data, username, parent });
            setModalOpen(true);
          },
        })
      );
    }
  };
  const pdfGenerator = () => {
    const doc = new jsPDF();
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(8);
    doc.text(
      decodeURIComponent(title?.title)
        .replace(/\+/g, " ")
        .replace(/>/g, "-")
        .toUpperCase(),
      doc.internal.pageSize.width / 2,
      10,
      null,
      null,
      "center"
    );
    const body = transactionData?.map((row) => [row.username, row.pl]);
    body.push(['Total', location?.state?.myReports
      ? -1 * parseFloat(totalPl).toFixed(2)
      : parseFloat(totalPl).toFixed(2)])
    doc.autoTable({
      head: [["Username", "Profit and Loss"]],
      body: body,
      didDrawCell: function (data) {
        const cell = data.cell;
        const row = data.row.index;
        if (row % 2 === 0) {
          cell.styles.fillColor = "#f2f2f2";
        } else {
          cell.styles.fillColor = "#ffffff";
        }
        if (row === 0) {
          cell.styles.textColor = [255, 255, 255];
        }
        cell.styles.lineWidth = 0.1;
        cell.styles.lineColor = [0, 0, 0];
      },
    });

    doc.save(decodeURIComponent(title?.title).replace(/\+/g, " "));
  };
  const excelGenerator = () => {
    const data = transactionData?.map((row) => {
      return {
        username: row?.username !== undefined ? row.username : null,
        profitloss: row?.pl !== undefined ? row.pl : null,
      };
    });
    const totalPL = location?.state?.myReports
      ? -1 * parseFloat(totalPl).toFixed(2)
      : parseFloat(totalPl).toFixed(2);

    data.push({ totalPL });
    if (data && data?.length > 0) {
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, decodeURIComponent(title?.title).replace(/\+/g) + '.xlsx');
    }
  };

  const handlePreviousComponent = (userId, role, username) => {
    let casino = location?.state?.desc?.split("_")[0];
    if (casino === "Casino") {
      setSelectedUsername(username);
      let data = {
        description: location?.state?.desc,
        createdAt: location?.state?.date,
        roundId: location?.state?.roundId,
        casino_type: location?.state?.casino_type,
        userId,
        role,
      };

      dispatch(
        getCasinoBetsByDate({
          data,
          callback: (data) => {
            setTransactionData(data);
            setTotalPl(data[0]?.pl);
            setLoading(false);
          },
        })
      );
    } else {
      dispatch(
        getResultTransationDetail({
          data: { marketId: location?.state?.marketId },
          callback: (data) => {
            setLoading(false);
            setTransactionData(data?.data);
            setLayerPaths([])
            return
          },
        })
      );
    }

  };

  const Badges = ({ attrBadge, children }) => (
    <div className={attrBadge.color}>{children}</div>
  );

  const Row = ({ children, className }) => (
    <div className={className}>{children}</div>
  );

  const Col = ({ children, className }) => (
    <div className={className}>{children}</div>
  );

  const handleChildOnClick = (data) => {
    if (layerPaths?.length === 0) {
      const newUser = {
        userId: data?.userId,
        role: data?.role,
        username: data?.username,
      };
      setLayerPaths([...layerPaths, newUser]);
    } else {
      if (!layerPaths.some((user) => user.userId === data.userId)) {
        const newUser = {
          userId: data?.userId,
          role: data?.role,
          username: data?.username,
        };
        setLayerPaths([...layerPaths, newUser]);
      }
    }
  };

  const handleLayerView = (userId, role, username) => {
    return handlePreviousComponent(userId, role, username);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("REPORTS")}
        title={decodeURIComponent(title?.title)
          .replace(/\+/g, " ")
          ?.slice(0, 25)}
        parent={title?.parent}
        route={false}
      />

      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Card>
          <CardHeader>
            <div className="d-flex align-items-center">
              {/* {parent.role !== undefined && parent.role !== null && (
                  <button onClick={()=>handlePreviousComponent(parent)} className="buttonback">
                    <div className="button-box">
                      <span className="button-elem">
                        <svg
                          viewBox="0 0 46 40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                        </svg>
                      </span>
                      <span className="button-elem">
                        <svg viewBox="0 0 46 40">
                          <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                        </svg>
                      </span>
                    </div>
                  </button>
                )} */}

              <h6 className="m-2 p-0 text-center">
                {decodeURIComponent(title?.title).replace(/\+/g, " ")}
              </h6>
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx relative"
                onClick={pdfGenerator}
              >
                PDF
              </button>
              <button
                className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                onClick={excelGenerator}
              >
                Excel
              </button>
            </div>
            <Row className="p-2">
              <Col className="d-flex gap-1">
                <Link to="/reports">
                  <span className="text-primary pointer path-text">
                    Reports
                  </span>
                </Link>
                {layerPaths?.length !== 0 &&
                  layerPaths?.map((path, index) => {
                    return (
                      <span
                        key={index}
                        className="d-flex align-items-center gap-1 text-dark pointer"
                        onClick={() => handleLayerView(path.userId, path.role, path.username)}
                      >
                        <span className="path-text">{` > `}</span>
                        <span className="ml-1">
                          <Badges
                            attrBadge={{
                              color: `badge ${"badge-custom"}`,
                            }}
                          ></Badges>
                        </span>
                        <span className="path-text text-primary">{` ${path?.username}`}</span>
                      </span>
                    );
                  })}
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-auto" style={{ height: "66vh" }}>
              <table className="table table-bordered table-responsive">
                <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                  <tr className="" style={{ border: "none " }}>
                    <th className="w-25">{t("USERNAME")}</th>
                    <th>{t("P/L")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData?.map((data, index) => {
                    return (
                      <tr className="" key={index}>
                        <td>
                          {data?.user ? (
                            <span
                              className="userSpan"
                              onClick={() =>
                                handleShowBets(
                                  data?.userId,
                                  data?.username,
                                  data?.parent?.username,
                                  data
                                )
                              }
                            >
                              {`${data?.username} (${data?.parent?.username})`}
                            </span>
                          ) : (
                            <span
                              className="userName"
                              onClick={() => {
                                handleChildClick(
                                  data?.userId,
                                  data?.role,
                                  data
                                );
                              }}
                            >
                              {`${data?.username}  (${data?.parent?.username})`}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span>
                              {/* {location?.state?.casino_type === "g_Casino" ? parseFloat(data?.pl).toFixed(2) : location?.state?.myReports
                                ? -1 * parseFloat(data?.pl).toFixed(2)
                                : parseFloat(data?.pl).toFixed(2)} */}
                              {location?.state?.myReports
                                ? -1 * parseFloat(data?.pl).toFixed(2)
                                : parseFloat(data?.pl).toFixed(2)}
                            </span>
                            <span>
                              {/* {currencyConversion(
                                currencyValue,
                                Number(data?.currencyData?.value),
                                data?.pl
                              )} */}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>Total P/L</td>
                    <td>
                      {/* {location?.state?.casino_type === "g_Casino" ? parseFloat(totalPl).toFixed(2) : location?.state?.myReports
                        ? -1 * parseFloat(totalPl).toFixed(2)
                        : parseFloat(totalPl).toFixed(2)} */}
                      {location?.state?.myReports
                        ? -1 * parseFloat(totalPl).toFixed(2)
                        : parseFloat(totalPl).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {loading === false && transactionData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Container>
      {modalOpen && (
        <ProfitLossModal
          isOpen={modalOpen}
          title={"Bets Of"}
          toggler={setModalOpen}
          modalData={modalData}
          deposit={true}
          commission={true}
          size="xl"
        />
      )}
      {casinoModalOpen && (
        <ProfitLossCasinoModal
          isOpen={casinoModalOpen}
          title={"Bets Of"}
          toggler={setCasinoModalOpen}
          modalData={modalData}
          deposit={true}
          size="xl"
        />
      )}
    </Fragment>
  );
};

export default ReportDetailed;
