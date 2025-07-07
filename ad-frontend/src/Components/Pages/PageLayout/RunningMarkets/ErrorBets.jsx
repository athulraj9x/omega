import React, { memo, useCallback } from "react";
import { Card, Container, Col, CardBody, Row, Label, Button, CardFooter } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Breadcrumbs } from "../../../../AbstractElements";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getErrorBets,
  changeStatusErrorBet,
  getDbSports,
  getDbLeagues,
} from "../../../../redux/action";
import { useSelector } from "react-redux";
import { useState } from "react";
import Loader from "../../../../Layout/Loader";
import { createOption, notifySuccess } from "../../../../utils/helper";
import Select from "react-select";
import { formatDate } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import ChangeStatusModal from "./DeleteModal";
import { PAGINATION } from "../../../../Constant";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";

const ErrorBets = memo(() => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.GetAllBets?.loading);
  const [myMarketData, setMyMarketData] = useState([]);
  const [socketData, setSocketData] = useState({});
  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [sport, setSport] = useState("");
  const [leagueSelect, setLeagueSelect] = useState("");
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(1);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage); // Current selected row count
  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const leagueData = useSelector((state) => state?.GetDbLeagues?.leagueData);
  const leagueDataLoading = useSelector(
    (state) => state?.GetDbLeagues?.loading
  );
  const [isFormAvailable, setIsFormAvailable] = useState(false);

  useEffect(() => {
    const handleNewBet = (data) => {
      getAllErrorBets();
    };

    socket.on("new-bet", handleNewBet);

    return () => {
      socket.off("new-bet", handleNewBet);
    };
  }, [socket]);

  useEffect(() => {
    getAllErrorBets();
  }, [rowCount,
    currentPage]);

  const getAllErrorBets = useCallback(() => {
    dispatch(
      getErrorBets({
        perPage: rowCount,
        page: currentPage,
        type: "errorbets",
        callback: (data) => {
          setTotalPages(data?.meta?.totalPages);
          setMyMarketData(data?.data);
        },
      })
    );
  }, [myMarketData, rowCount,
    currentPage]);

  const changeStatus = (id) => {
    dispatch(
      changeStatusErrorBet({
        id,
        callback: (data) => {
          if (data?.meta.code === 200) {
            notifySuccess(data?.meta?.message);
            getAllErrorBets();
          }
        },
      })
    );
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const handleSportSelect = async (option, field) => {
    if (option?.value !== "sport") {
      setSport(option);
    }
    field.onChange(option?.value);
    const sportId = option?.value;
  };
  const handleLeagueSelect = async (option, field) => {
    if (option?.value !== "league") {
      setLeagueSelect(option);
    }
    field.onChange(option?.value);
    const legaueId = option?.value;
  };

  useEffect(() => {
    dispatch(getDbSports());
  }, []);
  useEffect(() => {
    let data = createOption(sportData);
    setsportOption(data);
  }, [sportData]);
  useEffect(() => {
    let league = createOption(leagueData);
    setLeagueOption(league);
  }, [leagueData]);

  useEffect(() => {
    if (sport !== undefined) {
      if (sport !== "") {
        setIsFormAvailable(true);
        dispatch(
          getDbLeagues({
            sportId: sport?.value,
            callback: () => {
              setIsFormAvailable(false);
            },
          })
        );
      }
    }
  }, [sport]);

  const getFilteredData = () => {
    const payload = {
      sport: sport.value,
      leagueSelect: leagueSelect.value,
      perPage: rowCount,
      page: currentPage,
      type: "filter",
    };
    dispatch(
      getErrorBets({
        payload,
        callback: (data) => {
          setTotalPages(data?.meta?.totalPages);
          setMyMarketData(data?.data);
        },
      })
    );
  };

  const reset = () => {
    setSport(""); 
    setLeagueSelect(""); 
    getAllErrorBets();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("MY_MARKET")}
        title={title?.title}
        parent={title?.parent}
      />
      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Col sm="12">
          <form onSubmit={handleSubmit(getFilteredData)}>
            <Card className="">
              <CardBody>
                <Row className="d-flex flex-col flex-wrap">
                  <Col md="4 mb-3" className="">
                    <Label htmlFor="validationCustom01">
                      {t("SELECT_SPORTS")}
                    </Label>
                    <Controller
                      name="sportsId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={sportOption}
                          className="mySelect"
                          placeholder={t("SELECT_DOT")}
                          value={sport}
                          onChange={(option) => {
                            handleSportSelect(option, field);
                            setIsRoleSelectOpen(false);
                          }}
                          menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                          onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                          onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                        />
                      )}
                    />
                    <span className="text-danger">
                      {errors.sportId && t("FIELD_REQUIRED")}
                    </span>
                  </Col>

                  <Col md="4 mb-3" className="">
                    <Label htmlFor="validationCustom01">
                      {t("SELECT_LEAGUE")}
                    </Label>
                    <Controller
                      name="leagueId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={leagueOption}
                          isLoading={leagueDataLoading}
                          className="mySelect"
                          value={leagueSelect}
                          placeholder={t("SELECT_DOT")}
                          onChange={(option) => {
                            handleLeagueSelect(option, field);
                            setIsRoleSelectOpen2(false);
                          }}
                          menuIsOpen={isRoleSelectOpen2} // Set menuIsOpen based on state
                          onFocus={() => setIsRoleSelectOpen2(true)} // Open menu on focus
                          onBlur={() => setIsRoleSelectOpen2(false)} // Close menu on blur
                        />
                      )}
                    />
                    <span className="text-danger">
                      {errors.leagueId && t("FIELD_REQUIRED")}
                    </span>
                  </Col>
                </Row>
                <Row className="">
                  <Col>
                    <Button
                      style={{ marginRight: "10px" }}
                      type="submit"
                      outline
                      color="success"
                    >
                      {t("SUBMIT")}
                    </Button>
                    <Button
                      color="info"
                      outline
                      onClick={() => reset()}
                      type="button"
                    >
                      {t("RESET")}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </form>
        </Col>
        <Card className="p-0">
          <div
            className="overflow-auto"
            style={{ height: "62vh", position: "relative" }}
          >
            <table responsive className="table table-bordered table-hover ">
              <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                <tr className="text-left" style={{ border: "none " }}>
                  <th className="text-uppercase text-nowrap">
                    {t("USERNAME")}
                  </th>
                  <th className="text-uppercase text-nowrap">{t("EVENT")}</th>
                  <th className="text-uppercase text-nowrap">
                    {t("selection")}
                  </th>
                  <th className="text-uppercase text-nowrap">
                    {" "}
                    {t("Betting Type")}
                  </th>
                  <th className="text-uppercase text-nowrap">{t("ODDS")}</th>
                  <th className="text-uppercase text-nowrap">{t("STAKE")}</th>
                  <th className="text-uppercase text-nowrap">
                    {t("Betfair(%)")}
                  </th>
                  <th className="text-uppercase text-nowrap">{t("SPORT")}</th>
                  <th className="text-uppercase text-nowrap">{t("DATE")}</th>
                  <th className="text-uppercase text-nowrap">
                    {t("Change Status")}
                  </th>
                </tr>
              </thead>

              {myMarketData?.map((item, index) => {
                return (
                  <tbody
                    className={`${item?.bettingType === "LINE"
                      ? item?.selectionType === "back"
                        ? "table-danger"
                        : item?.selectionType === "lay"
                          ? "table-primary"
                          : "table-danger"
                      : item?.selectionType === "back"
                        ? "table-primary"
                        : "table-danger"
                      }`}
                    key={index}
                  >
                    <tr className="text-left" key={index}>
                      <td>{item?.userId?.username}</td>
                      <td>{item?.eventId?.name}</td>
                      <td>{item?.selection}</td>
                      <td>{item?.bettingType}</td>
                      <td>{item?.odds}</td>
                      <td>{item?.stake?.toFixed(2)}</td>
                      <td>{item?.betFairPercentage}</td>
                      <td>{item?.sportId?.name}</td>
                      <td>{formatDate(item?.createdAt)}</td>
                      <td>
                        {/* <button
                          className="btn text-white"
                          style={{ backgroundColor: "rgb(115, 103, 253)" }}
                          onClick={() => changeStatus(item?._id)}
                        >
                          Change
                        </button> */}
                        <ChangeStatusModal key={item._id} item={item} changeStatus={changeStatus} />
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            {loading === false && myMarketData?.length === 0 && (
              <div className="d-flex justify-content-center">
                <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
              </div>
            )}
          </div>
          <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow
                rowCount={rowCount}
                setRowCount={setRowCount}
                // keyVal={currentPage}
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
});

export default ErrorBets;
