import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import CachedIcon from "@mui/icons-material/Cached";
import { FiRefreshCw } from "react-icons/fi";
import Select from "react-select";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import { Breadcrumbs, Btn } from "../../../../AbstractElements";
import {
  BETTING_TYPES,
  MARKETS_TYPES,
  MARKET_TYPES,
  ManagerRoles,
  PAGINATION,
  defaultResultValues,
} from "../../../../Constant";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import {
  addResult,
  getDbRunners,
  getDbSports,
  getManageEventData,
  getResult,
  eventDeActivate,
  rollBack,
} from "../../../../redux/action";
import { capitalizeFirstLetter, createOption } from "../../../../utils/helper";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import {  HorseRelatedSportsName } from "../../../../utils/constants";

const Results = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //Accessing States
  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const allEventDatas = useSelector((state) => state?.ManageEvents?.manageData);
  const runnersData = useSelector((state) => state?.GetDbRunners?.runnerData);
  const adminData = useSelector((state) => state.Login.userData);

  const sportLoading = useSelector((state) => state?.GetDbSports?.loading);
  const eventLoading = useSelector((state) => state?.ManageEvents?.loading);
  //States of Component
  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [eventOption, setEventOption] = useState([]);
  const [marketOption, setMarketOption] = useState([]);
  const [resultsOption, setResultsOption] = useState([]);
  const [sport, setSport] = useState("");
  const [resultData, setResultData] = useState([]);
  const [event, setEvent] = useState("");
  const [league, setLeague] = useState("");
  const [marketType, setMarketType] = useState("");
  const [market, setMarket] = useState("");
  const [result, setResult] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isSubmit, setIsSubmit] = useState(false);
  const [btnActive, setBtnActive] = useState(0);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalDataCount, setTotalDataCount] = useState(1);
  const [load, setLoad] = useState(false);
  const [filteredResultData, setFilteredResultData] = useState([]);
  const [rotatingRows, setRotatingRows] = useState({});
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [isRoleSelectOpen3, setIsRoleSelectOpen3] = useState(false);
  const [isRoleSelectOpen4, setIsRoleSelectOpen4] = useState(false);
  const [isRoleSelectOpen5, setIsRoleSelectOpen5] = useState(false);
  const [isRoleSelectOpen6, setIsRoleSelectOpen6] = useState(false);

  const [totalPages, setTotalPages] = useState(0);

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

  /* ---------------- //For getting data for sports Select tag ---------------- */
  useEffect(() => {
    const data = createOption(sportData);

    const sortedCricket = data?.filter(item => HorseRelatedSportsName?.some(some => some?.sportsName !== item?.label))?.sort((a, b) => {
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
    if (allEventDatas !== null) {
      let data = createOption(allEventDatas?.data?.leagues, "events");
      setLeagueOption(data);
    }
  }, [allEventDatas]);

  /* -------------------- //Create Option for Runners Data -------------------- */
  useEffect(() => {
    let data = createOption(
      runnersData?.data?.runners,
      "events",
      runnersData?.data?.runners[0].runnerName
    );
    if (marketType?.value !== "fancy" && data !== undefined) {
      data = [...data, ...defaultResultValues];
    }
    setResultsOption(data);
  }, [runnersData]);

  /* -------------- //Handles the selection of sport to call API -------------- */

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
    setMarketOption([]);
    field.onChange(option?.value);
    const id = option?.value;
    const result = true;
    dispatch(
      getManageEventData({
        id,
        result,
      })
    );
  };

  /* -------------- //Handles the selection of League  ------------- */
  const handleLeagueSelect = async (option, field) => {
    setLeague(option);
    setEvent("");
    setMarketType("");
    setMarket("");
    field.onChange(option?.value);
    if (option?.events) {
      const data = createOption(option?.events, "markets");
      setEventOption(data);
    }
  };

  /* --------------------- //Handle the selection of event -------------------- */
  const handleEventSelect = async (option, field) => {
    setEvent(option);
    setMarketType("");
    field.onChange(option?.value);
  };

  /* ----------------------- //Handle the Selection of Event Type  ----------------------- */
  const handleMarketTypeSelect = async (option, field) => {
    setMarketType(option);
    setMarket("");
    field.onChange(option?.value);
    let market = null;
    if (option?.value === "fancy") {
      market = event?.markets?.filter((mrkt) => mrkt.type === option?.value);
    } else {
      market = event?.markets?.filter(
        (mrkt) => mrkt.bettingType === option?.value
      ); /// wirjrlkjrk
    }
    if (option.value === "bookmaker") {
      market = event?.markets?.filter(
        (mrkt) => mrkt?.marketName.toUpperCase() === option?.value
      );
      market = event?.markets.filter((mrkt) => mrkt.type === option?.value);
    }

    let data;

    data = createOption(market);

    setMarketOption(data);
  };

  /* ------------------------- //Handle the selection of Market  ------------------------- */
  const handleMarketSelect = async (option, field) => {
    setMarket(option);
    field.onChange(option?.value);
    if (marketType?.value !== "LINE" && marketType?.value !== "fancy") {
      dispatch(getDbRunners({ marketId: option?.value }));
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
    setResult("");
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

  /* -------------------------- //Getting Results Data and setting Count of Datas -------------------------- */

  const fetchResultData = useCallback(() => {
    setLoading(true);
    dispatch(
      getResult({
        type: MARKET_TYPES[btnActive].value,
        page: currentPage,
        perPage: PAGINATION.perPage,
        search: searchValue,
        callback: (data) => {
          setResultData(data?.data);
          setFilteredResultData(data?.data); // Initialize filtered data with fetched data
          // const totalPages = Math.ceil(totalDataCount / PAGINATION?.perPage);
          setTotalPages(data.meta.count);
          setLoading(false);
        },
      })
    );
  }, [dispatch, btnActive, searchValue, currentPage, load]);

  const handleRollBackClick = (e, result, index) => {
    e.preventDefault();
    setRotatingRows((prevRotatingRows) => ({
      ...prevRotatingRows,
      [index]: !prevRotatingRows[index],
    }));

    let data = {
      id: result._id,
      sportsId: result.sportId,
      leagueId: result.leagueId,
      eventId: result.eventId,
      marketId: result.marketId,
      market_type: result.type,
    };
    dispatch(
      rollBack({
        data,
        callback: (data) => {
          fetchResultData();
        },
      })
    );
  };

  useEffect(() => {
    fetchResultData();
  }, [fetchResultData]);
  //Handle Table Type Change
  const handleTypes = (type, index) => {
    setBtnActive(index);
  };

  //Handle Search for call Api with Search value
  // let timerId;
  // const handleSearch = (e) => {
  //   if (timerId) clearInterval(timerId);
  //   timerId = setTimeout(() => {
  //     setSearchValue(e.target.value);
  //   }, 1000);
  // };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to handle the search logic
  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery?.length > 0) {
      const filteredData = resultData.filter((result) => {
        return (
          result?.declaredBy?.toLowerCase()?.includes(searchQuery) ||
          result?.sport?.toLowerCase()?.includes(searchQuery) ||
          result?.league?.toLowerCase()?.includes(searchQuery) ||
          result?.event?.toLowerCase()?.includes(searchQuery) ||
          result?.market?.toLowerCase().includes(searchQuery) ||
          result?.type?.toLowerCase()?.includes(searchQuery) ||
          result?.result?.toLowerCase()?.includes(searchQuery) ||
          new Date(result?.date)
            ?.toLocaleString()
            ?.toLowerCase()
            ?.includes(searchQuery)
        );
      });
      setFilteredResultData(filteredData);
    } else {
      setFilteredResultData(resultData);
    }
  };

  const handleSubmitClick = () => {

  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("RESULTS")}
        title={title?.title}
        parent={title?.parent}
      />
      <Container fluid={true}>
        {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
          <Row>
            <Col sm="12" className="px-3">
              <Card className="px-2">
                <CardBody>
                  <Form
                    className="needs-validation"
                    noValidate=""
                    id="result"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Row className="d-flex flex-col flex-wrap">
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom01">
                          {t("SELECT_SPORTS")}
                        </Label>
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
                              menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.sportsId && t("FIELD_REQUIRED")}
                        </span>
                      </Col>
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom02">
                          {t("SELECT_LEAGUE")}
                        </Label>
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
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom03">
                          {t("SELECT_EVENT")}
                        </Label>
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
                              onChange={(option) => {
                                handleEventSelect(option, field);
                                setIsRoleSelectOpen3(false);
                              }}
                              menuIsOpen={isRoleSelectOpen3} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen3(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen3(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.eventId && t("FIELD_REQUIRED")}
                        </span>
                      </Col>
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom04">
                          {t("BETTING_TYPE")}
                        </Label>
                        <Controller
                          name="betting_type"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={BETTING_TYPES}
                              placeholder={t("SELECT_DOT")}
                              value={marketType}
                              onChange={(option) => {
                                handleMarketTypeSelect(option, field);
                                setIsRoleSelectOpen4(false);
                              }}
                              menuIsOpen={isRoleSelectOpen4} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen4(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen4(false)} // Close menu on blur
                            />
                          )}
                        />

                        <span className="text-danger">
                          {errors.market_type && t("FIELD_REQUIRED")}
                        </span>
                      </Col>
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom05">
                          {t("SELECT_MARKET")}
                        </Label>
                        <Controller
                          name="marketId"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={marketOption}
                              placeholder={t("SELECT_DOT")}
                              value={market}
                              onChange={(option) => {
                                handleMarketSelect(option, field);
                                setIsRoleSelectOpen5(false);
                              }}
                              menuIsOpen={isRoleSelectOpen5} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen5(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen5(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.marketId && t("FIELD_REQUIRED")}
                        </span>
                      </Col>

                      <Col md="4 mb-3" className="">
                        {market && (
                          <>
                            <Label htmlFor="validationCustom06">
                              {t("SELECT_RESULT")}
                            </Label>
                            {marketType.value === "LINE" ||
                              marketType.value === "fancy" ? (
                              <Controller
                                name="result"
                                control={control}
                                rules={{ required: "This field is required" }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    value={field.value || ""}
                                    type="text"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                            ) : (
                              <Controller
                                name="result"
                                control={control}
                                rules={{ required: "This field is required" }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    className="mySelect"
                                    options={resultsOption}
                                    placeholder={t("SELECT_DOT")}
                                    value={result}
                                    onChange={(option) => {
                                      setResult(option);
                                      field.onChange(option?.label);
                                      setIsRoleSelectOpen6(false);
                                    }}
                                    menuIsOpen={isRoleSelectOpen6} // Set menuIsOpen based on state
                                    onFocus={() => setIsRoleSelectOpen6(true)} // Open menu on focus
                                    onBlur={() => setIsRoleSelectOpen6(false)} // Close menu on blur
                                  />
                                )}
                              />
                            )}
                          </>
                        )}
                        <span className="text-danger">
                          {errors.result && t("FIELD_REQUIRED")}
                        </span>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter className="py-3 text-center text-md-start">
                  <Button
                    className="mx-2"
                    form="result"
                    type="submit"
                    color="success"
                    // disabled={isSubmit}
                    onClick={handleSubmitClick}
                  >
                    {t("SUBMIT")}
                  </Button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#CCC" }}
                    onClick={handleCancel}
                  >
                    {t("RESET")}
                  </button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        )}
        <Row className="px-3">
          <Card className="px-0">
            <CardHeader className="py-3 ">
              <Row className="d-flex gap-3 justify-content-between">
                <Col sm="4">
                  <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                      <input
                        className="form-control"
                        type="search"
                        onChange={handleSearch}
                        placeholder={`${t("SEARCH")}...`}
                      />
                    )}
                  />
                </Col>
                {/* //Button Group */}
                <Col xl="4" sm="6" className={`xl-50`}>
                  <ButtonGroup
                    className={
                      "btn-group-pill float-start float-md-end mt-2 mt-md-0"
                    }
                    style={{ zIndex: 0 }}
                  >
                    {MARKET_TYPES?.map((type, index) => (
                      <Btn
                        key={index}
                        attrBtn={{
                          active: btnActive === index ? true : false,
                          size: "",
                          color: "primary",
                          outline: true,
                          onClick: () => {
                            handleTypes(type?.value, index);
                          },
                        }}
                      >
                        {t(type?.label)}
                      </Btn>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              {loading && (
                <div className="d-flex justify-content-center align-items-center">
                  <Loader />
                </div>
              )}
              <Col md="12">
                <div
                  className="overflow-auto"
                  style={{ height: "62vh", position: "relative", zIndex: 0 }}
                >
                  <table
                    responsive
                    className="table table-bordered table-hover "
                  >
                    <thead
                      className="table-light sticky-top"
                      style={{ zIndex: 1 }}
                    >
                      <tr className="text-left" style={{ border: "none " }}>
                        <th>{t("DECLARED_BY")}</th>
                        <th>{t("SPORT")}</th>
                        <th>{t("LEAGUE")}</th>
                        <th>{t("EVENT")}</th>
                        <th>{t("MARKET")}</th>
                        <th>{t("TYPE")}</th>
                        <th>{t("RESULT")}</th>
                        <th>{t("DATE")}</th>
                        <th>{t("ACTION")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResultData !== null &&
                        filteredResultData?.map((result, index) => {
                          const isRotating = rotatingRows[index];
                          const iconStyle = {
                            transform: isRotating
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s",
                            cursor: "pointer", // Add cursor style for clickable icons
                            color: " #54ba4a",
                          };

                          return (
                            <tr className="text-left" key={index}>
                              {result?.declaredBy === "auto" ? <td>{capitalizeFirstLetter(result?.declaredBy)}</td> : <td>
                                {capitalizeFirstLetter(result?.declaredBy)} [{result?.declared_by_userId === undefined ? "" : capitalizeFirstLetter(result?.declared_by_userId)}]
                              </td>}

                              <td>{result?.sport}</td>
                              <td>{result?.league}</td>
                              <td>{result?.event}</td>
                              <td>{result?.market}</td>
                              <td>{capitalizeFirstLetter(result?.type)}</td>
                              <td>{result?.result}</td>
                              <td>
                                {new Date(result?.date)?.toLocaleString()}
                              </td>
                              <td>
                                <span
                                  onClick={(e) =>
                                    handleRollBackClick(e, result, index)
                                  }
                                  className="d-flex justify-content-center"
                                >
                                  <FiRefreshCw style={iconStyle} />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {loading === false &&
                    (filteredResultData?.length === 0 ||
                      filteredResultData === null) && (
                      <div className="d-flex justify-content-center">
                        <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                      </div>
                    )}
                </div>
              </Col>
              <Col xl="12" className="py-3 px-4">
                <PaginationButtons
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </Col>
            </CardBody>
          </Card>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Results;
