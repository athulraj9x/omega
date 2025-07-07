import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Label, Row, CardHeader } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import { getDbSports, getDbLeagues, postLeagueSetting, getLeagueSetting, getCurrency } from "../../../../redux/action";
import { checkDirectorSettings, createOption, notifyWarning } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import { layerRoles } from "../../../../Constant";

const LeagueSetting = () => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [league, setLeague] = useState([]);
  const [isFormAvailable, setIsFormAvailable] = useState(false);
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [currency, setCurrency] = useState("");
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [stakeLimit, setStakeLimit] = useState({});

  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);
  const leagueData = useSelector((state) => state?.GetDbLeagues?.leagueData);

  const leagueSetting = useSelector((state) => state?.GetLeagueSetting?.leagueSetting);
  const leagueSettingLoading = useSelector((state) => state?.GetLeagueSetting?.loading);

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
      data?.forEach((league, index) => {
        defaultValues[`minStakeExch-${league?.leagueCode}${index}`] = "";
        defaultValues[`maxStakeExch-${league?.leagueCode}${index}`] = "";
        defaultValues[`minStakeBookmaker-${league?.leagueCode}${index}`] = "";
        defaultValues[`maxStakeBookmaker-${league?.leagueCode}${index}`] = "";
        defaultValues[`minStakeFancy-${league?.leagueCode}${index}`] = "";
        defaultValues[`maxStakeFancy-${league?.leagueCode}${index}`] = "";
        defaultValues[`bookmakerLimit-${league?.leagueCode}${index}`] = "";
      });
      return defaultValues;
    }
  };

  const presetValues = (data) => {
    if (data !== null) {
      let modified = data
        ?.map((modifiedLeague) => {
          return {
            leagueId: modifiedLeague?.leagueId,
            sportId: modifiedLeague?.sportId,
            stakeSize: modifiedLeague?.stakeSize?.map((stake) => {
              return {
                leagueId: modifiedLeague?.leagueId,
                minExch: stake?.minExch,
                maxExch: stake?.maxExch,
                maxBookMaker: stake?.maxBookMaker,
                maxFancy: stake?.maxFancy,
                minBookMaker: stake?.minBookMaker,
                minFancy: stake?.minFancy,
                stakeLimit: modifiedLeague?.stakeLimit,
              };
            }),
            bookmakerLimit: modifiedLeague?.bookmakerLimit,
          };
        })
        ?.map((element) => {
          return {
            leagueId: element?.leagueId,
            stakeSize: element?.stakeSize?.map((stakeData) => {
              return {
                leagueCode: leagueData?.find((code) => code?._id === stakeData?.leagueId)?.leagueCode,
                leagueId: stakeData?.leagueId,
                maxExch: stakeData?.maxExch,
                minExch: stakeData?.minExch,
                bookmakerLimit: element?.bookmakerLimit,
                maxBookMaker: stakeData?.maxBookMaker,
                maxFancy: stakeData?.maxFancy,
                minBookMaker: stakeData?.minBookMaker,
                minFancy: stakeData?.minFancy,
                stakeLimit: stakeData?.stakeLimit,
              };
            }),
          };
        });

      let finalModified = modified?.map((element) => element?.stakeSize)?.flat();

      let defaultValues = {};
      let stakeLimits = {};
      finalModified?.forEach((league, index) => {
        defaultValues[`minStakeExch-${league?.leagueCode}${index}`] = league?.minExch;
        defaultValues[`maxStakeExch-${league?.leagueCode}${index}`] = league?.maxExch;

        defaultValues[`minStakeBookmaker-${league?.leagueCode}${index}`] = league?.minBookMaker;
        defaultValues[`maxStakeBookmaker-${league?.leagueCode}${index}`] = league?.maxBookMaker;
        defaultValues[`minStakeFancy-${league?.leagueCode}${index}`] = league?.minFancy;
        defaultValues[`maxStakeFancy-${league?.leagueCode}${index}`] = league?.maxFancy;
        defaultValues[`bookmakerLimit-${league?.leagueCode}${index}`] = league?.bookmakerLimit;
        stakeLimits[league?.leagueCode] = league?.stakeLimit;
      });

      setStakeLimit(stakeLimits);
      return defaultValues;
    }
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: getDefaultValues(leagueData) || {},
  });
  const [sportOption, setsportOption] = useState([]);
  const [sport, setSport] = useState("");

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
    let data = createOption(sportData);
    setsportOption(data);
  }, [sportData]);

  const handleSportSelect = async (option, field) => {
    if (option?.value !== "sport") {
      setSport(option);
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
    if (currency?.value && currency?.value !== undefined) {
      let ids = leagueData?.map((league) => league?._id);
      if (leagueData?.length > 0) {
        let leaguePayload;
        if (whiteLabelData) {
          leaguePayload = {
            sportId: sport?.value,
            leagueIds: ids,
            currency: currency?.value,
            whiteLabelId: whiteLabelData?.data?.userId,
          };
        } else {
          leaguePayload = {
            sportId: sport?.value,
            leagueIds: ids,
            currency: currency?.value,
          };
        }
        dispatch(
          getLeagueSetting({
            leaguePayload,
          })
        );
      }
    }
  }, [leagueData, currency]);

  useEffect(() => {
    let data = leagueData?.map((league, index) => {
      return {
        ...league,
        [`minStakeExch-${league?.leagueCode}${index}`]: "",
        [`maxStakeExch-${league?.leagueCode}${index}`]: "",
        [`bookmakerLimit-${league?.leagueCode}${index}`]: "",
        [`minStakeBookmaker-${league?.leagueCode}${index}`]: "",
        [`maxStakeBookmaker-${league?.leagueCode}${index}`]: "",
        [`minStakeFancy-${league?.leagueCode}${index}`]: "",
        [`maxStakeFancy-${league?.leagueCode}${index}`]: "",
      };
    });
    setLeague(data);
    // Reset the form with the new default values whenever leagueData changes
    if (leagueSetting === null) {
      reset(getDefaultValues(leagueData));
    } else {
      reset(presetValues(leagueSetting));
    }
  }, [leagueData, reset, leagueSetting]);

  const onSubmit = (data, e) => {
    setIsSubmit(true);
    let leaguedata = [];
    let status = false;
    for (let index = 0; index < league?.length; index++) {
      const currentLeague = league[index];
      if (!currentLeague || !data) {
        continue;
      }

      if (whiteLabelData) {
        let combinedKey = `${currentLeague?.leagueCode}${index}`;
        status = checkDirectorSettings(data, combinedKey, stakeLimit[currentLeague.leagueCode]);
        if (status) {
          setIsSubmit(false);
          notifyWarning("Stakes must me in Between LIMIT");
          break;
        }

        leaguedata.push({
          leagueId: currentLeague._id,
          stakeSize: {
            maxExch: data[`maxStakeExch-${currentLeague.leagueCode}${index}`],
            maxBookMaker: data[`maxStakeBookmaker-${currentLeague.leagueCode}${index}`],
            maxFancy: data[`maxStakeFancy-${currentLeague.leagueCode}${index}`],
          },
          bookmakerLimit: data[`bookmakerLimit-${currentLeague.leagueCode}${index}`],
        });
      } else {
        leaguedata.push({
          leagueId: currentLeague._id,
          stakeSize: {
            maxExch: data[`maxStakeExch-${currentLeague.leagueCode}${index}`],
            minExch: data[`minStakeExch-${currentLeague.leagueCode}${index}`],
            maxBookMaker: data[`maxStakeBookmaker-${currentLeague.leagueCode}${index}`],
            minBookMaker: data[`minStakeBookmaker-${currentLeague.leagueCode}${index}`],
            maxFancy: data[`maxStakeFancy-${currentLeague.leagueCode}${index}`],
            minFancy: data[`minStakeFancy-${currentLeague.leagueCode}${index}`],
          },
          bookmakerLimit: data[`bookmakerLimit-${currentLeague.leagueCode}${index}`],
        });
      }
    }

    if (status) {
      return null;
    }

    dispatch(
      postLeagueSetting({
        leaguePayload: {
          leaguedata,
          currencyId: currency?.value,
          whiteLabelId: whiteLabelData?.data?.userId,
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
      minBookMaker: "",
      maxBookMaker: "",
      minFancy: "",
      maxFancy: "",
      betExch: "",
      betBookMaker: "",
      betFancy: "",
      bookmakerLimit: "",
    });
    setSport([]);
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    // Allow only numeric keys (0-9), Backspace, Delete, and Arrow keys
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
        const parent = e.target.parentElement.parentElement; // Get the parent <tr> element
        const inputs = parent.getElementsByTagName("input"); // Get all inputs in the same row
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
      }
    }
  };
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
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("LEAGUE_SETTING")} title={title?.title} parent={title?.parent} />

      <Container fluid={false}>
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
                            options={sportOption}
                            className="mySelect"
                            placeholder={t("SELECT_DOT")}
                            value={sport}
                            onChange={(option) => {
                              handleSportSelect(option, field);
                            }}
                          />
                        );
                      }}
                    />
                    <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
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
                            setIsRoleSelectOpen2(false);
                          }}
                          menuIsOpen={isRoleSelectOpen2} // Set menuIsOpen based on state
                          onFocus={() => setIsRoleSelectOpen2(true)} // Open menu on focus
                          onBlur={() => setIsRoleSelectOpen2(false)} // Close menu on blur
                        />
                      )}
                    />
                    <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card className="">
              {sport === "" || leagueData === null || !currency ? (
                <CardBody>
                  <div className="text-center">{t("NO_LEAGUE_AVAILABLE")}</div>
                </CardBody>
              ) : (
                <>
                  <CardHeader className="py-3">
                    <div className="mb-3 d-flex justify-content-between">
                      <span>
                        <h3>All Leagues [{leagueData?.length}]</h3>
                      </span>
                      <span>
                        <Button
                          className=""
                          form="create_league"
                          disabled={isSubmit}
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
                      <div className="overflow-auto" style={{ width: "100%", maxHeight: "400px" }}>
                        <table className="table table-bordered table-hover">
                          <thead className="table-light sticky-top" style={{ zIndex: 0 }}>
                            <tr className="text-left" style={{ border: "none " }}>
                              <th>{t("NAME")}</th>
                              {!whiteLabel && (
                                <th className="league-setting-input-width">
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
                              {!whiteLabelData && (
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
                              {!whiteLabelData && (
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
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(BOOKMAKER)")}</span>
                              </th>
                              {sport.label === "Cricket" ? (
                                <th>
                                  {t("FANCY_LIMIT")}{" "}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#818188",
                                    }}
                                  >
                                    &nbsp;
                                  </span>{" "}
                                </th>
                              ) : null}
                            </tr>
                          </thead>
                          <tbody>
                            {leagueSettingLoading ? (
                              <tr className="">
                                <Loader />
                              </tr>
                            ) : (
                              leagueData !== null &&
                              currency &&
                              sport !== "" &&
                              leagueData?.map((league, index) => {
                                return (
                                  <tr className="" key={index}>
                                    <td className="py-2">{league?.name}</td>
                                    {!whiteLabelData && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeExch-${league?.leagueCode}${index}`}
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
                                                  onKeyDown={handleKeyDown}
                                                  type="text"
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
                                    )}

                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeExch-${league?.leagueCode}${index}`}
                                        control={control}
                                        disabled={whiteLabel && stakeLimit[league?.leagueCode]?.minExch <= 0}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                style={{ width: "110px" }}
                                                min={0}
                                                value={field.value}
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
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
                                            LIMIT: {stakeLimit[league?.leagueCode]?.minExch} -{" "}
                                            {stakeLimit[league?.leagueCode]?.maxExch}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                    {!whiteLabelData && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeBookmaker-${league?.leagueCode}${index}`}
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
                                                  onKeyDown={handleKeyDown}
                                                  type="text"
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
                                    )}
                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeBookmaker-${league?.leagueCode}${index}`}
                                        control={control}
                                        disabled={whiteLabel && stakeLimit[league?.leagueCode]?.minBookMaker <= 0}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                style={{ width: "110px" }}
                                                min={0}
                                                value={field.value}
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
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
                                            LIMIT: {stakeLimit[league?.leagueCode]?.minBookMaker} -{" "}
                                            {stakeLimit[league?.leagueCode]?.maxBookMaker}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                    {!whiteLabelData && (
                                      <td className="py-2">
                                        <Controller
                                          name={`minStakeFancy-${league?.leagueCode}${index}`}
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
                                                  onKeyDown={handleKeyDown}
                                                  type="text"
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
                                    )}
                                    <td className="py-2">
                                      <Controller
                                        name={`maxStakeFancy-${league?.leagueCode}${index}`}
                                        control={control}
                                        disabled={whiteLabel && stakeLimit[league?.leagueCode]?.minFancy <= 0}
                                        render={({ field }) => {
                                          if (field.name !== undefined) {
                                            return (
                                              <input
                                                {...field}
                                                className="form-control"
                                                min={0}
                                                value={field.value}
                                                style={{ width: "110px" }}
                                                onKeyDown={handleKeyDown}
                                                type="text"
                                                onChange={(e) => {
                                                  const updatedValue = e.target.value || "";
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
                                            LIMIT: {stakeLimit[league?.leagueCode]?.minFancy} -{" "}
                                            {stakeLimit[league?.leagueCode]?.maxFancy}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                    {sport.label === "Cricket" ? (
                                      <td className="py-2">
                                        <Controller
                                          name={`bookmakerLimit-${league?.leagueCode}${index}`}
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
                                                  onKeyDown={handleKeyDown}
                                                  type="text"
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

export default LeagueSetting;
