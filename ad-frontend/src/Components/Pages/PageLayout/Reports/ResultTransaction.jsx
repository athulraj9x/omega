import React, { Fragment, useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiRefreshCw } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Input, Row, Table } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import "../../../../assets/scss/pages/_customCheckBox.scss";
import {
  getReportTransation,
  getResultTransation,
  getResultTransationDetail,
  settlementRollBack,
} from "../../../../redux/action";
import { convertINRToCurrency, currencyConversion, getLocalStorageItem } from "../../../../utils/helper";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GrPowerReset } from "react-icons/gr";

const ListResultTransaction = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const location = useLocation();
  const { t } = useTranslation();
  const reportsData = useSelector((state) => state.GetResultTransaction);

  const adminData = useSelector((state) => state.Login.userData);

  const [resultTransaction, setResultTransaction] = useState([]);
  const [resultTransationData, setResultTransationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectEventDateFilter, setEventDateFilter] = useState("30days");
  const [DateFilter, setDateFilter] = useState("day");
  const [rotatingRows, setRotatingRows] = useState({});

  useEffect(() => {
    const filteredTransaction = resultTransaction?.filter((transaction) => {
      if (selectedFilter === "event" && transaction?.type === "market") {
        return transaction;
      }
      if (selectedFilter !== "all") {
        return transaction?.type === selectedFilter;
      } else {
        if (transaction?.type === "wallet") {
          if (transaction?.description?.startsWith("SETTLEMENT |")) {
            transaction.type = "settlement";
            return transaction;
          } else {
            return transaction;
          }
        } else if (transaction?.type === "market") {
          return transaction;
        }
      }
    });
    setFilteredTransaction(filteredTransaction);
  }, [resultTransaction, selectedFilter]);

  useEffect(() => {
    init();
  }, [selectedFilter, isChecked, location, selectEventDateFilter, DateFilter]);

  useEffect(() => {
    if (resultTransationData?.length) {
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

  const init = () => {
    setLoading(true);
    if (selectedFilter === "event" && !selectEventDateFilter) {
      return;
    }
    let start;
    const now = new Date();
    if (selectEventDateFilter && selectedFilter === "event") {
      if (selectedFilter === "event") {
        setIsChecked(true);
        if (selectEventDateFilter === "30days") {
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (selectEventDateFilter === "6months") {
          start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        } else if (selectEventDateFilter === "1year") {
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
        setStartDate(start);
        setEndDate(now);
      }
    }

    if (DateFilter) {
      if (DateFilter === "day") {
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (DateFilter === "week") {
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (DateFilter === "month") {
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      setStartDate(start);
      setEndDate(now);
    }

    const defaultDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const options = {
      type: selectedFilter,
      path: location.pathname,
      isChecked: selectEventDateFilter && selectedFilter === "event" ? true : isChecked,
      startDate: startDate ? start : defaultDate,
      endDate: endDate ? now : new Date(),
      callback: (data) => {
        if (data?.data[0]?.length === 0) {
          setFilteredTransaction([]);
        }
        setResultTransationData(data?.data[0]);
        setEvents(data?.data[1]);
        setUsersList(data?.data[2]);
        setLoading(false);
      },
    };

    if (location?.state?.userId) {
      options.userId = location.state.userId;
    }
    dispatch(getResultTransation(options));
  };

  //filterrr
  const handleFilterChange = (event) => {
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

  const handleSearch = (e) => {
    if (location?.state?.userId) {
      setLoading(true);
      if (isChecked) {
        dispatch(
          getResultTransation({
            userId: location?.state?.userId,
            // page: currentPage,
            // perPage: rowCount,
            path: location.pathname,
            type: selectedFilter,
            startDate: startDate,
            endDate: endDate,
            isChecked: isChecked,
            callback: (data) => {
              setEvents(data?.data[1]);
              setResultTransationData(data?.data[0]);
              setUsersList(data?.data[2]);
              setLoading(false);
            },
          })
        );
      } else {
        getResultTransation({
          type: selectedFilter,
          path: location.pathname,
          isChecked: isChecked,
          callback: (data) => {
            setEvents(data?.data[1]);
            setResultTransationData(data?.data[0]);
            setUsersList(data?.data[2]);
            setLoading(false);
          },
        });
      }
    } else {
      if (isChecked) {
        dispatch(
          getResultTransation({
            type: selectedFilter,
            startDate: startDate,
            path: location.pathname,
            endDate: endDate,
            isChecked: isChecked,
            callback: (data) => {
              setEvents(data?.data[1]);
              setUsersList(data?.data[2]);
              setResultTransationData(data?.data[0]);
              setLoading(false);
            },
          })
        );
      } else {
        getResultTransation({
          type: selectedFilter,
          isChecked: isChecked,
          path: location.pathname,
          callback: (data) => {
            setEvents(data?.data[1]);
            setResultTransationData(data?.data[0]);
            setUsersList(data?.data[2]);
            setLoading(false);
          },
        });
      }
    }
  };

  const filteredData = useMemo(() => {
    if (selectedFilter === "event") {
      if (selectedUser) {
        return resultTransationData?.filter((transaction) => {
          return transaction?.description?.includes(selectedOption) && transaction?.userName === selectedUser;
        });
      } else {
        return resultTransationData?.filter((transaction) => {
          return transaction?.description?.includes(selectedOption);
        });
      }
    }
    return resultTransationData;
  }, [resultTransationData, selectedOption, selectedFilter, selectedUser]);
  useEffect(() => {
    setFilteredTransaction(filteredData);
  }, [filteredTransaction, selectedOption, selectedUser]);

  const createDataObj = (row, isAdmin) => {
    const dataObj = {
      Date: row.date ? new Date(row.date).toLocaleString().split(",")[0] : "",
      Type: row.type,
      From: row.fromId ? row.fromId.username : "",
      To: row.toId ? row.toId.username : "",
      CR: row.cr !== "null" && !isNaN(parseFloat(row.cr)) ? parseFloat(row.cr).toFixed(2) : "0",
      DR: row.dr !== "null" && !isNaN(parseFloat(row.dr)) ? parseFloat(row.dr).toFixed(2) : "0",
    };

    dataObj["Balance"] = row.balance !== "null" ? parseFloat(row.balance).toFixed(2) : "";

    return dataObj;
  };

  const convertToExcel = () => {
    const isAdmin = adminData?.role === layerRoles.DIRECTOR;
    let customizedData;
    if (selectedFilter === "all" || selectedFilter === "wallet" || selectedFilter === "settlement") {
      customizedData = filteredTransaction.map((row) => createDataObj(row, isAdmin));
    } else if (selectedFilter === "market" || selectedFilter === "event") {
      customizedData = filteredTransaction.map((row) => {
        const dataObj = createDataObj(row, isAdmin);
        delete dataObj.From;
        delete dataObj.To;
        return dataObj;
      });
    }

    const ws = utils.json_to_sheet(customizedData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `${selectedFilter}_report` + ".xlsx");
  };

  const getFormattedDate = (date) => (date ? new Date(date).toLocaleString().split(",")[0] : "");

  const getRowData = (row, isAdmin) => {
    const data = [
      getFormattedDate(row.date),
      row.fromId ? row.fromId.username : "",
      row.toId ? row.toId.username : "",
      row.cr !== "null" && !isNaN(parseFloat(row?.cr)) ? parseFloat(row.cr)?.toFixed(2) : "0",
      row.dr !== "null" && !isNaN(parseFloat(row.dr)) ? parseFloat(row.dr).toFixed(2) : "0",
      row.balance != null ? parseFloat(row.balance).toFixed(2) : "0",
    ];

    return data;
  };

  const handleRollBackClick = (e, layer_data, index) => {
    e.preventDefault();
    setRotatingRows((prevRotatingRows) => ({
      ...prevRotatingRows,
      [index]: !prevRotatingRows[index],
    }));

    let data = {
      id: layer_data._id,
    };
    dispatch(
      settlementRollBack({
        data,
        callback: (data) => {
          init();
        },
      })
    );
  };

  const convertToPDF = () => {
    const doc = new jsPDF();
    const isAdmin = adminData?.role === layerRoles.DIRECTOR;
    let head, body;
    if (selectedFilter === "all") {
      head = ["Date", "From", "To", "CR", "DR", "Balance"];

      body = filteredTransaction?.map((row) => getRowData(row, isAdmin));
    } else if (selectedFilter === "wallet" || selectedFilter === "settlement") {
      head = ["Date", "From", "To", "CR", "DR", "Balance"];

      body = filteredTransaction?.map((row) => {
        const data = [
          getFormattedDate(row.date),
          row.fromId ? row.fromId.username : "",
          row.toId ? row.toId.username : "",
          row.cr !== "null" && !isNaN(parseFloat(row.cr)) ? parseFloat(row.cr).toFixed(2) : "0",
          row.dr !== "null" && !isNaN(parseFloat(row.dr)) ? parseFloat(row.dr).toFixed(2) : "0",
          row.balance != null ? parseFloat(row.balance).toFixed(2) : "-",
        ];
        return data;
      });
    } else if (selectedFilter === "market" || selectedFilter === "event") {
      head = ["Date", "CR", "DR", "Balance"];

      body = filteredTransaction?.map((row) => {
        const data = [
          getFormattedDate(row.date),
          row.cr !== "null" && !isNaN(parseFloat(row.cr)) ? parseFloat(row.cr).toFixed(2) : "0",
          row.dr !== "null" && !isNaN(parseFloat(row.dr)) ? parseFloat(row.dr).toFixed(2) : "0",
          row.balance != null ? parseFloat(row.balance).toFixed(2) : "-",
        ];
        return data;
      });
    }

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
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("REPORTS")} title={title?.title} parent={title?.parent} />

      <Container fluid={true}>
        {reportsData?.loading && (
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
                  />

                  <button
                    className="btn btn-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
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
                <div className="m-2 p-2">
                  <select
                    onChange={(event) => setDateFilter(event.target.value)}
                    value={DateFilter}
                    className="form-select m-2 p-2 text-secondary"
                  >
                    <option className="text-secondary" value="day">
                      Day
                    </option>
                    <option className={`text-secondary`} value="week">
                      Week
                    </option>
                    <option className={`text-secondary`} value="month">
                      Month
                    </option>
                  </select>
                </div>
              </div>
            </Row>
            <Row>
              <Col>
                <div className="d-flex gap-2 overflow-auto pb-2">
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
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      id="disabled-radio-6"
                      type="radio"
                      value="Casino"
                      checked={selectedFilter === "Casino"}
                      onChange={handleFilterChange}
                      name="disabled-radio"
                      className="cursor-pointer-custom w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-radio-6"
                      className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                    >
                      {t("Casino")}
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      id="disabled-radio-5"
                      type="radio"
                      value="Meta"
                      checked={selectedFilter === "Meta"}
                      onChange={handleFilterChange}
                      name="disabled-radio"
                      className="cursor-pointer-custom w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-radio-5"
                      className=" mx-2 ml-2 mb-0 text-sm font-medium text-gray-400 dark:text-gray-500 text-nowrap"
                    >
                      {t("Meta")}
                    </label>
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
                    {selectedFilter !== "market" && selectedFilter !== "event" && <th>{t("FROM")}</th>}
                    {selectedFilter !== "market" && selectedFilter !== "event" && <th>{t("TO")}</th>}
                    <th>{t("DESCRIPTION")}</th>
                    <th>
                      CR <br />
                    </th>
                    <th>DR</th>
                    <th>{t("BALANCE")}</th>
                    {selectedFilter === "settlement" &&
                      [
                        ManagerRoles.ACCOUNTS_MANAGER,
                        ManagerRoles.MANAGER,
                        ManagerRoles.FANCY_MANAGER,
                        ManagerRoles.OPERATIONAL_MANAGER,
                        ManagerRoles.MONITORING_MANAGER,
                        layerRoles.DIRECTOR,
                      ].includes(adminData?.role) && <th>rollback</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransaction?.length &&
                    filteredTransaction?.map((layers, index) => {
                      const isRotating = rotatingRows[index];
                      const iconStyle = {
                        transform: isRotating ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        cursor: "pointer", // Add cursor style for clickable icons
                        color: " #54ba4a",
                      };

                      let encodedDynamicPart;
                      if (layers?.type === "market") {
                        encodedDynamicPart = encodeURIComponent(
                          layers?.description?.toLowerCase()?.replace(/\s+/g, "-")
                        );
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
                          {selectedFilter !== "market" && selectedFilter !== "event" && (
                            <td className="py-2">
                              <span className="d-flex align-items-center text-nowrap">{layers?.fromId?.username}</span>
                            </td>
                          )}
                          {selectedFilter !== "market" && selectedFilter !== "event" && (
                            <td className="py-2">
                              <span className="d-flex align-items-center text-nowrap">{layers?.toId?.username}</span>
                            </td>
                          )}
                          <td className="py-2">
                            {layers?.type === "market" ? (
                              <>
                                <Link
                                  state={{
                                    marketId: layers?.marketId,
                                    desc: layers?.description,
                                    casino_type: layers?.casino_type,
                                    date: layers?.date,
                                    userId: layers?.userId,
                                    roundId: layers?.roundId,
                                    myReports: true,
                                    resultTransaction: true,
                                  }}
                                  to={`/reports/${encodedDynamicPart}`}
                                  className="result_text"
                                >
                                  {layers?.description}
                                </Link>
                                <p>Result : &nbsp;{layers?.result}</p>
                              </>
                            ) : (
                              <span>{layers?.description}</span>
                            )}
                          </td>

                          <td className="py-2">
                            <span>
                              {layers?.cr === "null" || layers?.cr === null ? "-" : parseFloat(layers?.cr).toFixed(2)}
                            </span>
                          </td>

                          <td className="py-2">
                            <span>
                              {layers?.dr === "null" || layers?.dr === null ? "-" : parseFloat(layers?.dr).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-2">
                            <span>
                              {layers?.balance === "null"
                                ? "-"
                                : parseFloat(layers?.balance)?.toLocaleString("en-us", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                            </span>
                          </td>
                          {[
                            ManagerRoles.ACCOUNTS_MANAGER,
                            ManagerRoles.MANAGER,
                            ManagerRoles.FANCY_MANAGER,
                            ManagerRoles.OPERATIONAL_MANAGER,
                            ManagerRoles.MONITORING_MANAGER,
                            layerRoles.DIRECTOR,
                          ].includes(adminData?.role) &&
                          selectedFilter === "settlement" &&
                          layers?.description?.includes("AUTO SETTLEMENT") ? (
                            <td>
                              <span
                                onClick={(e) => handleRollBackClick(e, layers, index)}
                                className="d-flex justify-content-center"
                              >
                                <FiRefreshCw style={iconStyle} />
                              </span>
                            </td>
                          ) : (
                            selectedFilter === "settlement" && (
                              <td>
                                <span className="d-flex justify-content-center">Not Applicable</span>
                              </td>
                            )
                          )}
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
    </Fragment>
  );
};
export default ListResultTransaction;
