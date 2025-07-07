import React from "react";
import { Fragment } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Breadcrumbs } from "../../../../AbstractElements";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { SportPriority, filters } from "../../../../Constant";
import { createOption, findAdminParent } from "../../../../utils/helper";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getDeletedBet, getbetFilters } from "../../../../redux/action";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

const DeletedBetsReport = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const location = useLocation();
  const { t } = useTranslation();
  const adminData = useSelector((state) => state.Login.userData);
  const {
    control,
    formState: { errors },
    reset,
  } = useForm();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [loading, setLoading] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filtercategories, setFilterCategories] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState({});

  useEffect(() => {
    if (!isChecked) {
      let data = {
        category: selectedcategory?.value,
        filter: selectedFilter?.value,
      };
      if (isChecked) {
        data = { ...data, startDate, endDate, isChecked };
      }
      fetchBetsData(data);
    }
  }, [selectedcategory, isChecked]);

  const handleSearch = () => {
    let data = {
      category: selectedcategory?.value,
      filter: selectedFilter?.value,
      startDate,
      endDate,
      isChecked,
    };
    fetchBetsData(data);
  };

  const fetchBetsData = (data) => {
    dispatch(
      getDeletedBet({
        data,
        callback: (data) => {
          setFilteredData(data?.data);
        },
      })
    );
  };

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    dispatch(
      getbetFilters({
        data: option?.value,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            if (option?.value === "sports") {
              data?.data?.sort((a, b) => {
                const priorityA = SportPriority[a.slugName] || 9999;
                const priorityB = SportPriority[b.slugName] || 9999;

                return (
                  priorityA - priorityB || a.slugName.localeCompare(b.slugName)
                );
              });
            }

            const options = createOption(data?.data);

            setFilterCategories(options);
          }
        },
      })
    );
  };

  const handleCategoryChange = (option) => {
    setSelectedCategory(option);
  };

  const createDataObj = (row, isAdmin) => {
    const parent = findAdminParent(row?.userId?.parents, adminData?.role);
    const dataObj = {
      Username: row?.userId?.username
        ? ` ${row?.userId.username} (${parent?.parent_id?.username})`
        : " ",
      Selection: row?.selection,
      Odds: row?.odds,
      Stake: row?.stake,
      Date: row.date ? new Date(row.date).toLocaleString().split(",")[0] : "",
      SystemIp: row?.userId?.ip_address?.browser_ip,
      BroswerIp: row?.userId?.ip_address?.system_ip,
    };
    return dataObj;
  };
  const convertToExcel = () => {
    try {
      const customizedData = filteredData.map((row) =>
        createDataObj(row, false)
      );
      const ws = utils.json_to_sheet(customizedData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, "DeletedbetReports"+'.xlsx');
    } catch (err) {
      //console.error(err.message)
    }
  };

  const pdfGenerator = () => {
    try {
      const doc = new jsPDF();
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(14);
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
      const body = filteredData?.map((row) => {
        const parent = findAdminParent(row?.userId?.parents, adminData?.role);
        return [
          ` ${row?.userId?.username} (${parent?.parent_id?.username})`,
          row?.selection,
          row?.odds,
          row?.stake,
          new Date(row?.createdAt)?.toLocaleString(),
          row?.userId?.ip_address?.browser_ip,
          row?.userId?.ip_address?.system_ip,
        ];
      });
      doc.autoTable({
        head: [
          [
            "Username",
            "Selection",
            "Odds",
            "Stake",
            "Date",
            "System IP",
            "Broswer IP",
          ],
        ],
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
    } catch (err) {
      //console.error(err.message)
    }
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("DELETED_BETS_REPORTS")}
        title={title?.title}
        parent={title?.parent}
      />

      <Container fluid={true}>
        {/* {reportsData?.loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )} */}
        <Card>
          <CardHeader className="py-3">
            <Row className="mb-3">
              <div className="d-flex align-items-center gap-3">
                <label className="input-border mt-2">
                  <input
                    type="checkbox"
                    onChange={() => setIsChecked(!isChecked)}
                  />
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
                    onClick={pdfGenerator}
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
              </div>
            </Row>
            <Row className="align-items-center">
              <Col md="4">
                <label>Filter By:</label>
                <Controller
                  name="action"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={filters}
                      className="mySelect"
                      value={selectedFilter}
                      placeholder={t("SELECT_DOT")}
                      onChange={(option) => {
                        handleFilterChange(option);
                        field.onChange(option?.value);
                      }}
                    />
                  )}
                />
              </Col>
              {selectedFilter && selectedFilter?.value !== "all" && (
                <Col md="4">
                  <label>Select {selectedFilter?.value}</label>
                  <Controller
                    name="action"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={filtercategories}
                        className="mySelect"
                        value={selectedcategory}
                        placeholder={t("SELECT_DOT")}
                        onChange={(option) => {
                          handleCategoryChange(option);
                          field.onChange(option?.value);
                        }}
                      />
                    )}
                  />
                </Col>
              )}
            </Row>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-auto" style={{ height: "66vh" }}>
              <table className="table table-responsive table-bordered table-hover">
                <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                  <tr style={{ border: "none " }}>
                    <th> {t("USER_PARENT")}</th>
                    <th> {t("SELECTION")}</th>
                    <th> {t("ODDS")}</th>
                    <th>{t("STAKE")}</th>
                    <th> {t("DATE")}</th>
                    <th> {t("SYSTEM_IP_ADDRESS")}</th>
                    <th> {t("BROWSER_IP_ADDRESS")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.map((bet, index) => {
                    let parent = findAdminParent(
                      bet?.userId?.parents,
                      adminData?.role
                    );
  
                    return (
                      <tr
                        className={`${
                          bet?.selectionType === "back"
                            ? "table-primary"
                            : "table-danger"
                        }`}
                        key={index}
                      >
                        <td className="py-2">
                          {bet?.userId?.username}&nbsp;[
                          {parent?.parent_id?.username}]
                        </td>
                        <td className="py-2">{bet?.selection}</td>
                        <td className="py-2">{bet?.odds}</td>
                        <td className="py-2">{bet?.stake?.toFixed(2)}</td>
                        <td className="py-2">
                          {new Date(bet?.createdAt)?.toLocaleString()}
                        </td>
                        <td className="py-2">
                          {bet?.userId?.ip_address?.system_ip
                            ? bet?.userId?.ip_address?.system_ip
                            : "-"}
                        </td>
                        <td className="py-2">
                          {bet?.userId?.ip_address?.browser_ip
                            ? bet?.userId?.ip_address?.browser_ip
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* {loading === false && filteredTransaction?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )} */}
            </div>
          </CardBody>
          <CardFooter className="py-3 text-center text-md-start"></CardFooter>
        </Card>
      </Container>
    </Fragment>
  );
};

export default DeletedBetsReport;
