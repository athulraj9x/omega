import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row,
  CardFooter,
} from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import {
  getDbSports,
  getDbLeagues,
  getFancyStakeLimit,
  updateFancyStakeLimit,
  getCurrency
} from "../../../../redux/action";
import {
  createOption,
  notifySuccess,
  notifyWarning,
} from "../../../../utils/helper";

const FancyStakeSetting = () => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  var count = 0;
  var rowIndex = 1;
  const [defaultValuefancy, setDefaultValueFancy] = useState(100000);
  const [firstgroupedWicket, setFirstGroupedWicket] = useState(1000000);
  const [firstWicket, setFirstWicket] = useState(10000);
  const [firstWicketBalls, setFirstWicketBalls] = useState(100000);
  const [firstWicketBoundaries, setFirstWicketBoundaries] = useState(100000);
  const [lambi, setLambi] = useState(10000);
  const [over, setOver] = useState(10000);
  const [overbasedRuns, setOverBasedRuns] = useState(1000000);
  const [playersBased, setPlayerBased] = useState(100000);
  const [playerBoundaries, setPlayerBoundaries] = useState(100000);
  const [playerTotalBallFaced, setplayerTotalBallFaced] = useState(10000);
  const [runBasedOverRun, setRunBasedOverRun] = useState(100000);
  const [defaultValuefancyMatch, setDefaultValueFancyMatch] = useState(100000);
  const [firstgroupedWicketMatch, setFirstGroupedWicketMatch] =
    useState(100000);
  const [firstWicketMatch, setFirstWicketMatch] = useState(100000);
  const [firstWicketBallsMatch, setFirstWicketBallsMatch] = useState(100000);
  const [firstWicketBoundariesMatch, setFirstWicketBoundariesMatch] =
    useState(100000);
  const [lambiMatch, setLambiMatch] = useState(100000);
  const [overMatch, setOverMatch] = useState(100000);
  const [overbasedRunsMatch, setOverBasedRunsMatch] = useState(1000000);
  const [playersBasedMatch, setPlayerBasedMatch] = useState(100000);
  const [playerBoundariesMatch, setPlayerBoundariesMatch] = useState(100000);
  const [playerTotalBallFacedMatch, setplayerTotalBallFacedMatch] =
    useState(10000);
  const [runBasedOverRunMatch, setRunBasedOverRunMatch] = useState(100000);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [event, setEvent] = useState([]);
  const [isFormAvailable, setIsFormAvailable] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [isRoleSelectOpen3, setIsRoleSelectOpen3] = useState(false);

  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [sport, setSport] = useState("Cricket");
  const [leagueSelect, setLeagueSelect] = useState("");
  const [defaultValues, setDefaultValues] = useState([]);
  const [isCheckedLeague, setIsCheckedLeague] = useState(false);
  const [matchOption, setMatchOption] = useState([]);
  const [matchSelect, setMatchSelect] = useState();
  const [isCheckedMatch, SetisCheckedMatch] = useState(false);
  const [showFields , setShowFields] = useState(false);
  const [currencyOption, setCurrencyOption] = useState([
   
  ]);
  const [currency, setCurrency] = useState("");

  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const leagueData = useSelector((state) => state?.GetDbLeagues?.leagueData);
  const eventSetting = useSelector(
    (state) => state?.GetMatchSetting?.matchSetting
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue, // Add setValue to the destructuring
    reset,
  } = useForm({
    defaultValues: getDefaultValues(defaultValues) || {},
  });

  useEffect(() => {
    const cricket = sportData?.filter((sport) => sport?.name === "Cricket");
    setSport(cricket);
    // fetchData();
  }, [sportData]);

  const eventSettingLoading = useSelector(
    (state) => state?.GetMatchSetting?.loading
  );

  const sportDataLoading = useSelector((state) => state?.GetDbSports?.loading);
  const leagueDataLoading = useSelector(
    (state) => state?.GetDbLeagues?.loading
  );

  // Create a helper function to initialize default values for each field
  function getDefaultValues(data) {
    if (data !== null) {
      let defaultValues = {};
      Object.values(data)?.forEach((event_data, index) => {
        if (event_data?.name)
          defaultValues[`fancyLimit-${event_data?.name}`] =
            event_data?.fancyLimit;
      });
      //setFancyLimitLambi(defaultValues.fancyLimit_lambi
      return defaultValues;
    }
  }

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  //Invoking function for getting sport Data
  useEffect(() => {
    dispatch(getDbSports());
  }, []);

  /* ---------------- //For getting data for sports Select tag ---------------- */
  useEffect(() => {
    let sport = createOption(sportData);
    setsportOption(sport);
  }, [sportData]);

  /* ---------------- //For getting data for league Select tag ---------------- */
  useEffect(() => {
    let league = createOption(leagueData);
    setLeagueOption(league);
  }, [leagueData]);

  function fetchData() {
    if(!isCheckedLeague && !matchSelect){
      notifyWarning("Select League or match")
      return 
    }
    if (sport[0]?.name !== "" && leagueSelect !== "") {
      let ids = event?.map((event_ids) => event_ids?._id);
      if (leagueData?.length > 0) {
        let eventPayload = {
          sportId: sport?.value,
          leagueId: leagueSelect,
          eventIds: ids,
        };
        if (isCheckedLeague) {
          eventPayload.isLeague = true;
          eventPayload.isMatchOnly = false;
        } else if (matchSelect && isCheckedMatch) {
          eventPayload.isLeague = false;
          eventPayload.isMatchOnly = true;
          eventPayload.matchSelect = matchSelect;
        }
        const dataObj ={
          eventPayload,
          currencyId:currency.value
        }
        if (isCheckedLeague || matchSelect) {
          dispatch(
            getFancyStakeLimit({
              dataObj,
              callback: (data) => {
                if (data?.meta?.code === 200) {
                  if (data?.data) {
                    setShowFields(true);
                    addDataTostates(data?.data);
                    setDefaultValues(data?.data);
                  } else {
                    defaultValuesMatchMarket();
                  }
                }
              },
            })
          );
        }
      }
    }
  }
  useEffect(() => {
    if (leagueSelect) {
      const eventData =
        leagueData?.find((league) => league._id === leagueSelect.value)
          ?.events || [];
      setMatchOption(createOption(eventData));
    }
  }, [leagueSelect, leagueData]);

  function defaultValuesMatchMarket() {
    setDefaultValueFancy(100000);
    setFirstGroupedWicket(100000);
    setFirstWicket(1000000);
    setFirstWicketBalls(10000000);
    setFirstWicketBoundaries(1000000);
    setLambi(1000000);
    setOver(1000000);
    setOverBasedRuns(1000000);
    setPlayerBoundaries(100000);
    setplayerTotalBallFaced(1000000);
    setRunBasedOverRun(1000000);
    setPlayerBased(1000000);
    setDefaultValueFancyMatch(100000);
    setFirstGroupedWicketMatch(100000);
    setFirstWicketMatch(100000);
    setFirstWicketBallsMatch(100000);
    setFirstWicketBoundariesMatch(100000);
    setLambiMatch(100000);
    setOverMatch(10000);
    setOverBasedRunsMatch(100000);
    setPlayerBoundariesMatch(100000);
    setplayerTotalBallFacedMatch(100000);
    setRunBasedOverRunMatch(100000);
    setPlayerBasedMatch(100000);
  }

  function addDataTostates(data) {
    try {
      setDefaultValueFancy(data?.DefaultStakes?.fancyLimit);
      setFirstGroupedWicket(data?.firstGroupedWickets?.fancyLimit);
      setFirstWicket(data?.firstWicket?.fancyLimit);
      setFirstWicketBalls(data?.firstWicketBalls?.fancyLimit);
      setFirstWicketBoundaries(data?.firstWicketBoundaries?.fancyLimit);
      setLambi(data?.lambiFancy?.fancyLimit);
      setOver(data?.overFancy?.fancyLimit);
      setOverBasedRuns(data?.overBasedRuns?.fancyLimit);
      setPlayerBoundaries(data?.firstWicketBoundaries?.fancyLimit);
      setplayerTotalBallFaced(data?.playersTotalBallFaced?.fancyLimit);
      setRunBasedOverRun(data?.runBased?.fancyLimit);
      setPlayerBased(data?.playersBased?.fancyLimit);
      setDefaultValueFancyMatch(data?.DefaultStakesMatch?.fancyLimit);
      setFirstGroupedWicketMatch(data?.firstGroupedWicketsMatch?.fancyLimit);
      setFirstWicketMatch(data?.firstWicketMatch?.fancyLimit);
      setFirstWicketBallsMatch(data?.firstWicketBallsMatch?.fancyLimit);
      setFirstWicketBoundariesMatch(
        data?.firstWicketBoundariesMatch?.fancyLimit
      );
      setLambiMatch(data?.lambiFancyMatch?.fancyLimit);
      setOverMatch(data?.overFancyMatch?.fancyLimit);
      setOverBasedRunsMatch(data?.overBasedRunsMatch?.fancyLimit);
      setPlayerBoundariesMatch(data?.firstWicketBoundariesMatch?.fancyLimit);
      setplayerTotalBallFacedMatch(
        data?.playersTotalBallFacedMatch?.fancyLimit
      );
      setRunBasedOverRunMatch(data?.runBasedMatch?.fancyLimit);
      setPlayerBasedMatch(data?.playersBasedMatch?.fancyLimit);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    // fetchData();
  }, [matchOption, matchSelect]);

  const handleLeagueSelect = async (option, field) => {
    if (option?.value !== "league") {
      setLeagueSelect(option);
      let eventData = leagueData?.filter(
        (events) => events?._id === option?.value
      );
      setMatchOption(createOption(eventData[0]?.events));

      if (isCheckedLeague) {
        // fancyStakeLimits(isCheckedLeague);
      }
    }
    field.onChange(option?.value);
  };

  useEffect(() => {
    if (sport?.length >0) {
      if (sport[0]?.name !== "") {
        setIsFormAvailable(true);
        dispatch(
          getDbLeagues({
            sportId: sport[0]?._id,
            callback: () => {
              setIsFormAvailable(false);
            },
          })
        );
      }
    }
  }, [sport]);

  useEffect(() => {
    if (eventSetting !== null) {
      let getEventTime = event?.map((event_data, index) => {
        return {
          ...event_data,
          match_status: eventSetting?.find(
            (status) => status?.eventId === event_data?._id
          )?.status,
        };
      });
      setEvent(getEventTime);
    }
  }, [leagueData, reset, eventSetting]);

  const onSubmit = (data, e) => {
    const datas = validateFormStates();
    setIsSubmit(true);
    const dataObj = {currencyId: currency?.value,
      datas
    }
    dispatch(
      updateFancyStakeLimit({
        dataObj,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setIsSubmit(false);
            notifySuccess("updated successfully");
          } else {
            notifyWarning("Failed to update");
          }
        },
      })
    );
  };
  function validateFormStates() {
    try {
      const dataObj = {
        defaultValuefancy,
        firstgroupedWicket,
        firstWicket,
        firstWicketBalls,
        firstWicketBoundaries,
        lambi,
        over,
        overbasedRuns,
        playerBoundaries,
        playerTotalBallFaced,
        runBasedOverRun,
        isLegaueOnly: isCheckedLeague,
        isMatchOnly: isCheckedMatch,
        sportId: sport[0],
        leagueSelect,
        id: defaultValues?._id,
        playersBased,
        matchSelect,
        defaultValuefancyMatch,
        firstgroupedWicketMatch,
        firstWicketMatch,
        firstWicketBallsMatch,
        firstWicketBoundariesMatch,
        lambiMatch,
        overMatch,
        overbasedRunsMatch,
        playerBoundariesMatch,
        playerTotalBallFacedMatch,
        runBasedOverRunMatch,
        playersBasedMatch,
      };
      return dataObj;
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleMatchSelect = (option) => {
    setMatchSelect(option); // Update the matchSelect state with the selected option
  };
  useEffect(()=>{
    dispatch(getCurrency({callback :(data)=>{
      if(data){
        const currencies = data?.map((currency)=>{
          return {label:currency?.name , value :currency?._id}
        });
        setCurrencyOption(currencies)
      }
    }}))
  },[])
  const handleCurrencySelect = async (option, field) => {
    if (option?.value !== "currency") {
      setCurrency(option);
    }
    field.onChange(option?.value);
    const currencyId = option?.value;
  };


  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("FANCY_STAKE_SETTING")}
        title={title?.title}
        parent={title?.parent}
      />
      <Container fluid={false}>
        <Row>
          <Col sm="12">
            <Card className="">
              <CardBody>
                <Row className="d-flex flex-col flex-wrap">
                <Col md="4 mb-3" className="">
                    <Label htmlFor="validationCustom01">
                      {t("SELECT_CURRENCY")}
                    </Label>
                    <Controller
                      name="currencyId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={currencyOption}
                          className="mySelect"
                          value={currency}
                          placeholder={t("SELECT_DOT")}
                          onChange={(option) => {
                            handleCurrencySelect(option, field);
                            setIsRoleSelectOpen3(false);
                          }}
                          menuIsOpen={isRoleSelectOpen3} // Set menuIsOpen based on state
                          onFocus={() => setIsRoleSelectOpen3(true)} // Open menu on focus
                          onBlur={() => setIsRoleSelectOpen3(false)} // Close menu on blur
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
                      <input
                        className="p-2 m-2"
                        type="checkbox"
                        checked={isCheckedLeague}
                        onChange={(e) => setIsCheckedLeague(e.target.checked)}
                      />
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
                      {errors.sportId && t("FIELD_REQUIRED")}
                    </span>
                  </Col>
                  {!isCheckedLeague ? (
                    <Col md="4 mb-3" className="mt-2">
                      <Label htmlFor="validationCustom01">
                        {t("SELECT_MATCH")}
                      </Label>

                      <Controller
                        name="matchId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={matchOption}
                            //isLoading={leagueDataLoading}
                            className="mySelect"
                            value={matchSelect}
                            placeholder={t("SELECT_DOT")}
                            onChange={(option) => {
                              setIsRoleSelectOpen(false);
                              SetisCheckedMatch(true);
                              handleMatchSelect(option);
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
                  ) : null}
                </Row>
                <Button
                  className="mx-2"
                  form="create"
                  type="button"
                  color="success"
                  onClick={() => fetchData()}
                >
                  {t("SUBMIT")}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card className="">
              <CardBody>
                {!showFields? (
                  <div className="text-center">
                    Please Select league or sports and Submit
                    {/* {t("SELECT_SPORT_AND_CURRENCY")} */}
                  </div>
                ) : (
                  <>
                    <Form
                      className="needs-validation"
                      noValidate=""
                      id="create"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Row className="d-flex flex-col m-2">
                        <h3 className="mb-4 fs-5 font-weight-bold">
                          {t("STAKE_SIZE").toUpperCase()}
                        </h3>
                        <Col md="6 mb-3" className="">
                          <div className="d-flex">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Default stakes"}
                          </Label>
                          </div>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label  htmlFor="validationCustom01">
                                {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={defaultValuefancyMatch}
                                type="number"
                                onChange={(e) =>
                                  setDefaultValueFancyMatch(e.target.value)
                                }
                              />
                              <span className="text-danger">
                                {errors.sportId && t("FIELD_REQUIRED")}
                              </span>
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                                {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={defaultValuefancy}
                                type="number"
                                onChange={(e) =>
                                  setDefaultValueFancy(e.target.value)
                                }
                              />
                              <span className="text-danger">
                                {errors.sportId && t("FIELD_REQUIRED")}
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md="6 mb-3">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"First Grouped Wickets"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstgroupedWicketMatch}
                                type="number"
                                onChange={(e) =>
                                  setFirstGroupedWicketMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstgroupedWicket}
                                type="number"
                                onChange={(e) =>
                                  setFirstGroupedWicket(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"First Wicket"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicketMatch}
                                type="number"
                                onChange={(e) =>
                                  setFirstWicketMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicket}
                                type="number"
                                onChange={(e) => setFirstWicket(e.target.value)}
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col  md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"First Wicket Balls"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicketBallsMatch}
                                type="number"
                                onChange={(e) =>
                                  setFirstWicketBallsMatch(e.target.value)
                                }
                              />
                            </div>
                            <div className="b">
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicketBalls}
                                type="number"
                                onChange={(e) =>
                                  setFirstWicketBalls(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col  md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"First Wicket Boundaries"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicketBoundariesMatch}
                                type="number"
                                onChange={(e) =>
                                  setFirstWicketBoundariesMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={firstWicketBoundaries}
                                type="number"
                                onChange={(e) =>
                                  setFirstWicketBoundaries(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Lambi Fancy"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={lambiMatch}
                                type="number"
                                onChange={(e) => setLambiMatch(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={lambi}
                                type="number"
                                onChange={(e) => setLambi(e.target.value)}
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col style={{fontWeight: 600 }} md="6 mb-3" className="">
                          <Label htmlFor="validationCustom01">
                            {"Over Based Runs"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={overbasedRunsMatch}
                                type="number"
                                onChange={(e) =>
                                  setOverBasedRunsMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={overbasedRuns}
                                type="number"
                                onChange={(e) =>
                                  setOverBasedRuns(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Fancy for overs"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={overMatch}
                                type="number"
                                onChange={(e) => setOverMatch(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={over}
                                type="number"
                                onChange={(e) => setOver(e.target.value)}
                              />
                            </div>
                          </div>
                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Players Based"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playersBasedMatch}
                                type="number"
                                onChange={(e) =>
                                  setPlayerBasedMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playersBased}
                                type="number"
                                onChange={(e) => setPlayerBased(e.target.value)}
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Players Boundaries"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                           
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playerBoundariesMatch}
                                type="number"
                                onChange={(e) =>
                                  setPlayerBoundariesMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playerBoundaries}
                                type="number"
                                onChange={(e) =>
                                  setPlayerBoundaries(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Players Total Ball Faced"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playerTotalBallFacedMatch}
                                type="number"
                                onChange={(e) =>
                                  setplayerTotalBallFacedMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={playerTotalBallFaced}
                                type="number"
                                onChange={(e) =>
                                  setplayerTotalBallFaced(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                        <Col md="6 mb-3" className="">
                          <Label style={{fontWeight: 600 }} htmlFor="validationCustom01">
                            {"Run Based"}
                          </Label>
                          <div className="d-flex gap-2 mt-2">
                            
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum Stake for single bet"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={runBasedOverRunMatch}
                                type="number"
                                onChange={(e) =>
                                  setRunBasedOverRunMatch(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="validationCustom01">
                              {"Maximum stake for total bets"}
                              </Label>
                              <input
                                className="form-control"
                                min={0}
                                // onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={runBasedOverRun}
                                type="number"
                                onChange={(e) =>
                                  setRunBasedOverRun(e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <span className="text-danger">
                            {errors.sportId && t("FIELD_REQUIRED")}
                          </span>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </CardBody>
              {showFields  && (
                <>
                  <CardFooter className="py-3 text-center text-md-start">
                    <Button
                      className="mx-2"
                      form="create"
                      type="submit"
                      color="success"
                      disabled={isSubmit}
                    >
                      {t("SUBMIT")}
                    </Button>
                    {/* <button
                      //onClick={handleClear}
                      className="btn"
                      style={{ backgroundColor: "#CCC" }}
                    >
                      {t("RESET")}
                    </button> */}
                  </CardFooter>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default FancyStakeSetting;
