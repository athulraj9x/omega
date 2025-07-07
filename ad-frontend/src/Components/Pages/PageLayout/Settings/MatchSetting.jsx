import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import Select from "react-select";
import { Button, Card, CardBody, Col, Container, Form, Label, Row, CardHeader, Tooltip } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { getDbSports, getDbLeagues, getMatchSetting, postMatchSetting } from "../../../../redux/action";
import Loader from "../../../../Layout/Loader";
import { checkDirectorSettings, createOption, notifyWarning } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import { layerRoles } from "../../../../Constant";
import { getCurrency } from "../../../../redux/action";

const MatchSetting = () => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  var count = 0;

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [event, setEvent] = useState([]);
  const [eventOnSubmit, setEventOnSubmit] = useState([]);
  const [isFormAvailable, setIsFormAvailable] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);

  const [minStakeExch, setMinStakeExch] = useState("");
  const [maxStakeExch, setMaxStakeExch] = useState("");

  const [minStakeBookMaker, setMinStakeBookMaker] = useState("");
  const [maxStakeBookMaker, setMaxStakeBookMaker] = useState("");

  const [minStakeFancy, setMinStakeFancy] = useState("");
  const [maxStakeFancy, setMaxStakeFancy] = useState("");

  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [sport, setSport] = useState("");
  const [leagueSelect, setLeagueSelect] = useState("");
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [isRoleSelectOpen3, setIsRoleSelectOpen3] = useState(false);
  const [eventSetting, setEventSetting] = useState([]);
  const [isMatchSetting, setMatchSetting] = useState(false);
  const [stakeLimits, setStakeLimits] = useState({});

  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const leagueData = useSelector((state) => state?.GetDbLeagues?.leagueData);
  // const eventSetting = useSelector(
  //   (state) => state?.GetMatchSetting?.matchSetting
  // );

  const eventSettingLoading = useSelector((state) => state?.GetMatchSetting?.loading);

  const sportDataLoading = useSelector((state) => state?.GetDbSports?.loading);
  const leagueDataLoading = useSelector((state) => state?.GetDbLeagues?.loading);

  const userData = useSelector((state) => state.Login.userData);
  const whiteLabelData = useSelector((state) => state.FetchWhiteLabelData?.data);

  useEffect(() => {
    if (userData?.role === layerRoles.WHITE_LABEL) {
      setWhiteLabel(true);
    } else {
      setWhiteLabel(false);
    }
  }, [userData]);

  // Create a helper function to initialize default values for each field
  const getDefaultValues = (data) => {
    if (data !== null) {
      let defaultValues = {};
      data?.forEach((event_data, index) => {
        defaultValues[`minStakeExch-${event_data?.id}`] = "";
        defaultValues[`maxStakeExch-${event_data?.id}`] = "";
        defaultValues[`minStakeBookmaker-${event_data?.id}`] = "";
        defaultValues[`maxStakeBookmaker-${event_data?.id}`] = "";
        defaultValues[`minStakeFancy-${event_data?.id}`] = "";
        defaultValues[`maxStakeFancy-${event_data?.id}`] = "";
        defaultValues[`bookmakerLimit-${event_data?.id}`] = "";
      });
      return defaultValues;
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue, // Add setValue to the destructuring
    reset,
  } = useForm({
    defaultValues: getDefaultValues(event, false) || {},
  });

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const presetValues = (data) => {
    if (data !== null) {
      let modified = data
        ?.map((modifiedLeague) => {
          return {
            sportId: modifiedLeague?.sportId,
            leagueId: modifiedLeague?.leagueId,
            eventId: modifiedLeague?.eventId,
            stakeSize: modifiedLeague?.stakeSize?.map((stake) => {
              return {
                leagueId: modifiedLeague?.leagueId,
                maxExch: stake?.maxExch,
                minExch: stake?.minExch,
                maxBookMaker: stake?.maxBookMaker,
                maxFancy: stake?.maxFancy,
                minBookMaker: stake?.minBookMaker,
                minFancy: stake?.minFancy,
                bookmakerLimit: modifiedLeague?.bookmakerLimit,
                stakeLimit: modifiedLeague?.stakeLimit,
              };
            }),
          };
        })
        ?.map((element) => {
          return {
            leagueId: element?.leagueId,
            stakeSize: element?.stakeSize?.map((stakeData) => {
              // let hey = event?.find(
              //   (code) => code?._id === element?.eventId
              // )?.id;
              return {
                id: event?.find((code) => code?._id === element?.eventId)?.id,
                leagueId: stakeData?.leagueId,
                minExch: stakeData?.minExch,
                maxExch: stakeData?.maxExch,
                maxBookMaker: stakeData?.maxBookMaker,
                maxFancy: stakeData?.maxFancy,
                minBookMaker: stakeData?.minBookMaker,
                minFancy: stakeData?.minFancy,
                bookmakerLimit: stakeData?.bookmakerLimit,
                stakeLimit: stakeData?.stakeLimit,
              };
            }),
          };
        });

      let finalModified = modified?.map((element) => element?.stakeSize)?.flat();

      let defaultValues = {};
      let stakeLimits = {};
      finalModified?.forEach((event_data, index) => {
        defaultValues[`minStakeExch-${event_data?.id}`] = event_data?.minExch;
        defaultValues[`maxStakeExch-${event_data?.id}`] = event_data?.maxExch;
        defaultValues[`minStakeBookmaker-${event_data?.id}`] = event_data?.minBookMaker;
        defaultValues[`maxStakeBookmaker-${event_data?.id}`] = event_data?.maxBookMaker;
        defaultValues[`minStakeFancy-${event_data?.id}`] = event_data?.minFancy;
        defaultValues[`maxStakeFancy-${event_data?.id}`] = event_data?.maxFancy;
        defaultValues[`bookmakerLimit-${event_data?.id}`] = event_data?.bookmakerLimit;
        stakeLimits[event_data?.id] = event_data?.stakeLimit;
      });

      setStakeLimits(stakeLimits);
      return defaultValues;
    }
  };

  //Invoking function for getting sport Data
  useEffect(() => {
    dispatch(getDbSports());
    dispatch(
      getCurrency({
        callback: (data) => {
          if (data) {
            const currencies = data?.map((currency) => {
              return { label: currency?.name, value: currency?._id };
            });
            setCurrencyOption(currencies);
          }
        },
      })
    );
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

  const fetchData = () => {
    if (sport !== "" && leagueSelect !== "") {
      let ids = event?.map((event_ids) => event_ids?._id);
      if (leagueData?.length > 0) {
        let eventPayload = {
          sportId: sport?.value,
          leagueId: leagueSelect?.value,
          eventIds: ids,
          whiteLabelId: userData?.whiteLabelId ? userData?.whiteLabelId : null,
          currencyId: currency?.value,
        };
        dispatch(
          getMatchSetting({
            eventPayload,
            callback: (data) => {
              setEventSetting(data);
              setMatchSetting(true);
            },
          })
        );
      }
    } else {
      notifyWarning("Select all fields");
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const handleSportSelect = async (option, field) => {
    if (option?.value !== "sport") {
      setSport(option);
    }
    field.onChange(option?.value);
    setEvent([]);
    setMatchSetting(false);
    setLeagueSelect("");
  };

  // const handleLeagueSelect = async (option, field) => {
  //   if (option?.value !== "league") {
  //     setLeagueSelect(option);
  //     let eventData = leagueData?.filter(
  //       (events) => events?._id === option?.value
  //     );
  //     setEvent(eventData[0]?.events);
  //     let data = eventData[0]?.events?.map((event_data, index) => {
  //       return {
  //         ...event_data,
  //         [`minStakeExch-${event_data?.id}`]: "",
  //         [`maxStakeExch-${event_data?.id}`]: "",
  //         [`minStakeBookmaker-${event_data?.id}`]: "",
  //         [`maxStakeBookmaker-${event_data?.id}`]: "",
  //         [`minStakeFancy-${event_data?.id}`]: "",
  //         [`maxStakeFancy-${event_data?.id}`]: "",
  //       };
  //     });
  //     setEventOnSubmit(data);

  //     reset(getDefaultValues(eventData[0]?.events));
  //   }
  //   field.onChange(option?.value);
  // };

  const handleLeagueSelect = async (option, field) => {
    if (option?.value !== "league") {
      setLeagueSelect(option);
      let eventData = leagueData?.filter((events) => events?._id === option?.value);

      let getEventTime = eventData[0]?.events?.map((event_data, index) => {
        return {
          ...event_data,
          event_time: event_data?.markets?.find((market) => market?.type === "exchange")?.marketStartTime,
        };
      });

      setEvent(getEventTime);
      let data = eventData[0]?.events?.map((event_data, index) => {
        return {
          ...event_data,
        };
      });
      setEventOnSubmit(data);

      reset(getDefaultValues(eventData[0]?.events));
    }
    field.onChange(option?.value);
  };

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

  useEffect(() => {
    if (eventSetting !== null) {
      const data = presetValues(eventSetting, false);
      reset(data);

      let getEventTime = event?.map((event_data, index) => {
        return {
          ...event_data,
          match_status: eventSetting?.find((status) => status?.eventId === event_data?._id)?.status,
        };
      });
      setEvent(getEventTime);
    }
  }, [leagueData, reset, eventSetting]);

  const onSubmit = (data, e) => {
    setIsSubmit(true);
    let leaguedata = [];

    let status = false;
    for (let index = 0; index < eventOnSubmit?.length; index++) {
      let event_data = eventOnSubmit[index];

      if (whiteLabel) {
        // Perform the check based on whiteLabel
        status = checkDirectorSettings(data, event_data?.id, stakeLimits[event_data?.id]);

        if (status) {
          setIsSubmit(false);
          notifyWarning("Stakes must me in Between LIMIT");
          break;
        }

        leaguedata.push({
          eventId: event_data?._id,
          sportId: sport?.value,
          leagueId: leagueSelect?.value,
          stakeSize: {
            maxExch: data[`maxStakeExch-${event_data?.id}`] === "" ? undefined : data[`maxStakeExch-${event_data?.id}`],
            maxBookMaker:
              data[`maxStakeBookmaker-${event_data?.id}`] === ""
                ? undefined
                : data[`maxStakeBookmaker-${event_data?.id}`],
            maxFancy:
              data[`maxStakeFancy-${event_data?.id}`] === "" ? undefined : data[`maxStakeFancy-${event_data?.id}`],
          },
          bookmakerLimit: data[`bookmakerLimit-${event_data?.id}`],
        });
      } else {
        // Non-whiteLabel branch
        leaguedata.push({
          eventId: event_data?._id,
          sportId: sport?.value,
          leagueId: leagueSelect?.value,
          stakeSize: {
            maxExch: data[`maxStakeExch-${event_data?.id}`] === "" ? undefined : data[`maxStakeExch-${event_data?.id}`],
            minExch: data[`minStakeExch-${event_data?.id}`] === "" ? undefined : data[`minStakeExch-${event_data?.id}`],
            maxBookMaker:
              data[`maxStakeBookmaker-${event_data?.id}`] === ""
                ? undefined
                : data[`maxStakeBookmaker-${event_data?.id}`],
            minBookMaker:
              data[`minStakeBookmaker-${event_data?.id}`] === ""
                ? undefined
                : data[`minStakeBookmaker-${event_data?.id}`],
            maxFancy:
              data[`maxStakeFancy-${event_data?.id}`] === "" ? undefined : data[`maxStakeFancy-${event_data?.id}`],
            minFancy:
              data[`minStakeFancy-${event_data?.id}`] === "" ? undefined : data[`minStakeFancy-${event_data?.id}`],
          },

          bookmakerLimit: data[`bookmakerLimit-${event_data?.id}`],
        });
      }
    }

    if (status) {
      return null;
    }

    dispatch(
      postMatchSetting({
        eventPayload: {
          setting: leaguedata,
          currencyId: currency?.value,
          whiteLabel: userData?.whiteLabelId ? userData?.whiteLabelId : null,
        },
        callback: () => {
          setIsSubmit(false);
          socket.emit("change-settings");
        },
      })
    );
  };

  //Handle clear
  const handleClear = () => {
    reset({
      sportsId: "",
      currencyId: "",
      minExch: "",
      maxExch: "",
      // minBookMaker: "",
      // maxBookMaker: "",
      minFancy: "",
      maxFancy: "",
      betExch: "",
      betBookMaker: "",
      betFancy: "",
    });
    setSport([]);
  };

  const handleKeyDown = (e, rowIndex) => {
    const input = e.target; // Define input here
    if (
      !(
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "c" ||
        e.key === "v" ||
        e.key === "a"
      )
    ) {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent the default tab behavior
        count += 1;

        if (count === 10) {
          count = 1;
          rowIndex += 1;
        }

        if (rowIndex === event?.length) {
          rowIndex = 1;
        }

        const rowElement = document.getElementsByTagName("tr")[rowIndex];
        // const parent = e.target.parentElement.parentElement; // Get the parent <tr> element

        const inputs = rowElement.getElementsByTagName("input"); // Get all inputs in the same row

        const index = Array.from(inputs).indexOf(e.target); // Find the index of the current input

        // Determine the next input to focus on
        let nextIndex = index + 1;
        if (nextIndex >= inputs?.length) {
          nextIndex = 0; // Wrap around to the first input if at the last one
        }

        // Set focus on the next input
        inputs[nextIndex].focus();
      } else if (e.key === "-") {
        e.preventDefault(); // Prevent the minus sign from being entered
      } else if (!(e.key >= "0" && e.key <= "9")) {
        e.preventDefault(); // Prevent the minus sign from being entered
      } else if (input.value?.length >= 10) {
        e.preventDefault(); // Prevent entering more than 7 digits
      }
    }
  };

  // const updateStatusSetting = (status) => {
  //   if (status !== undefined) {
  //     let settingObj = {
  //       id: status?._id,
  //       status: status?.match_status === "1" ? "0" : "1",
  //       type: "match",
  //     };
  //     dispatch(
  //       updateSetting({
  //         settingObj,
  //         callback: () => {
  //           fetchData();
  //         },
  //       })
  //     );
  //   }
  // };

  const autoFill = () => {
    let defaultValues = {};
    event?.forEach((event_data, index) => {
      defaultValues[`minStakeExch-${event_data?.id}`] = minStakeExch;
      defaultValues[`maxStakeExch-${event_data?.id}`] = maxStakeExch;
      defaultValues[`minStakeBookmaker-${event_data?.id}`] = minStakeBookMaker;
      defaultValues[`maxStakeBookmaker-${event_data?.id}`] = maxStakeBookMaker;
      defaultValues[`minStakeFancy-${event_data?.id}`] = minStakeFancy;
      defaultValues[`maxStakeFancy-${event_data?.id}`] = maxStakeFancy;
    });

    // Iterate over the keys and set each field individually
    Object.keys(defaultValues).forEach((fieldName) => {
      setValue(fieldName, defaultValues[fieldName]);
    });
  };

  //get currencies
  useEffect(() => {
    if (userData?.role === layerRoles.DIRECTOR) {
      dispatch(
        getCurrency({
          callback: (data) => {
            if (data) {
              const currencies = data?.map((currency) => {
                return { label: currency?.name, value: currency?._id };
              });
              setCurrencyOption(currencies);
            }
          },
        })
      );
    } else {
      const obj = {
        label: userData?.currencyId?.name,
        value: userData?.currencyId?._id,
      };
      setCurrency(obj);
    }
  }, []);

  const handleCurrencySelect = async (option, field) => {
    if (option?.value !== "currency") {
      setCurrency(option);
    }
    field.onChange(option?.value);
    const currencyId = option?.value;
    // fetchData();
  };
  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("MATCH_SETTING")} title={title?.title} parent={title?.parent} />
      <Container fluid={false}>
        <form onSubmit={handleSubmit(fetchData)}>
          <Row>
            <Col sm="12">
              <Card className="">
                <CardBody>
                  <Row className="d-flex flex-col flex-wrap">
                    <Col md="4 mb-3" className="">
                      <Label htmlFor="validationCustom01">{t("SELECT_SPORTS")}</Label>
                      <Controller
                        name="sportsId"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Select
                              {...field}
                              isLoading={sportDataLoading}
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
                          );
                        }}
                      />
                      <span className="text-danger">{errors.sportsId && t("FIELD_REQUIRED")}</span>
                    </Col>
                    <Col md="4 mb-3" className="">
                      <Label htmlFor="validationCustom01">{t("SELECT_LEAGUE")}</Label>
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
                      <span className="text-danger">{errors.leagueId && t("FIELD_REQUIRED")}</span>
                    </Col>
                    <Col md="4 mb-3" className="">
                      <Label htmlFor="validationCustom01">{t("SELECT_CURRENCY")}</Label>
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
                      <span className="text-danger">{errors.currencyId && t("FIELD_REQUIRED")}</span>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-col flex-wrap">
                    <Col sm="12">
                      <Button type="submit" color="success">
                        {t("SUBMIT")}
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </form>
        <Row>
          <Col sm="12">
            <Card className="">
              {!isMatchSetting ? (
                <CardBody>
                  <div className="text-center">{t("SELECT_SPORT_AND_LEAGUE")}</div>
                </CardBody>
              ) : (
                <>
                  <CardHeader className="py-3">
                    <div className="mb-3 d-flex justify-content-between">
                      <span>
                        <h3>All Event [{event?.length}]</h3>
                      </span>
                      <span>
                        <Button id="autofill" form="create_league" onClick={() => autoFill()} color="success">
                          Auto Fill
                          <Tooltip placement="top" isOpen={tooltipOpen} target="autofill" toggle={toggleTooltip}>
                            Fill all inputs in the first row, then click AUTOFILL.
                          </Tooltip>
                        </Button>
                        <Button
                          className="m-2"
                          form="create_league"
                          // disabled={isSubmit}
                          // onClick={() => handleAllowAndBlock(true)}
                          color="success"
                        >
                          {t("SUBMIT")}
                        </Button>
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <Form
                      className="needs-validation"
                      noValidate=""
                      id="create_league"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="overflow-auto" style={{ height: "66vh" }}>
                        <table className="table table-responsive table-bordered table-hover">
                          <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                            <tr className="text-left" style={{ border: "none " }}>
                              <th>
                                {t("NAME")}
                                <span style={{ fontSize: "12px", color: "#818188" }}>&nbsp;</span>
                              </th>
                              <th>
                                {t("DATE")}
                                <span style={{ fontSize: "12px", color: "#818188" }}>&nbsp;</span>
                              </th>
                              {!whiteLabel && (
                                <th>
                                  {t("MIN_STAKE")}{" "}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#818188",
                                    }}
                                  >
                                    {t("(EXCH)")}
                                  </span>
                                </th>
                              )}
                              <th>
                                {t("MAX_STAKE")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(EXCH)")}</span>
                              </th>

                              {!whiteLabel && (
                                <th>
                                  {t("MIN_STAKE")}{" "}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#818188",
                                    }}
                                  >
                                    {t("(BOOKMAKER)")}
                                  </span>
                                </th>
                              )}
                              <th>
                                {t("MAX_STAKE")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(BOOKMAKER)")}</span>
                              </th>
                              {!whiteLabel && (
                                <th>
                                  {t("MIN_STAKE")}{" "}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#818188",
                                    }}
                                  >
                                    {t("(FANCY)")}
                                  </span>
                                </th>
                              )}
                              <th>
                                {t("MAX_STAKE")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(FANCY)")}</span>
                              </th>

                              {sport?.label === "Cricket" ? (
                                <th>
                                  {t("FANCY_LIMIT")}{" "}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#818188",
                                    }}
                                  >
                                    {" "}
                                  </span>
                                </th>
                              ) : null}
                            </tr>
                          </thead>
                          <tbody>
                            {eventSettingLoading ? (
                              <tr className="">
                                <Loader />
                              </tr>
                            ) : (
                              sport !== "" &&
                              event?.map((event_data, index) => {
                                return (
                                  <tr className="" key={index}>
                                    <td
                                      className="py-2"
                                      style={{
                                        minWidth: "200px",
                                      }}
                                    >
                                      {event_data?.name}
                                    </td>
                                    <td
                                      className="py-2"
                                      style={{
                                        minWidth: "150px",
                                      }}
                                    >
                                      {moment(new Date(event_data?.date), "ddd DD-MMM-YYYY, hh:mm A").format(
                                        "MMMM Do YYYY"
                                      )}
                                    </td>
                                    {!whiteLabel && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeExch-${event_data?.id}`}
                                          control={control}
                                          // defaultValue={}
                                          render={({ field }) => {
                                            if (field.name !== undefined) {
                                              return (
                                                <input
                                                  {...field}
                                                  className="form-control"
                                                  min={0}
                                                  onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                  style={{ width: "110px" }}
                                                  value={field.value}
                                                  type="text"
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value || "";
                                                    setMinStakeExch(updatedValue);
                                                    field.onChange(updatedValue);
                                                  }}
                                                />
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                    )}

                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeExch-${event_data?.id}`}
                                        control={control}
                                        disabled={whiteLabel && stakeLimits[event_data?.id]?.minExch <= 0}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                value={field.value}
                                                onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                style={{ width: "110px" }}
                                                min={0}
                                                type="text"
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
                                                  setMaxStakeExch(updatedValue);
                                                  field.onChange(updatedValue);
                                                }}
                                              />
                                            );
                                          }
                                        }}
                                      />
                                      {whiteLabel && (
                                        <span className="d-inline-block">
                                          <span className="text-muted small mx-2">
                                            LIMIT: {stakeLimits[event_data?.id]?.minExch} -{" "}
                                            {stakeLimits[event_data?.id]?.maxExch}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                    {!whiteLabel && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeBookmaker-${event_data?.id}`}
                                          control={control}
                                          render={({ field }) => {
                                            if (field.name !== undefined) {
                                              return (
                                                <input
                                                  {...field}
                                                  className="form-control"
                                                  style={{ width: "110px" }}
                                                  min={0}
                                                  value={field.value}
                                                  type="text"
                                                  onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value || "";
                                                    setMinStakeBookMaker(updatedValue);
                                                    field.onChange(updatedValue);
                                                  }}
                                                />
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                    )}
                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeBookmaker-${event_data?.id}`}
                                        control={control}
                                        disabled={whiteLabel && stakeLimits[event_data?.id]?.minBookMaker <= 0}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                min={0}
                                                value={field.value}
                                                type="text"
                                                style={{ width: "110px" }}
                                                onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
                                                  setMaxStakeBookMaker(updatedValue);
                                                  field.onChange(updatedValue);
                                                }}
                                              />
                                            );
                                          }
                                        }}
                                      />

                                      {whiteLabel && (
                                        <span className="d-inline-block">
                                          <span className="text-muted small mx-2">
                                            LIMIT: {stakeLimits[event_data?.id]?.minBookMaker} -{" "}
                                            {stakeLimits[event_data?.id]?.maxBookMaker}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                    {!whiteLabel && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeFancy-${event_data?.id}`}
                                          control={control}
                                          render={({ field }) => {
                                            if (field.name !== undefined) {
                                              return (
                                                <input
                                                  {...field}
                                                  className="form-control"
                                                  min={0}
                                                  value={field.value}
                                                  style={{ width: "110px" }}
                                                  type="text"
                                                  onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value || "";
                                                    setMinStakeFancy(updatedValue);
                                                    field.onChange(updatedValue);
                                                  }}
                                                />
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                    )}
                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeFancy-${event_data?.id}`}
                                        disabled={whiteLabel && stakeLimits[event_data?.id]?.maxFancy <= 0}
                                        control={control}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                min={0}
                                                value={field.value}
                                                style={{ width: "110px" }}
                                                type="text"
                                                onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
                                                  setMaxStakeFancy(updatedValue);
                                                  field.onChange(updatedValue);
                                                }}
                                              />
                                            );
                                          }
                                        }}
                                      />
                                      {whiteLabel && (
                                        <span className="d-inline-block">
                                          <span className="text-muted small mx-2">
                                            LIMIT: {stakeLimits[event_data?.id]?.maxFancy} -{" "}
                                            {stakeLimits[event_data?.id]?.minFancy}
                                          </span>
                                        </span>
                                      )}
                                    </td>

                                    {sport?.label === "Cricket" ? (
                                      <td className="py-2">
                                        <Controller
                                          name={`bookmakerLimit-${event_data?.id}`}
                                          control={control}
                                          render={({ field }) => {
                                            if (field.name !== undefined) {
                                              return (
                                                <input
                                                  {...field}
                                                  className="form-control"
                                                  min={0}
                                                  value={field.value}
                                                  style={{ width: "110px" }}
                                                  type="text"
                                                  onKeyDown={(e) => handleKeyDown(e, index + 1)}
                                                  onChange={(e) => {
                                                    const updatedValue = e.target.value || "";
                                                    field.onChange(updatedValue);
                                                  }}
                                                />
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                    ) : null}
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Form>
                  </CardBody>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default MatchSetting;
