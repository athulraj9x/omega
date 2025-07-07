import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter, Col, Container, Row } from "reactstrap";

import { Badges, Breadcrumbs } from "../../../../AbstractElements";
import { PAGINATION, layerRoles } from "../../../../Constant";
import usePageTitle from "../../../../Hooks/usePageTitle";
import "../../../../assets/scss/pages/_customCheckBox.scss";
import "../../../../assets/scss/pages/settlement/modalBtn.scss";
import { getCommissionReports } from "../../../../redux/action";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import Loader from "../../../../Layout/Loader";
import "../../../../assets/scss/pages/resultTransaction.scss";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CommissionReports = ({ inactive }) => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const adminData = useSelector((state) => state.Login.userData);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage); // Current selected row count
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [layerPaths, setLayerPaths] = useState([]);
  const [currentClickedUser, setCurrentClickedUser] = useState("");
  const [searchText, setSearchText] = useState("");
  const [commissionData, setCommissionData] = useState([]);
  const [currentUserDetails, setCurrentUserDetails] = useState([]);
  const [currentCurrencies, setCurrentCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [currentClickedUser, rowCount, month, year, selectedCurrency]);

  useEffect(() => {
    dispatch(
      getCommissionReports({
        buildTreeFrom: currentClickedUser,
        search: searchText,
        selectedCurrency: selectedCurrency,
        perPage: rowCount,
        page: currentPage,
        month: month,
        year: year,
        startDate: startDate,
        endDate: endDate,
        callback: (response) => {
          setLoading(false);
          setCommissionData(response?.data?.userTree?.children);
          const { children, ...userDetailsWithoutChildren } = response?.data?.userTree;
          setCurrentUserDetails(userDetailsWithoutChildren);
          setTotalPages(response?.data?.totalPages);
          setCurrentCurrencies(response?.data?.currencies);
        },
      })
    );
  }, [
    currentClickedUser,
    searchText,
    selectedCurrency,
    rowCount,
    currentPage,
    month,
    year,
    startDate,
    endDate,
    dispatch,
  ]);

  const updateSelectedDate = (newMonth, newYear) => {
    const formattedMonth = String(newMonth).padStart(2, "0");
    setSelectedDate(`${newYear}-${formattedMonth}`);
    setMonth(newMonth);
    setYear(newYear);
  };

  const handlePreviousMonth = () => {
    if (month === 1) {
      updateSelectedDate(12, year - 1);
    } else {
      updateSelectedDate(month - 1, year);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      updateSelectedDate(1, year + 1);
    } else {
      updateSelectedDate(month + 1, year);
    }
  };
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const convertToINR = (amount, conversionRate) => {
    let rate = conversionRate;
    if (conversionRate === undefined || conversionRate === null || conversionRate === 0 || isNaN(conversionRate)) {
      rate = 1;
    }
    console.log(amount, conversionRate, "--conversionRate--op");
    const amountConverted = amount * parseFloat(rate);
    return (+parseFloat(amountConverted).toFixed(2)).toLocaleString();
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    const [year, month] = dateValue.split("-");
    setMonth(Number(month));
    setYear(Number(year));
  };

  let searchTimeout;
  function searchUsers(newSearchText) {
    setSearchText(newSearchText);
  }

  const handleInputChange = (e) => {
    const newSearchText = e.target.value;
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      searchUsers(newSearchText);
    }, 1000);
  };

  const handleLinkClick = (data) => {
    const { username, role, userId } = data;
    searchUsers("");
    setCurrentClickedUser(userId);

    if (userId === adminData.userId) {
      setLayerPaths([]);
    } else {
      if (layerPaths?.length === 0) {
        setLayerPaths([{ username, role, userId }]);
      } else {
        const existingIndex = layerPaths.findIndex((layer) => layer.userId === userId);

        if (existingIndex !== -1) {
          setLayerPaths(layerPaths.slice(0, existingIndex + 1));
        } else {
          setLayerPaths([...layerPaths, { username, role, userId }]);
        }
      }
    }
  };

  const removeCommasFromString = (commaSeparatedString) => {
    return parseFloat(commaSeparatedString.replace(/,/g, ""));
  };

  const totalCommissionCharge = (data) => {
    return Number((data.totalCommissionExchange + data.totalCommissionLine).toFixed(2)).toLocaleString();
  };

  const BFCommission = (data) => {
    return Number(
      ((data.totalCommissionExchange + data.totalCommissionLine) * (data.betFairShare * 0.01)).toFixed(2)
    ).toLocaleString();
  };

  const ourCommissionValue = (data) => {
    let { sportShares } = data;
    if (!sportShares) sportShares = 0;
    let percentage = (100 - sportShares) * 0.01;

    let value = (data.totalCommissionExchange + data.totalCommissionLine) * percentage;
    return Number(value.toFixed(2)).toLocaleString();
  };

  const clientBackCommission = (data) => {
    let value = 0;
    if (data.commissionPercentage) {
      value = (removeCommasFromString(clientShareCommission(data)) * data.commissionPercentage).toFixed(2);
    } else {
      value = (0).toFixed(2);
    }
    return Number(value).toLocaleString();
  };

  const clientShareCommission = (data) => {
    let value;
    if (data.role < 7) {
      value = ((data.totalCommissionExchange + data.totalCommissionLine) * (data.sportShares * 0.01)).toFixed(2);
    } else {
      value = (0).toFixed(2);
    }
    return Number(value).toLocaleString();
  };

  const netCommissionIncome = (data) => {
    return Number(
      (removeCommasFromString(ourCommissionValue(data)) - removeCommasFromString(clientBackCommission(data))).toFixed(2)
    ).toLocaleString();
  };

  const handleCheckboxChange = () => {
    if (!isChecked) {
      let startDate = new Date(`${year}-${month}-01`);

      let endDate = new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`);
      endDate.setDate(endDate.getDate() - 1);

      setStartDate(startDate.toISOString().split("T")[0]);
      setEndDate(endDate.toISOString().split("T")[0]);
    } else {
      setStartDate("");
      setEndDate("");
    }

    setIsChecked(!isChecked);
  };
  const getRowData = (row) => {
    let data;
    if (Number(row.currencyData.value) === 1) {
      data = [
        row.username ? row.username : "",
        row.name ? row.name : "",
        totalCommissionCharge(row),
        BFCommission(row),
        ourCommissionValue(row),
        clientShareCommission(row),
        netCommissionIncome(row),
        clientBackCommission(row),
      ];
    } else {
      data = [
        row.username ? row.username : "",
        row.name ? row.name : "",
        `${totalCommissionCharge(row)}(${convertToINR(
          removeCommasFromString(totalCommissionCharge(row)),
          row.currencyData.value
        )})`,
        `${BFCommission(row)}(${convertToINR(removeCommasFromString(BFCommission(row)), row.currencyData.value)})`,
        `${ourCommissionValue(row)}(${convertToINR(
          removeCommasFromString(ourCommissionValue(row)),
          row.currencyData.value
        )})`,
        `${clientShareCommission(row)}(${convertToINR(
          removeCommasFromString(clientShareCommission(row)),
          row.currencyData.value
        )})`,
        `${netCommissionIncome(row)}(${convertToINR(
          removeCommasFromString(netCommissionIncome(row)),
          row.currencyData.value
        )})`,
        `${clientBackCommission(row)}(${convertToINR(
          removeCommasFromString(clientBackCommission(row)),
          row.currencyData.value
        )})`,
      ];
    }
    return data;
  };
  const convertToPDF = () => {
    const doc = new jsPDF();
    let head, body;
    head = [
      "Username",
      "Created By",
      "Total Commission Charge",
      "BF Commission",
      "Our Commission",
      "Client Share Commission",
      "Net Commission Income",
      "Client Back Commission",
    ];
    body = commissionData?.map((row) => getRowData(row));
    doc.setTextColor(0, 102, 204);
    doc.text(`Commission Report`.toUpperCase(), doc.internal.pageSize.width / 2, 10, null, null, "center");

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
        cell.styles.lineWidth = 0.2;
        cell.styles.lineColor = [0, 0, 0];
      },
    });
    doc.save(`Commission_report`);
  };
  const createDataObj = (row) => {
    let dataObj;
    if (Number(row.currencyData.value) === 1) {
      dataObj = {
        Username: row.username ? row.username : "",
        CreatedBy: row.name ? row.name : "",
        TotalCommissionCharge: totalCommissionCharge(row),
        BFCommission: BFCommission(row),
        OurCommission: ourCommissionValue(row),
        ClientShareCommission: clientShareCommission(row),
        NetCommissionIncome: netCommissionIncome(row),
        ClientBackCommission: clientBackCommission(row),
      };
    } else {
      dataObj = {
        Username: row.username ? row.username : "",
        CreatedBy: row.name ? row.name : "",
        TotalCommissionCharge: `${totalCommissionCharge(row)}(${convertToINR(
          removeCommasFromString(totalCommissionCharge(row)),
          row.currencyData.value
        )})`,
        BFCommission: `${BFCommission(row)}(${convertToINR(
          removeCommasFromString(BFCommission(row)),
          row.currencyData.value
        )})`,
        OurCommission: `${ourCommissionValue(row)}(${convertToINR(
          removeCommasFromString(ourCommissionValue(row)),
          row.currencyData.value
        )})`,
        ClientShareCommission: `${clientShareCommission(row)}(${convertToINR(
          removeCommasFromString(clientShareCommission(row)),
          row.currencyData.value
        )})`,
        NetCommissionIncome: `${netCommissionIncome(row)}(${convertToINR(
          removeCommasFromString(netCommissionIncome(row)),
          row.currencyData.value
        )})`,
        ClientBackCommission: `${clientBackCommission(row)}(${convertToINR(
          removeCommasFromString(clientBackCommission(row)),
          row.currencyData.value
        )})`,
      };
    }
    return dataObj;
  };
  const convertToExcel = () => {
    let customizedData;
    customizedData = commissionData.map((row) => createDataObj(row));
    const ws = utils.json_to_sheet(customizedData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `Commission Report` + ".xlsx");
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("COMMISSION_REPORTS")} title={title?.title} parent={title?.parent} />
      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Card>
          <Container fluid={true}>
            <span className="m-3 p-2 rounded w-15 bg-transparent">
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={isChecked}
                className="mr-2"
                style={{ width: "15px", height: "15px", margin: "auto" }}
              />
              <input
                type="date"
                className="m-2 px-2 py-1 rounded w-15 border bg-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!isChecked}
                max={endDate}
              />
              <span>To</span>
              <input
                type="date"
                className="m-2 px-2 py-1 rounded w-15 border bg-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!isChecked}
                min={startDate}
              />
            </span>

            <span className="m-4 p-2 rounded w-15 border bg-transparent">
              <button
                className="ml-4 p-2 w-15 border-0 bg-transparent"
                onClick={handlePreviousMonth}
                disabled={isChecked}
              >
                &larr;
              </button>
              <input
                type="month"
                value={selectedDate}
                onChange={handleDateChange}
                className="m-1 p-2 w-15 border-0 bg-transparent"
                disabled={isChecked}
              />
              <button className="p-2 w-15 border-0 bg-transparent" onClick={handleNextMonth} disabled={isChecked}>
                &rarr;
              </button>
            </span>
            <select value={selectedCurrency} onChange={handleCurrencyChange} className="m-4 p-2 w-15 rounded border">
              <option value="">Select Currency</option>
              {currentCurrencies.map((currency) => (
                <option key={currency._id} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
            <button
              className="m-4 p-2 w-15 rounded border "
              onClick={() => {
                setSelectedCurrency("");
                setSelectedDate(
                  `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`
                );
                setMonth(new Date().getMonth() + 1);
                setYear(new Date().getFullYear());
                setCurrentPage(1);
                setStartDate("");
                setEndDate("");
                setIsChecked(false);
              }}
            >
              Reset Filters
            </button>

            <div className="d-flex m-2">
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                onClick={convertToPDF}
              >
                PDF
              </button>
              <button
                className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                onClick={convertToExcel}
              >
                Excel
              </button>
            </div>
          </Container>
          <CardBody className="p-0 z-0">
            <Row className="bg-light p-2">
              <Col className="d-flex gap-1">
                <span className="text-dark pointer path-text" onClick={() => handleLinkClick(adminData)}>
                  {adminData?.username}
                </span>
                {layerPaths?.length !== 0 &&
                  layerPaths?.map((path, index) => {
                    return (
                      <span
                        key={index}
                        className="d-flex align-items-center gap-1 text-dark pointer"
                        onClick={() => {
                          handleLinkClick(path);
                        }}
                      >
                        <span className="path-text">{` > `}</span>
                        <span className="ml-1">
                          <Badges
                            attrBadge={{
                              color: `badge ${"badge-custom"}`,
                            }}
                          >
                            {` ${
                              path.role === layerRoles?.USER
                                ? "U"
                                : path.role === layerRoles?.AGENT
                                ? "AG"
                                : path.role === layerRoles?.MASTER
                                ? "MS"
                                : path.role === layerRoles?.SUPER_MASTER
                                ? "SM"
                                : path.role === layerRoles?.ADMIN
                                ? "AD"
                                : "SA"
                            }`}
                          </Badges>
                        </span>
                        <span className="path-text">{` ${path?.username}`}</span>
                      </span>
                    );
                  })}
              </Col>
            </Row>
            <Row>
              <Col className="d-flex m-2">
                <input
                  style={{ fontSize: "14px" }}
                  className="form-control w-25"
                  id="search"
                  type="text"
                  placeholder="Search user"
                  onChange={handleInputChange}
                  // value={searchText}
                />
              </Col>
            </Row>
            <div className="overflow-auto" style={{ height: "62vh" }}>
              <table className="table table-bordered table-hover ">
                <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                  <tr className="text-left" style={{ border: "none " }}>
                    <th>{t("Username (Name)")}</th>
                    <th>{t("Total Commission Charge")}</th>
                    {adminData?.role < layerRoles.WHITE_LABEL && (
                      <>
                        <th>{t("Our Commission")}</th>
                        <th>{t("Client Share Commission")}</th>
                        <th>{t("Net Commission Income")}</th>
                        <th>{t("Client Back Commission")}</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {commissionData?.map((data, index) => {
                    console.log(data, "commiiss");

                    if (Number(data.currencyData.value) === 1) {
                      return (
                        <tr className="text-left align-middle py-2" key={index}>
                          <td className="py-2">
                            <div className="name align-items-center d-flex">
                              <span>
                                <badges
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f4f4f4",
                                    width: "30px",
                                    height: "18px",
                                    borderRadius: "5px",
                                    color: "#2f2f3b",
                                    padding: "0.25rem 0.4rem",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                  }}
                                >
                                  {` ${
                                    data?.role === layerRoles?.USER
                                      ? "U"
                                      : data?.role === layerRoles?.WHITE_LABEL
                                      ? "WL"
                                      : data?.role === layerRoles?.MASTER
                                      ? "MS"
                                      : data?.role === layerRoles?.DOUBLE_SUPER
                                      ? "DS"
                                      : data?.role === layerRoles?.SUPER_MASTER
                                      ? "SM"
                                      : data?.role === layerRoles?.ADMIN
                                      ? "AD"
                                      : "SA"
                                  }`}
                                </badges>
                              </span>
                              {data.role === 7 ? (
                                <span className="ms-2 text-nowrap">
                                  {data?.username} ({data?.name})
                                </span>
                              ) : (
                                <Link className="ms-2 text-nowrap pointer" onClick={() => handleLinkClick(data)}>
                                  {data?.username} ({data?.name})
                                </Link>
                              )}
                            </div>
                            <div className="d-flex mt-1 w-15 gap-3">
                              {data?.sportShares ? (
                                <div className="d-flex justify-content-center">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "40px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {`Share ${data?.sportShares}%`}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}
                              {data?.commissionPercentage ? (
                                <div className="d-flex justify-content-center ">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "50px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {`CP ${data?.commissionPercentage}%`}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}

                              {data.role >= 2 ? (
                                <div className="d-flex justify-content-center">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "50px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {data?.currencyData.code || ""}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <span className="value fw-medium">{totalCommissionCharge(data)}</span>
                          </td>
                          {adminData?.role < layerRoles.WHITE_LABEL && (
                            <>
                              <td>
                                <span className="value fw-medium">{ourCommissionValue(data)}</span>
                              </td>
                              <td>
                                <span className="value fw-medium">{clientShareCommission(data)}</span>
                              </td>
                              <td>
                                <span className="value fw-medium">{netCommissionIncome(data)}</span>
                              </td>
                              <td>
                                <span className="value fw-medium">{clientBackCommission(data)}</span>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    } else {
                      return (
                        <tr className="text-left align-middle py-2" key={index}>
                          <td className="py-2">
                            <div className="name align-items-center d-flex">
                              <span>
                                <badges
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f4f4f4",
                                    width: "30px",
                                    height: "18px",
                                    borderRadius: "5px",
                                    color: "#2f2f3b",
                                    padding: "0.25rem 0.4rem",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                  }}
                                >
                                  {` ${
                                    data?.role === layerRoles?.USER
                                      ? "U"
                                      : data?.role === layerRoles?.WHITE_LABEL
                                      ? "WL"
                                      : data?.role === layerRoles?.MASTER
                                      ? "MS"
                                      : data?.role === layerRoles?.DOUBLE_SUPER
                                      ? "DS"
                                      : data?.role === layerRoles?.SUPER_MASTER
                                      ? "SM"
                                      : data?.role === layerRoles?.ADMIN
                                      ? "AD"
                                      : "SA"
                                  }`}
                                </badges>
                              </span>
                              {data.role === 7 ? (
                                <span className="ms-2 text-nowrap">
                                  {data?.username} ({data?.name})
                                </span>
                              ) : (
                                <Link className="ms-2 text-nowrap pointer" onClick={() => handleLinkClick(data)}>
                                  {data?.username} ({data?.name})
                                </Link>
                              )}
                            </div>
                            <div className="d-flex mt-1 w-15">
                              {data?.sportShares ? (
                                <div className="d-flex justify-content-center w-50 ">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "40px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {`Share ${data?.sportShares}%`}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}
                              {data?.commissionPercentage ? (
                                <div className="d-flex justify-content-center w-50 ">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "50px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {`CP ${data?.commissionPercentage}%`}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}

                              {data.role >= 2 ? (
                                <div className="d-flex justify-content-center ">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "50px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {data?.currencyData.code || ""}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <span className="value fw-medium">{totalCommissionCharge(data)}</span>{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              (
                              {convertToINR(
                                removeCommasFromString(totalCommissionCharge(data)),
                                data.currencyData.value
                              )}
                              )
                            </span>
                          </td>
                          <td>
                            <span className="value fw-medium">{ourCommissionValue(data)}</span>{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              ({convertToINR(removeCommasFromString(ourCommissionValue(data)), data.currencyData.value)}
                              )
                            </span>
                          </td>
                          <td>
                            <span className="value fw-medium">{clientShareCommission(data)}</span>{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              (
                              {convertToINR(
                                removeCommasFromString(clientShareCommission(data)),
                                data.currencyData.value
                              )}
                              )
                            </span>
                          </td>
                          <td>
                            <span className="value fw-medium ">{netCommissionIncome(data)}</span>{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              (
                              {convertToINR(removeCommasFromString(netCommissionIncome(data)), data.currencyData.value)}
                              )
                            </span>
                          </td>
                          <td>
                            <span className="value fw-medium">{clientBackCommission(data)}</span>{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              (
                              {convertToINR(
                                removeCommasFromString(clientBackCommission(data)),
                                data.currencyData.value
                              )}
                              )
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>

                {/* </CardBody> */}
              </table>
              {loading === false && commissionData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow
                rowCount={rowCount}
                setRowCount={setRowCount}
                keyVal={currentPage}
                setCurrPage={setCurrentPage}
              />

              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </CardFooter>
        </Card>
      </Container>
    </Fragment>
  );
};

export default CommissionReports;
