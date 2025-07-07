import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row, CardFooter, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getReportTransation, getUserBetsEvent, authDetail, getLayerCurrency } from "../../../../redux/action";
import Loader from "../../../../Layout/Loader";
import { PAGINATION, layerRoles, ManagerRoles } from "../../../../Constant";
import { AiOutlineSearch } from "react-icons/ai";
import { convertINRToCurrency, getLocalStorageItem, notifyWarning } from "../../../../utils/helper";
import ProfitLossCasinoModal from "../modal//ProfitLossCasinoModal";
import ProfitLossModal from "../modal/ProfitLossModal";
import { IoArrowBack } from "react-icons/io5";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Report = () => {
  const { mobile_no } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let location = useLocation();
  const navigate = useNavigate();
  // const resultTransationData = useSelector(
  //   (state) => state.GetReportsTransaction.reportTransactionData
  // );

  const loadingTemp = useSelector((state) => state.GetReportsTransaction.loading);
  const [loading, setLoading] = useState(loadingTemp);
  const adminDataTemp = useSelector((state) => state.Login.userData);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [resultTransaction, setResultTransaction] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedFilterPoint, setSelectedFilterPoint] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [casinoModalOpen, setCasinoModalOpen] = useState(false);
  const [betsModal, setBetsModal] = useState(false);
  const [marketBets, setMarketBets] = useState([]);
  const [adminData, setAdminData] = useState(adminDataTemp);
  const [resultTransationData, setResultTransationData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(location?.state?.role === layerRoles.USER ? "all" : "wallet");
  const [currency, setCurreny] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("inr");

  // const [isCommissionToggle, setIsCommissionToggle] = useState(adminData?.isCommission ? adminData?.isLayerCommission:false);
  const currentCommissionStatus = useSelector(
    (state) => state?.CurrentCommissionStatus?.currentCommissionStatus?.isCommission
  );

  const [commissionIsDisabled, setCommissionIsDisabled] = useState(false);
  // const [commissionVisibility, setCommissionVisibility] = useState(
  //   adminData.isCommission && adminData.isLayerCommission ? true : false
  // );
  //commission deduction rollbacks
  const [commissionVisibility, setCommissionVisibility] = useState(true);
  const [commissionToggleStyle, setCommissionToggleStyle] = useState(null);
  const [filteredTransaction, setfilteredTransaction] = useState([]);

  // const globalState = useSelector((state) => state);

  //filterrr
  useEffect(() => {
    if (adminData.role === layerRoles.DIRECTOR) {
      setCommissionToggleStyle(currentCommissionStatus);
      setCommissionVisibility(currentCommissionStatus);

      dispatch(
        authDetail({
          callback: (data) => {
            setAdminData(data);
            if (data.isCommission == false) {
              setCommissionIsDisabled(true);
              commissionVisibility(true);
              setLoading(false);
              return;
            } else if (data && data?.isCommission && data?.isLayerCommission) {
              setCommissionVisibility(true);
              setCommissionIsDisabled(false);
              setLoading(false);
            }
          },
        })
      );
    }
  }, [currentCommissionStatus, commissionToggleStyle]);

  const handleFilterChange = (event) => {
    if (event.target.value === "commission") {
      return;
    }
    setSelectedFilterPoint("");
    setResultTransaction(
      resultTransationData?.map((element) => {
        return {
          ...element,
          cr: element?.cr === null ? "null" : element?.cr?.toString(),
          dr: element?.dr === null ? "null" : element?.dr?.toString(),
          balance: element?.balance?.toString(),
        };
      })
    );
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    // const filteredTransactionData = resultTransaction?.filter((transaction) => {
    //   if (selectedFilter === "commission") {
    //     if (isChecked) {
    //       if (
    //         startDate <= new Date(transaction?.date) &&
    //         endDate >= new Date(transaction?.date)
    //       ) {
    //         return (
    //           transaction?.cr !== "null" &&
    //           parseFloat(transaction?.cr) > 0 &&
    //           transaction?.type === "market"
    //         );
    //       }
    //     } else {
    //       return (
    //         transaction?.cr !== "null" &&
    //         parseFloat(transaction?.cr) > 0 &&
    //         transaction?.type === "market"
    //       );
    //     }
    //   }
    //   if (selectedFilter !== "all") {
    //     return transaction?.type === selectedFilter;
    //   } else {
    //     if (transaction?.type === "wallet") {
    //       if (transaction?.description?.startsWith("SETTLEMENT |")) {
    //         transaction.type = "settlement";
    //         return transaction;
    //       } else {
    //         return transaction;
    //       }
    //     } else if (transaction?.type === "market") {
    //       return transaction;
    //     }
    //   }
    // });

    setfilteredTransaction(resultTransaction);
  }, [selectedFilter, resultTransaction]);

  //getcurrencyLayer

  useEffect(() => {
    dispatch(
      getLayerCurrency({
        layerId: location?.state?.id,
        callback: (data) => {
          setCurreny(data?.currencyId);
        },
      })
    );
  }, []);

  //Getting user datas
  useEffect(() => {
    if (!isChecked) {
      dispatch(
        getReportTransation({
          role: location?.state?.role,
          layer_id: location?.state?.id,
          type: selectedFilter,
          manager: location?.state?.manager,
          commission: commissionVisibility,
          isChecked: isChecked,
          callback: (data) => {
            setTotalDataCount(data?.meta?.count);
            setResultTransationData(data);
          },
        })
      );
    } else {
      dispatch(
        getReportTransation({
          role: location?.state?.role,
          layer_id: location?.state?.id,
          type: selectedFilter,
          startDate: startDate,
          endDate: endDate,
          manager: location?.state?.manager,
          commission: commissionVisibility,
          isChecked: isChecked,
          callback: (data) => {
            setTotalDataCount(data?.meta?.count);
            setResultTransationData(data);
          },
        })
      );
    }
  }, [selectedFilter, commissionVisibility]);

  // useEffect(() => {
  //   const totalPages = Math.ceil(totalDataCount / rowCount);
  //   setTotalPages(totalPages);
  // }, [rowCount, totalDataCount]);

  //date filter  //date filterr;
  //converting data to string format
  useEffect(() => {
    if (resultTransationData) {
      setResultTransaction(
        resultTransationData?.map((element) => {
          return {
            ...element,
            cr: element?.cr === null ? "null" : element?.cr?.toString(),
            dr: element?.dr === null ? "null" : element?.dr?.toString(),
            balance: element?.balance?.toString(),
          };
        })
      );
    }
  }, [resultTransationData]);

  // const handlePageChange = (newPage) => {
  //   setSelectedFilterPoint("");
  //   setResultTransaction(
  //     resultTransationData?.map((element) => {
  //       return {
  //         ...element,
  //         cr: element?.cr === null ? "null" : element?.cr?.toString(),
  //         dr: element?.dr === null ? "null" : element?.dr?.toString(),
  //         balance: element?.balance?.toString(),
  //       };
  //     })
  //   );
  //   setCurrentPage(newPage);
  // };

  const parentFilter = (e) => {
    e.preventDefault();
    setSelectedFilter("");
    setSelectedFilterPoint(e.target.value);
    const user_data = JSON.parse(getLocalStorageItem("userData"));
    dispatch(
      getReportTransation({
        role: 7,
        username: user_data?.username,
        callback: (data) => {
          setResultTransaction(
            data?.map((element) => {
              return {
                ...element,
                cr: element?.cr === null ? "null" : element?.cr?.toString(),
                dr: element?.dr === null ? "null" : element?.dr?.toString(),
                balance: element?.balance?.toString(),
              };
            })
          );
        },
      })
    );
  };

  const handleSearch = (e) => {
    if (selectedFilter === "commission") {
      return;
    }
    if (location?.state?.id) {
      if (isChecked) {
        dispatch(
          getReportTransation({
            role: location?.state?.role,
            layer_id: location?.state?.id,
            commission: commissionVisibility,
            type: selectedFilter,
            startDate: startDate,
            endDate: endDate,
            isChecked: isChecked,
            callback: (data) => {
              setResultTransationData(data);
              setTotalDataCount(data?.meta?.count);
            },
          })
        );
      }
    }
  };

  const handleShowBets = (marketId, layer) => {
    if (marketId !== null) {
      const data = {
        marketId: marketId,
        userId: location?.state?.id,
      };
      dispatch(
        getUserBetsEvent({
          data,
          callback: (data) => {
            setMarketBets({
              bets: data,
              // parent: location?.state?.username?.parent_id?.username,
              username: mobile_no,
            });
            setBetsModal(true);
          },
        })
      );
    } else {
      setCasinoModalOpen(true);
      setMarketBets({
        username: mobile_no,
        userId: layer?.userId,
        desc: layer?.description,
        casino_type: layer?.casino_type,
      });
    }
  };

  const getFormattedDate = (date) => (date ? new Date(date).toLocaleString().split(",")[0] : "");

  function getRowData(row, isAdmin, isCommission) {
    const data = [
      getFormattedDate(row.date),
      row.fromId ? row.fromId.username : "",
      row.toId ? row.toId.username : "",
      row.cr !== "null" && !isNaN(parseFloat(row.cr)) ? parseFloat(row.cr).toFixed(2) : "0",
      row.dr !== "null" && !isNaN(parseFloat(row.dr)) ? parseFloat(row.dr).toFixed(2) : "0",
    ];

    if (isCommission) {
      data.splice(5, 0, row?.commission !== "null" || row?.commission !== null ? row?.commission?.toFixed(2) : "-");
    }
    data.push(row.balance != null ? parseFloat(row.balance).toFixed(2) : "-");
    return data;
  }
  const convertToPDF = () => {
    try {
      if (!filteredTransaction?.length) {
        notifyWarning("No data to convert!!");
        return;
      }
      const doc = new jsPDF();
      const isAdmin = adminData?.role === layerRoles.DIRECTOR;
      let head, body;
      head = ["Date", "From", "To", "CR", "DR"];
      if (currentCommissionStatus) {
        head.splice(5, 0, "Commission");
      }
      if (isAdmin) {
        head.splice(6, 0, "commission");
      }
      head.push("Balance");
      body = filteredTransaction?.map((row) => getRowData(row, isAdmin, currentCommissionStatus));
      // }
      doc.setTextColor(0, 102, 204);
      doc.text(`${selectedFilter} Report`.toUpperCase(), doc.internal.pageSize.width / 2, 10, null, null, "center");
      doc.autoTable({
        head: [head],
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

      doc.save(`${selectedFilter}_report`);
    } catch (err) {
      console.error(err?.message);
    }
  };
  function createDataObj(row, isAdmin) {
    try {
      const dataObj = {
        Date: row.date ? new Date(row.date).toLocaleString().split(",")[0] : "",
        Type: row.type,
        From: row.fromId ? row.fromId.username : "",
        To: row.toId ? row.toId.username : "",
        CR: row.cr !== "null" && row?.cr !== null ? parseFloat(row.cr).toFixed(2) : "0",
        DR: row.dr !== "null" && row?.dr !== null ? parseFloat(row.dr).toFixed(2) : "0",
      };
      if (currentCommissionStatus) {
        dataObj.Commission =
          (row?.commission !== "null" || row?.commission !== null) && !isNaN(parseFloat(row?.commission))
            ? row?.commission?.toFixed(2)
            : "-";
      }

      dataObj["Balance"] = row.balance !== "null" || row?.balance !== null ? parseFloat(row.balance).toFixed(2) : "-";

      return dataObj;
    } catch (err) {
      console.error(err?.message);
    }
  }
  function convertToExcel() {
    try {
      if (!filteredTransaction?.length) {
        notifyWarning("No data to convert!!");
        return;
      }
      const isAdmin = adminData?.role === layerRoles.DIRECTOR;
      let customizedData;
      customizedData = filteredTransaction?.map((row) => createDataObj(row, isAdmin));
      const ws = utils.json_to_sheet(customizedData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, `${selectedFilter}_report` + ".xlsx");
    } catch (err) {
      console.error(err?.message);
    }
  }

  return (
    <Fragment>
      <Fragment>
        <Container fluid={true}>
          <div className="page-title">
            <Row>
              <Col xs="6">
                <div className="d-flex text-uppercase">
                  <button onClick={() => navigate(-1)} style={{ border: 0, backgroundColor: "transparent" }}>
                    <IoArrowBack
                      style={{
                        fontSize: "24px",
                        color: "#007bf",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    />
                  </button>
                  <h3 className="mx-2">{`${t("REPORTS_OF")} ${" "}`}</h3>
                  <h3 className="mobile-number">{`${mobile_no}`}</h3>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </Fragment>

      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Card>
          <CardHeader className="py-3">
            <Row className="mb-3">
              <div className="d-flex align-items-center gap-3">
                <label className="input-border mt-2">
                  <input type="checkbox" onChange={() => setIsChecked(!isChecked)} />
                  <div className="custom-checkmark"></div>
                </label>

                <div className="d-flex ">
                  <DatePicker
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    disabled={!isChecked}
                    maxDate={endDate}
                  />
                  <span
                    className="text-nowrap d-flex align-items-center justify-content-center text-black"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      minWidth: "50px",
                      textAlign: "center",
                      backgroundColor: "#EEE",
                      borderRadius: "6px",
                      margin: "0 5px",
                    }}
                  >
                    TO
                  </span>
                  <DatePicker
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    disabled={!isChecked}
                    minDate={startDate}
                  />

                  <button
                    className="btn  btn-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                    onClick={() => {
                      handleSearch();
                    }}
                    disabled={!isChecked}
                    style={{
                      padding: "0.2rem 1.2rem",
                    }}
                  >
                    <AiOutlineSearch className="fs-5" />
                    <span> {t("SEARCH")} </span>
                  </button>
                </div>
                <div className="d-flex">
                  <button
                    className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                    onClick={convertToPDF}
                  >
                    PDF
                  </button>
                  <button
                    className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                    onClick={() => convertToExcel()}
                  >
                    Excel
                  </button>
                </div>
              </div>
            </Row>
            <Row>
              <Col>
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {location?.state?.role === layerRoles.USER && (
                    <div className="d-flex align-items-center">
                      <input
                        id="disabled-radio-1"
                        type="radio"
                        value="all"
                        checked={selectedFilter === "all"}
                        onChange={handleFilterChange}
                        name="disabled-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="disabled-radio-1"
                        className="mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                      >
                        {t("All")}
                      </label>
                    </div>
                  )}
                  <div className="d-flex align-items-center">
                    <input
                      id="disabled-radio-2"
                      type="radio"
                      value="wallet"
                      checked={selectedFilter === "wallet"}
                      onChange={handleFilterChange}
                      name="disabled-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-radio-2"
                      className="mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                    >
                      {t("WALLET_TRANSACTIONS")}
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      id="disabled-radio-3"
                      type="radio"
                      value="settlement"
                      checked={selectedFilter === "settlement"}
                      onChange={handleFilterChange}
                      name="disabled-radio"
                      className="cursor-pointer-custom w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-radio-3"
                      className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                    >
                      {t("SETTLEMENT_HISTORY")}
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      id="disabled-radio-4"
                      type="radio"
                      value="market"
                      checked={selectedFilter === "market"}
                      onChange={handleFilterChange}
                      name="disabled-radio"
                      className="cursor-pointer-custom w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-radio-4"
                      className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                    >
                      {t("MARKET_PROFIT_AND_LOSS")}
                    </label>

                    <div className="d-flex align-items-center">
                      <input
                        id="disabled-radio-5"
                        type="radio"
                        value="commission"
                        checked={selectedFilter === "commission"}
                        onChange={handleFilterChange}
                        name="disabled-radio-5"
                        className="cursor-pointer-custom w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />

                      <label
                        htmlFor="disabled-radio-5"
                        className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                      >
                        {t("COMMISSION_WISE")}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        id="disabled-radio-1"
                        type="radio"
                        value="Casino"
                        checked={selectedFilter === "Casino"}
                        onChange={handleFilterChange}
                        name="disabled-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="disabled-radio-1"
                        className="mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                      >
                        {t("Casino")}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        id="disabled-radio-1"
                        type="radio"
                        value="Meta"
                        checked={selectedFilter === "Meta"}
                        onChange={handleFilterChange}
                        name="disabled-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="disabled-radio-1"
                        className="mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                      >
                        {t("Meta")}
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <label
                        className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                        htmlFor="currency"
                      >
                        Select Currency:
                      </label>
                      <select
                        id="currency"
                        value={selectedCurrency}
                        onChange={(event) => setSelectedCurrency(event.target.value)}
                        className="p-2 "
                      >
                        <option value="inr">INR</option>
                        <option value="user">{currency?.name}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-auto" style={{ height: "66vh" }}>
              <table className="table table-responsive table-bordered table-hover">
                <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                  <tr style={{ border: "none " }}>
                    <th>{t("DATE")}</th>
                    {selectedFilter === "all" && <th>{t("TYPE")}</th>}
                    {selectedFilter !== "market" && <th>{t("FROM")}</th>}
                    {selectedFilter !== "market" && <th>{t("TO")}</th>}
                    <th>{t("DESCRIPTION")}</th>
                    <th>CR</th>
                    <th>DR</th>
                    {commissionVisibility && <th>Commission</th>}
                    <th>{t("BALANCE")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransaction?.map((layers, index) => {
                    let encodedDynamicPart;
                    if (layers?.type === "market") {
                      encodedDynamicPart = encodeURIComponent(layers?.description?.toLowerCase()?.replace(/\s+/g, "-"));
                    }
                    return (
                      <tr className="" key={index}>
                        <td className="py-2">
                          <span className="d-flex align-items-center text-nowrap">
                            {new Date(layers?.date)?.toLocaleString()}
                          </span>
                        </td>
                        {selectedFilter === "all" && (
                          <td className="py-2">
                            <span
                              className={`badge ${
                                layers?.type === "market"
                                  ? "badge-info"
                                  : layers?.type === "wallet"
                                  ? "badge-orange"
                                  : layers?.type === "parent_point"
                                  ? "badge-orange"
                                  : "badge-success p-1"
                              }`}
                            >
                              {layers?.type === "market"
                                ? "P|L Market"
                                : layers?.type === "wallet"
                                ? "D/W Point"
                                : layers?.type === "parent_point"
                                ? "D/W Point"
                                : "Settlement"}
                            </span>
                          </td>
                        )}
                        {selectedFilter !== "market" && (
                          <td className="py-2">
                            <span className="d-flex align-items-center text-nowrap">{layers?.fromId?.username}</span>
                          </td>
                        )}
                        {selectedFilter !== "market" && (
                          <td className="py-2">
                            <span className="d-flex align-items-center text-nowrap">{layers?.toId?.username}</span>
                          </td>
                        )}

                        <td className="py-2">
                          {layers?.type === "market" ? (
                            <>
                              {location?.state?.role !== layerRoles.USER ? (
                                <Link
                                  state={{
                                    marketId: layers?.marketId,
                                    desc: layers?.description,
                                    myReports: true,
                                    userId: location?.state?.id,
                                    resultTransaction: false,
                                    role: location?.state?.role,
                                  }}
                                  to={`/reports/${encodedDynamicPart}`}
                                  className="result_text"
                                >
                                  {layers?.description}
                                </Link>
                              ) : (
                                <div className="pointer" onClick={() => handleShowBets(layers?.marketId, layers)}>
                                  {layers?.description}
                                </div>
                              )}
                              <p>Result : &nbsp;{layers?.result}</p>
                            </>
                          ) : (
                            <span>{layers?.description}</span>
                          )}
                        </td>

                        <td className="py-2">
                          <span className="d-flex align-items-center text-nowrap">
                            {commissionVisibility ? (
                              <td className="py-2">
                                <span className="d-flex align-items-center text-nowrap">
                                  {layers?.cr !== "null" && layers?.cr !== "undefined" ? (
                                    layers?.commission ? (
                                      (adminData?.role === layerRoles.DIRECTOR ||
                                        Object.values(ManagerRoles).includes(adminData?.role)) &&
                                      selectedCurrency === "user" ? (
                                        convertINRToCurrency(layers?.cr - layers.commission, currency?.value)
                                      ) : (
                                        parseFloat(layers?.cr - layers.commission).toFixed(2)
                                      )
                                    ) : (adminData?.role === layerRoles.DIRECTOR ||
                                        Object.values(ManagerRoles).includes(adminData?.role)) &&
                                      selectedCurrency === "user" ? (
                                      convertINRToCurrency(layers?.cr, currency?.value)
                                    ) : (
                                      parseFloat(layers?.cr).toFixed(2)
                                    )
                                  ) : (
                                    <span>
                                      {layers?.cr === "null"
                                        ? "-"
                                        : (adminData?.role === layerRoles.DIRECTOR ||
                                            Object.values(ManagerRoles).includes(adminData?.role)) &&
                                          selectedCurrency === "user"
                                        ? convertINRToCurrency(layers?.cr, currency?.value)
                                        : parseFloat(layers?.cr).toFixed(2)}
                                    </span>
                                  )}
                                </span>
                              </td>
                            ) : layers?.cr === "null" ? (
                              "-"
                            ) : (adminData?.role === layerRoles.DIRECTOR ||
                                Object.values(ManagerRoles).includes(adminData?.role)) &&
                              selectedCurrency === "user" ? (
                              convertINRToCurrency(layers?.cr, currency?.value)
                            ) : layers?.commission ? (
                              parseFloat(layers?.cr - layers.commission).toFixed(2)
                            ) : (
                              parseFloat(layers?.cr).toFixed(2)
                            )}
                          </span>
                        </td>

                        <td className="py-2">
                          {(adminData?.role === layerRoles.DIRECTOR ||
                            Object.values(ManagerRoles).includes(adminData?.role)) &&
                          selectedCurrency === "user"
                            ? layers?.dr === "null"
                              ? "-"
                              : convertINRToCurrency(layers?.dr, currency?.value)
                            : layers?.dr === "null"
                            ? "-"
                            : parseFloat(layers?.dr).toFixed(2)}

                          {/* {layers?.dr === "null"
                            ? "-"
                            : parseFloat(layers?.dr).toFixed(2)} */}
                        </td>

                        {commissionVisibility && (
                          <td className="py-2">
                            <span className="d-flex align-items-center text-nowrap">{layers?.commission}</span>
                          </td>
                        )}

                        <td className="py-2">
                          {(adminData?.role === layerRoles.DIRECTOR ||
                            Object.values(ManagerRoles).includes(adminData?.role)) &&
                          selectedCurrency === "user"
                            ? convertINRToCurrency(layers?.balance, currency?.value)
                            : parseFloat(layers?.balance)?.toLocaleString("en-us", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loading === false && filteredTransaction?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="py-3 text-center text-md-start"></CardFooter>
        </Card>
      </Container>

      {betsModal && (
        // <BetsModal
        //   isOpen={betsModal}
        //   title={"Market Bets"}
        //   toggler={setBetsModal}
        //   size="lg"
        //   pagination={true}
        //   modalData={marketBets}
        // />
        <ProfitLossModal
          isOpen={betsModal}
          title={"Bets Of"}
          toggler={setBetsModal}
          modalData={marketBets}
          deposit={true}
          size="xl"
          selectedCurrency={selectedCurrency}
          currency={currency}
        />
      )}

      {casinoModalOpen && (
        <ProfitLossCasinoModal
          isOpen={casinoModalOpen}
          title={"Bets Of"}
          toggler={setCasinoModalOpen}
          modalData={marketBets}
          deposit={true}
          size="xl"
        />
      )}
    </Fragment>
  );
};
export default Report;
