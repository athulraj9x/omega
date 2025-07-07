import React, { Fragment, useEffect, useState } from "react";
import { CardHeader, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import { Breadcrumbs, Btn } from "../../../../AbstractElements";
import Select from "react-select";
import { MARKETS_TYPES, ManagerRoles, PAGINATION } from "../../../../Constant";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import {
  addResult,
  getDbSports,
  eventDeActivate,
  getLeaguesForReportAnalysis,
  getEventsForReportAnalysis,
  getLayerCurrency,
  getMarketAnalysisData,
  searchEventData,
} from "../../../../redux/action";
import {
  convertINRToCurrency,
  createLink,
  createOption,
  createOptionForReportAnalysis,
  formatDate,
} from "../../../../utils/helper";
import { useLocation, useNavigate } from "react-router";
import { dateFilter } from "../../../../utils/constants";

const ResultAnalysis = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  //Accessing States
  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const leagues = useSelector((state) => state?.GetLeaguesForReportAnalysisReducer?.leagues);
  const events = useSelector((state) => state.GetEventsForReportAnalysisReducer.events);
  const adminData = useSelector((state) => state.Login.userData);
  const sportLoading = useSelector((state) => state?.GetDbSports?.loading);
  const eventLoading = useSelector((state) => state?.ManageEvents?.loading);
  //States of Component
  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [eventOption, setEventOption] = useState([]);
  const [sport, setSport] = useState("");
  const [event, setEvent] = useState("");
  const [league, setLeague] = useState("");
  const [marketType, setMarketType] = useState("");
  const [market, setMarket] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isSubmit, setIsSubmit] = useState(false);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [load, setLoad] = useState(false);
  const [filteredResultData, setFilteredResultData] = useState([]);
  const [prevFilteredResultData, setPrevFilteredResultData] = useState([]);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [isRoleSelectOpen3, setIsRoleSelectOpen3] = useState(false);
  const [currency, setCurreny] = useState();
  const [currentType, setCurrentType] = useState("ALL");
  const [lastDate, setLastDate] = useState(1);
  const [datePreference, setDatePreference] = useState(false);
  const [hideCalender, sethideCalender] = useState(false);
  const [checkBoxDisable, setCheckBoxDisable] = useState(false);
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
  const [searchResult, setSearchResult] = useState([]);
  const [grandTotal, setGrandTotal] = useState({
    totalPl: 0,
    ActualPl: 0,
    totalClientShare: 0,
    totalCommissions: 0,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  //Invoking function for getting sport Data
  useEffect(() => {
    dispatch(getDbSports());
  }, []);
  const fetchData = async (from, to) => {
    setLoading(true);
    try {
      const data = await getMarketData(from, to);
      const updateFilteredResultData = (data) => {
        setPrevFilteredResultData(filteredResultData);
        setFilteredResultData(data);
      };

      updateFilteredResultData(data);

      setCurrentType("ALL");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (filteredResultData?.length > 0) {
      // Assuming `data` is an array of objects with properties like `pl`, `actualPl`, etc.
      const accumulatedValues = filteredResultData?.reduce(
        (acc, entry) => {
          acc.totalPl += entry.convertedTotalPl || 0;
          acc.ActualPl += entry.actualPl || 0;
          acc.totalClientShare += entry.clientShares || 0;
          const totalCommissionsForEntry =
            entry.entries?.reduce((commissionAcc, item) => {
              return commissionAcc + (item.convertedCommission || 0); // Sum up commissions in each entry
            }, 0) || 0;

          acc.totalCommissions += totalCommissionsForEntry;
          return acc;
        },
        {
          totalPl: 0,
          ActualPl: 0,
          totalClientShare: 0,
          totalCommissions: 0,
        }
      );

      // Update the grandTotal state with accumulated values
      setGrandTotal(accumulatedValues);
    }
  }, [filteredResultData]);

  useEffect(() => {
    if (!datePreference) {
      const selectedValue = lastDate ? parseInt(lastDate) : 1;
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const fromDate = selectedValue === 1 ? startOfDay : new Date(startOfDay);

      if (selectedValue !== 1) {
        fromDate.setDate(fromDate.getDate() - selectedValue);
      }

      const from = fromDate.toLocaleDateString("en-CA");
      const to = now.toISOString();

      fetchData(from, to);
    }
  }, [datePreference, lastDate]);

  /* ---------------- //For getting data for sports Select tag ---------------- */
  useEffect(() => {
    let data = createOption(sportData);

    let sortedCricket = data?.sort((a, b) => {
      if (a.label === "Cricket") {
        return -1; // "Cricket" comes first
      }
      if (b.label === "Cricket") {
        return 1; // "Cricket" comes first
      }
      return 0; // no change in order
    });

    setsportOption(sortedCricket);
  }, [sportData]);

  /* ------------------- //Creating option for leagues select ------------------- */
  useEffect(() => {
    if (leagues !== null) {
      let data = createOption(leagues?.data?.leagues);
      setLeagueOption(data);
    }
  }, [leagues]);

  useEffect(() => {
    if (events !== null) {
      let data = createOptionForReportAnalysis(events?.data?.events);
      setEventOption(data);
    }
  }, [events]);

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

  /* --------------------- Handles the selection of sport to call API -------------- */
  const handleSportSelect = async (option, field) => {
    if (option?.value !== "sport") {
      setSport(option);
      setLeague("");
      setEvent("");
      setMarketType("");
      setMarket("");
    }
    setLeagueOption([]);
    setEventOption([]);
    field.onChange(option?.value);
    const id = option?.value;
    dispatch(
      getLeaguesForReportAnalysis({
        id,
      })
    );
  };

  /* --------------------- Handles the selection of League  ------------- */
  const handleLeagueSelect = async (option, field) => {
    setLeague(option);
    setEvent("");
    setMarketType("");
    setMarket("");
    field.onChange(option?.value);
    const id = option.value;
    dispatch(
      getEventsForReportAnalysis({
        id,
      })
    );
  };

  /* --------------------- IN THE SELECTION BOX SELECT EVENTID -------------------- */
  //---------------------- RETURN A URL AND NAVIGATE INTO THAT URL WITH EVENT ID
  const handleEventSelect = async (option, field) => {
    try {
      setEvent(option);
      setMarketType("");
      field.onChange(option?.value);

      if (option.value !== undefined && option.value !== null) {
        const eventIdLink = await createLink(option.value);
        const encodedEventLink = encodeURIComponent(eventIdLink);
        navigate(`/reports/analysis/${encodedEventLink}`, {
          state: {
            eventid: option.value,
            eventIdLink: eventIdLink,
            encodedEventLink: encodedEventLink,
          },
        });
      } else {
        console.log("Error: option value is undefined or null in market analysis initial page");
      }
    } catch (error) {
      console.error("Error in handleEventSelect:", error);
    }
  };

  // HERE WE WILL PASS THE EVENT IS
  // IN EVENTVIEW COMPONENT IT WILL CATCH
  // WE ARE ENCODING THE EVENT URL AND RECEIVED IN EVENTID
  // IN EVENT-VIEW COMPONENT AND FETCH DETAILS FROM BACKEND
  const handleEventClick = async (eventId) => {
    try {
      if (eventId !== undefined && eventId !== null) {
        const eventIdLink = await createLink(eventId);
        const currentPage = lastDate;
        const encodedEventLink = encodeURIComponent(eventIdLink);
        navigate(`/reports/analysis/${encodedEventLink}?currentPage=${encodeURIComponent(currentPage)}`, {
          state: {
            eventid: eventId,
            eventIdLink: eventIdLink,
            encodedEventLink: encodedEventLink,
          },
        });
      } else {
        console.log("Invalid eventId:", eventId);
      }
    } catch (error) {
      console.log("Error in handleEventClick:", error);
    }
  };

  //Clearing all fields on click on cancel button
  const handleCancel = () => {
    reset();
    setSport("");
    setLeague("");
    setEvent("");
    setMarketType("");
    setMarket("");
    setMarketType("");
  };

  //handle the submit button click
  const onSubmit = (data, e) => {
    if (marketType?.value === "bookmaker") {
      data = { ...data, market_type: marketType?.value };
    } else {
      data = { ...data, market_type: MARKETS_TYPES.EXCH.toLowerCase() };
    }
    // alert("click");
    setLoading(true);
    // setIsSubmit(true);

    dispatch(
      addResult({
        data,
        callback: () => {
          handleCancel();
          setLoad(!load);
          setLoading(false);
          if (market?.label === "Match Odds") {
            let data = {
              market: market?.label,
              event_id: event?.value,
            };
            dispatch(eventDeActivate(data));
          }
        },
      })
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (query?.length > 3) {
      dispatch(
        searchEventData({
          keyword: query,
          callback: (data) => {
            if (data) {
              setSearchResult([]);
            } else {
              setSearchResult([]);
            }
          },
        })
      );
    }
  };
  const handleSearchFunction = debounce(handleSearch, 1000);

  const handleDatePreference = async (event) => {
    const selectedValue = parseInt(event.target.value);
    setLastDate(selectedValue);
  };

  const updateSelectedDate = (newMonth, newYear) => {
    const formattedMonth = String(newMonth).padStart(2, "0");
    setSelectedDate(`${newYear}-${formattedMonth}`);
    setMonth(newMonth);
    setYear(newYear);
    // Start date: 1st of the month
    const fromDate = new Date(newYear, newMonth - 1, 1); // The first day of the selected month
    // End date: Last day of the month
    const toDate = new Date(newYear, newMonth, 0);
    const from = fromDate.toISOString(); // ISO string for the first day
    const to = toDate.toISOString();
    fetchData(from, to);
  };
  const handleCheckboxChange = () => {
    if (!checkBoxDisable) {
      let startDate = new Date(`${year}-${month}-01`);

      let endDate = new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`);
      endDate.setDate(endDate.getDate() - 1);

      setStartDate(startDate.toISOString().split("T")[0]);
      setEndDate(endDate.toISOString().split("T")[0]);
      setDatePreference(true);
      setLastDate(1);
      sethideCalender(true);
    } else {
      setStartDate("");
      setEndDate("");
      setDatePreference(false);
      sethideCalender(false);
      setLastDate(1);
    }

    setCheckBoxDisable(!checkBoxDisable);
  };
  const handlePreviousMonth = (event) => {
    event.preventDefault();
    if (month === 1) {
      updateSelectedDate(12, year - 1);
    } else {
      updateSelectedDate(month - 1, year);
    }
  };

  const handleNextMonth = (event) => {
    event.preventDefault();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (month === currentMonth && year === currentYear) {
      return;
    }
    if (month === 12) {
      updateSelectedDate(1, year + 1);
    } else {
      updateSelectedDate(month + 1, year);
    }
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    const [year, month] = dateValue.split("-");
    setMonth(Number(month));
    setYear(Number(year));
    const fromDate = new Date(year, month - 1, 0);
    // Calculate the last day of the month (to date)
    const toDate = new Date(year, month, 1);
    const from = fromDate.toISOString();
    const to = toDate.toISOString();
    fetchData(from, to);
  };
  const setEndDateAndFetch = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    const from = new Date(startDate).toISOString();
    const to = new Date(newEndDate).toISOString();
    fetchData(from, to);
  };
  function formatNumbers(input) {
    const inputString = String(input);
    const firstPart = inputString.split(" ")[0];
    const formattedNumber = parseFloat(firstPart)?.toFixed(2);
    return formattedNumber;
  }

  const getMarketData = (from, to) => {
    return new Promise((resolve, reject) => {
      try {
        dispatch(
          getMarketAnalysisData({
            from,
            to,
            callback: (data) => {
              try {
                const transformData = (data) => {
                  return data.sort((a, b) => {
                    if (a.date > b.date) return -1;
                    if (a.date < b.date) return 1;
                    return 0;
                  });
                };
                const responseData = transformData(data);
                resolve(responseData);
              } catch (error) {
                reject("Error in callback transformation:", error);
              }
            },
          })
        );
      } catch (error) {
        reject("Error in getMarketData:", error);
      }
    });
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resolvedData = await getMarketData(lastDate);
  //       const updateFilteredResultData = (newData) => {
  //         setPrevFilteredResultData(filteredResultData);
  //         setFilteredResultData(newData);
  //       };
  //       updateFilteredResultData(resolvedData);
  //       setCurrentType("ALL");
  //     } catch (error) {
  //       console.error("Error fetching market data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("Reports")} title={`Reports ${title?.title}`} parent={""} />

      <Container fluid={true}>
        {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
          <Row>
            <Col sm="12" className="px-3">
              <Card className="px-2">
                <CardBody>
                  <Form className="needs-validation" noValidate="" id="result" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-col flex-wrap">
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom01">{t("SELECT_SPORTS")}</Label>
                        <Controller
                          name="sportsId"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={sportOption}
                              placeholder={t("SELECT_DOT")}
                              className="mySelect"
                              isLoading={sportLoading}
                              value={sport}
                              onChange={(option) => {
                                handleSportSelect(option, field);
                                setIsRoleSelectOpen(false);
                              }}
                              menuIsOpen={isRoleSelectOpen}
                              onFocus={() => setIsRoleSelectOpen(true)}
                              onBlur={() => setIsRoleSelectOpen(false)}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.sportsId && t("FIELD_REQUIRED")}</span>
                      </Col>

                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom02">{t("SELECT_LEAGUE")}</Label>
                        <Controller
                          name="leagueId"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={sport ? leagueOption : []}
                              placeholder={t("SELECT_DOT")}
                              value={league}
                              isLoading={eventLoading}
                              onChange={(option) => {
                                handleLeagueSelect(option, field);
                                setIsRoleSelectOpen2(false);
                                setLeague(option);
                                field.onChange(option?.value);
                              }}
                              menuIsOpen={isRoleSelectOpen2}
                              onFocus={() => setIsRoleSelectOpen2(true)}
                              onBlur={() => setIsRoleSelectOpen2(false)}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.leagueId && t("FIELD_REQUIRED")}</span>
                      </Col>

                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom03">{t("SELECT_EVENT")}</Label>
                        <Controller
                          name="eventId"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              placeholder={t("SELECT_DOT")}
                              options={eventOption}
                              value={event}
                              getOptionLabel={(option) =>
                                `${option.label} - ${new Date(option.date).toLocaleDateString()}`
                              }
                              onChange={(option) => {
                                handleEventSelect(option, field);
                                setIsRoleSelectOpen3(false);
                              }}
                              menuIsOpen={isRoleSelectOpen3}
                              onFocus={() => setIsRoleSelectOpen3(true)}
                              onBlur={() => setIsRoleSelectOpen3(false)}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.eventId && t("FIELD_REQUIRED")}</span>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="px-3">
          <Card className="px-0">
            {currentType === "ALL" && (
              <CardHeader className="py-3 ">
                {/* <Col sm="4">
                  <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                      <input
                      {...field} 
                      className="form-control p-2"
                      type="search"
                      onChange={(e) => {
                        field.onChange(e);
                        handleSearchFunction(e);
                      }}
                      placeholder="Search Event Name..."
                    />
                    )}
                  />
                </Col> */}

                <Row className="d-flex gap-3 justify-content-between">
                  <Col>
                    <form>
                      <div className="form-row align-items-center">
                        <div className="col-auto my-1">
                          <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
                            Preference :- Last
                          </label>
                          <select
                            className="custom-select m-2 rounded p-2"
                            id="inlineFormCustomSelect"
                            value={lastDate}
                            disabled={datePreference}
                            onFocus={() => {
                              sethideCalender(true);
                              // setCheckBoxDisable(true)
                              setStartDate("");
                              setEndDate("");
                            }}
                            onBlur={() => {
                              sethideCalender(false);
                            }}
                            onChange={handleDatePreference}
                          >
                            {dateFilter.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.value}
                              </option>
                            ))}
                          </select>
                          <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
                            Days
                          </label>
                        </div>
                      </div>
                    </form>
                  </Col>
                  <Col className="">
                    <form>
                      <span className="m-3 p-2 rounded w-15 bg-transparent">
                        <input
                          type="checkbox"
                          onChange={handleCheckboxChange}
                          checked={checkBoxDisable}
                          className="mr-2"
                          style={{ width: "15px", height: "15px", margin: "auto" }}
                        />
                        <input
                          type="date"
                          className="m-2 px-2 py-1 rounded w-15 border bg-transparent"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          disabled={!checkBoxDisable}
                          max={endDate}
                        />
                        <span>To</span>
                        <input
                          type="date"
                          className="m-2 px-2 py-1 rounded w-15 border bg-transparent"
                          value={endDate}
                          onChange={(e) => {
                            setEndDateAndFetch(e);
                          }}
                          disabled={!checkBoxDisable}
                          min={startDate}
                          // max={new Date().toISOString().split("T")[0]}
                        />
                      </span>

                      {/* whole month picker        */}
                      <span className="m-4 p-2 rounded w-15 border bg-transparent">
                        <button
                          className="ml-4 p-2 w-15 border-0 bg-transparent"
                          onClick={(e) => {
                            handlePreviousMonth(e);
                          }}
                          disabled={hideCalender}
                        >
                          &larr;
                        </button>
                        <input
                          type="month"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="m-1 p-2 w-15 border-0 bg-transparent"
                          onFocus={() => {
                            setDatePreference(true);
                            setLastDate(1);
                          }}
                          onBlur={() => {
                            setDatePreference(false);
                          }}
                          disabled={hideCalender}
                        />
                        <button
                          className="p-2 w-15 border-0 bg-transparent"
                          onClick={(e) => handleNextMonth(e)}
                          disabled={hideCalender}
                        >
                          &rarr;
                        </button>
                      </span>
                    </form>
                  </Col>
                </Row>
              </CardHeader>
            )}

            {/* INITIAL LOADING AND OTHER LOADING COMPONENT */}
            <CardBody className="p-0">
              {loading && (
                <div className="d-flex justify-content-center align-items-center">
                  <Loader />
                </div>
              )}

              {/* ALL VALUE MAPING FOR THE INITIAL RENDER IS HERE */}
              {/* SETCURRENTTYPE THERE IS A STATE FOR VIEW THE CURRENT TYPE */}
              {/* EXPECTED ALL MEANS INITAL VIEW */}
              {/* EVENT-VIEW MEANS OTHER VIEW OF EVENTS REUSEING THE SAME COMPONENT */}
              <Col md="12">
                <div className="overflow-auto" style={{ height: "auto", position: "relative", zIndex: 0 }}>
                  <table responsive className="table table-bordered table-hover ">
                    <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                      <tr className="text-left" style={{ border: "none " }}>
                        {currentType === "ALL" && <th style={{ minWidth: "100px", maxWidth: "110px" }}>{t("DATE")}</th>}

                        <th>{t(currentType === "ALL" ? "EVENTS" : "MARKETS")}</th>
                        {currentType === "EVENT-VIEW" && <th>{t("PATH")}</th>}
                        {currentType === "EVENT-VIEW" && <th>{t("VIEW BETS")}</th>}

                        <th>{t("TOTAL PL")}</th>
                        <th>{t("ACTUAL PL")}</th>
                        <th>{t("CLIENT SHARES")}</th>
                        <th>{t("COMMISSION")}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentType === "ALL" &&
                        filteredResultData !== null &&
                        filteredResultData?.map((element, index) => {
                          if (!element.eventId || !element.date) {
                            return null;
                          }
                          const totalCommissions = element.entries.reduce((acc, el) => {
                            return acc + (el.convertedCommission ?? 0);
                          }, 0);
                          // const ActualPLafterCommission= element.actualPl-totalCommissions;
                          return (
                            <tr className="text-left" key={index}>
                              <td style={{ maxWidth: "40px" }}>
                                {element?.entries?.[0]?.createdAt
                                  ? formatDate(element.entries[0].createdAt)
                                  : "No Date Available"}
                              </td>

                              <td className="text-primary" style={{ cursor: "pointer" }}>
                                <span style={{ cursor: "not-allowed" }}>{element?.sportsName}</span>
                                <span style={{ color: "black" }}>{` > `}</span>
                                <span style={{ cursor: "not-allowed" }}>{element?.leagueName}</span>
                                <span style={{ color: "black" }}>{` > `}</span>
                                <span
                                  onClick={() => {
                                    handleEventClick(element.eventId);
                                  }}
                                >
                                  {element?.eventName}
                                </span>
                              </td>
                              <td className={`${element?.convertedTotalPl > 0 ? "text-danger" : "text-success"}`}>
                                {/* {formatNumbers(-1 * element?.totalPl)} */}

                                {/* {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                     element?.totalPl?.toFixed(2),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                  :   element?.totalPl?.toFixed(2)} */}
                                {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                      element?.convertedTotalPl > 0
                                        ? +(-1 * element?.convertedTotalPl?.toFixed(2))
                                        : Math.abs(element?.convertedTotalPl?.toFixed(2)),
                                      parseFloat(adminData?.currencyId?.value)
                                    )
                                  : element?.convertedTotalPl > 0
                                  ? +(-1 * element?.convertedTotalPl?.toFixed(2))
                                  : Math.abs(element?.convertedTotalPl?.toFixed(2))}
                              </td>

                              <td className={`${element.actualPl > 0 ? "text-danger" : "text-success"}`}>
                                {/* {element?.actualPl
                                  ? (-1 * element?.actualPl).toFixed(2)
                                  : (0).toFixed(2)} */}

                                {/* {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                     element?.actualPl?.toFixed(2),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                  : element?.actualPl?.toFixed(2)} */}
                                {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                      element.actualPl > 0
                                        ? +(-1 * element.actualPl?.toFixed(2))
                                        : Math.abs(element.actualPl?.toFixed(2)),
                                      parseFloat(adminData?.currencyId?.value)
                                    )
                                  : element.actualPl > 0
                                  ? +(-1 * element.actualPl?.toFixed(2))
                                  : Math.abs(element.actualPl?.toFixed(2))}
                              </td>

                              <td className={`${element?.clientShares > 0 ? "text-danger" : "text-success"}`}>
                                {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                      element?.clientShares > 0
                                        ? +(-1 * element?.clientShares?.toFixed(2))
                                        : Math.abs(element?.clientShares?.toFixed(2)),
                                      parseFloat(adminData?.currencyId?.value)
                                    )
                                  : element?.clientShares > 0
                                  ? +(-1 * element?.clientShares?.toFixed(2))
                                  : Math.abs(element?.clientShares?.toFixed(2))}
                              </td>
                              <td className={`${totalCommissions > 0 ? "text-success" : "text-warning"}`}>
                                {adminData?.currencyId?.value
                                  ? convertINRToCurrency(
                                      parseFloat(totalCommissions?.toFixed(2)),
                                      parseFloat(adminData?.currencyId?.value)
                                    )
                                  : totalCommissions?.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      {filteredResultData !== null && filteredResultData?.length != 0 && (
                        <>
                          <th>Grand Total</th>
                          <td>&nbsp;</td>
                          <td className={`d-flex-col flex-column justify-content-center align-items-center`}>
                            <span>PL: </span>

                            <span className={`${grandTotal.totalPl > 0 ? "text-danger" : "text-success"}`}>
                              {adminData?.currencyId?.value
                                ? convertINRToCurrency(
                                    grandTotal.totalPl > 0
                                      ? +(-1 * grandTotal.totalPl?.toFixed(2))
                                      : Math.abs(grandTotal.totalPl?.toFixed(2)),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                : grandTotal.totalPl > 0
                                ? +(-1 * grandTotal.totalPl?.toFixed(2))
                                : Math.abs(grandTotal.totalPl?.toFixed(2))}
                            </span>
                          </td>
                          <td className={`d-flex-col flex-column justify-content-center align-items-center `}>
                            <span>ActualPL: </span>
                            <span className={`${grandTotal.ActualPl > 0 ? "text-danger" : "text-success"}`}>
                              {adminData?.currencyId?.value
                                ? convertINRToCurrency(
                                    grandTotal.ActualPl > 0
                                      ? +(-1 * grandTotal.ActualPl?.toFixed(2))
                                      : Math.abs(grandTotal.ActualPl?.toFixed(2)),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                : grandTotal.ActualPl > 0
                                ? +(-1 * grandTotal.ActualPl?.toFixed(2))
                                : Math.abs(grandTotal.ActualPl?.toFixed(2))}
                            </span>
                          </td>

                          <td className="d-flex-col flex-column justify-content-center align-items-center ">
                            <span>ClientShares: </span>
                            <span className={`${grandTotal.totalClientShare > 0 ? "text-danger" : "text-success"}`}>
                              {adminData?.currencyId?.value
                                ? convertINRToCurrency(
                                    grandTotal.totalClientShare > 0
                                      ? +(-1 * grandTotal.totalClientShare?.toFixed(2))
                                      : Math.abs(grandTotal.totalClientShare?.toFixed(2)),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                : grandTotal.totalClientShare > 0
                                ? +(-1 * grandTotal.totalClientShare?.toFixed(2))
                                : Math.abs(grandTotal.totalClientShare?.toFixed(2))}
                            </span>
                          </td>
                          <td className="d-flex-col flex-column justify-content-center align-items-center ">
                            <span>Commission: </span>
                            <span className={`${grandTotal.totalCommissions > 0 ? " text-success" : "text-danger"}`}>
                              {adminData?.currencyId?.value
                                ? convertINRToCurrency(
                                    grandTotal.totalCommissions > 0
                                      ? +(-1 * grandTotal.totalCommissions?.toFixed(2))
                                      : Math.abs(grandTotal.totalCommissions?.toFixed(2)),
                                    parseFloat(adminData?.currencyId?.value)
                                  )
                                : grandTotal.totalCommissions > 0
                                ? +(-1 * grandTotal.totalCommissions?.toFixed(2))
                                : Math.abs(grandTotal.totalCommissions?.toFixed(2))}
                            </span>
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
    </Fragment>
  );
};

export default ResultAnalysis;
