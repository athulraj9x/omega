import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Label, Row } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import { getCurrency, getDbSports, getSportSettings, postSportSetting } from "../../../../redux/action";
import { createOption, notifyWarning } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import { layerRoles } from "../../../../Constant";

const SportSettings = () => {
  const { t } = useTranslation();
  const title = usePageTitle();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.Login.userData);
  const whiteLabelData = useSelector((state) => state.FetchWhiteLabelData?.data);
  const sportSettings = useSelector((state) => state?.GetSportSettings?.sportSetting);

  const [isSubmit, setIsSubmit] = useState(false);
  const [isFormAvailable, setIsFormAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [settingsLimit, setSettingsLimit] = useState(null);
  const sportData = useSelector((state) => state?.GetDbSports?.sportsData);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const [sportOption, setsportOption] = useState([]);
  const [sport, setSport] = useState("");
  const [currencyOption, setCurrencyOption] = useState([]);
  const [currency, setCurrency] = useState("");
  const [whiteLabel, setWhiteLabel] = useState(false);

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

  useEffect(() => {
    if (userData?.role === layerRoles.WHITE_LABEL) {
      setWhiteLabel(true);
    } else {
      setWhiteLabel(false);
    }
  }, [userData]);

  /* ---------------- //For getting data for sports Select tag ---------------- */
  useEffect(() => {
    let data = createOption(sportData);
    setsportOption(data);
  }, [sportData]);

  useEffect(() => {
    if (sportSettings && sportSettings?.stakeSize?.length !== 0) {
      if (!whiteLabel) {
        reset({
          sportsId: sportSettings?.sportsId,
          currencyId: sportSettings?.currencyId,
          minExch: sportSettings?.stakeSize[0]?.minExch,
          maxExch: sportSettings?.stakeSize[0]?.maxExch,
          minBookMaker: sportSettings?.stakeSize[0]?.minBookMaker,
          maxBookMaker: sportSettings?.stakeSize[0]?.maxBookMaker,
          minFancy: sportSettings?.stakeSize[0]?.minFancy,
          maxFancy: sportSettings?.stakeSize[0]?.maxFancy,
          betExch: sportSettings?.betDelay[0]?.betExch,
          betBookMaker: sportSettings?.betDelay[0]?.betBookMaker,
          betFancy: sportSettings?.betDelay[0]?.betFancy,
          fancyLimit: sportSettings?.bookmakerLimit,
        });
      } else {
        reset({
          sportsId: sportSettings?.sportsId,
          currencyId: sportSettings?.currencyId,
          maxExch: sportSettings?.stakeSize[0]?.maxExch,
          maxBookMaker: sportSettings?.stakeSize[0]?.maxBookMaker,
          maxFancy: sportSettings?.stakeSize[0]?.maxFancy,
          fancyLimit: sportSettings?.bookmakerLimit,
        });
      }
    }
    if (sportSettings && sportSettings?.limits?.length > 0 && whiteLabel) {
      setSettingsLimit(sportSettings?.limits[0]);
    }
  }, [sportSettings]);

  useEffect(() => {
    setIsSubmit(false);
    if (userData?.role === layerRoles.DIRECTOR) {
      dispatch(
        getCurrency({
          callback: (data) => {
            setCurrencyOption([]);

            data.forEach((data) => {
              const { _id, name } = data;
              const obj = { label: name, value: _id };
              setCurrencyOption((prevArray) => [...prevArray, obj]);
            });
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

  const handleSportSelect = async (option, field) => {
    if (option?.value !== "sport") {
      setSport(option);
    }
    field.onChange(option?.value);
  };

  const handleCurrencySelect = async (option, field) => {
    if (option?.value !== "currency") {
      setCurrency(option);
    }
    field.onChange(option?.value);
  };

  const fetchData = useCallback(() => {
    let data;
    if (whiteLabelData?.data) {
      data = {
        sportId: sport,
        currencyId: currency,
        whiteLabelId: userData?.whiteLabelId,
      };
    } else {
      data = {
        sportId: sport,
        currencyId: currency,
      };
    }
    dispatch(
      getSportSettings({
        data,
        callback: () => {
          setIsFormAvailable(true);
        },
      })
    );
  }, [sport, currency, dispatch, getSportSettings]);

  useEffect(() => {
    if (sport !== undefined && sport !== "" && currency && currency?.value !== undefined && currency?.value !== "") {
      setIsFormAvailable(true);
      fetchData();
    } else {
      setIsFormAvailable(false);
    }
  }, [currency, fetchData]);

  const onSubmit = (data, e) => {
    setIsSubmit(true);
    let settingData;
    if (!whiteLabel) {
      settingData = {
        sportId: sportSettings?.sportsId,
        currencyId: sportSettings?.currencyId,
        stakeSize: [
          {
            maxExch: data?.maxExch,
            minExch: data?.minExch,
            minBookMaker: data?.minBookMaker,
            maxBookMaker: data?.maxBookMaker,
            maxFancy: data?.maxFancy,
            minFancy: data?.minFancy,
          },
        ],
        betDelay: [
          {
            betExch: data?.betExch,
            betBookMaker: data?.betBookMaker,
            betFancy: data?.betFancy,
          },
        ],
        fancyLimit: data?.fancyLimit,
      };
    } else {
      if (Number(data?.maxExch) > Number(settingsLimit?.maxExch)) {
        setIsSubmit(false);
        return notifyWarning("Max Stake need to be In Between Limits");
      } else if (Number(data?.maxBookMaker) > Number(settingsLimit?.maxBookMaker)) {
        setIsSubmit(false);
        return notifyWarning("Max Stake need to be In Between Limits");
      } else if (Number(data?.maxFancy) > Number(settingsLimit?.maxFancy)) {
        setIsSubmit(false);
        return notifyWarning("Max Stake need to be In Between Limits");
      }
      settingData = {
        sportId: sportSettings?.sportsId,
        currencyId: sportSettings?.currencyId,
        stakeSize: [
          {
            maxExch: data?.maxExch,
            maxBookMaker: data?.maxBookMaker,
            maxFancy: data?.maxFancy,
          },
        ],
        fancyLimit: data?.fancyLimit,
        whiteLabelId: sportSettings?.whiteLabelId,
      };
    }

    dispatch(
      postSportSetting({
        settingData,
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
    });
    setSport("");
    if (userData?.role === layerRoles.DIRECTOR) {
      setCurrency("");
    }
  };

  const handleKeyDown = (e, max) => {
    // Allow only numeric keys (0-9), Backspace, Delete, and Arrow keys
    const input = e.target;
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
      } else if (input.value?.length >= max) {
        e.preventDefault(); // Prevent entering more than 7 digits
      }
    }
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("SPORT_SETTING")} title={title?.title} parent={title?.parent} />
      <Container fluid={false}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
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
              <CardBody>
                {!isFormAvailable ? (
                  <div className="text-center">{t("SELECT_SPORT_AND_CURRENCY")}</div>
                ) : (
                  <>
                    <Form className="needs-validation" noValidate="" id="create" onSubmit={handleSubmit(onSubmit)}>
                      <Row className="d-flex flex-col flex-wrap">
                        <h3 className="mb-4 fs-5">{t("STAKE_SIZE").toUpperCase()}</h3>
                        {!whiteLabel && (
                          <Col md="6 mb-3" className="">
                            <Label htmlFor="validationCustom01">
                              {t("MIN_STAKE")}
                              <span style={{ fontSize: "12px", color: "#818188" }}>{t("(EXCH)")}</span>
                            </Label>
                            <Controller
                              name="minExch"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="form-control"
                                  min={0}
                                  onKeyDown={(e) => handleKeyDown(e, 10)}
                                  value={field.value}
                                  type="number"
                                  readOnly={userData?.role === layerRoles.WHITE_LABEL}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                            <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                          </Col>
                        )}
                        <Col md="6 mb-3">
                          <div className="d-flex justify-content-between">
                            <Label htmlFor="validationCustom01">
                              {t("MAX_STAKE")} <span style={{ fontSize: "12px", color: "#818188" }}>{t("(EXCH)")}</span>
                            </Label>
                            {whiteLabel && (
                              <span className="pr-2">
                                LIMITS: {settingsLimit?.minExch} -{settingsLimit?.maxExch}
                              </span>
                            )}
                          </div>

                          <Controller
                            name="maxExch"
                            control={control}
                            disabled={whiteLabel && settingsLimit?.maxExch <= 0}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="form-control"
                                min={0}
                                onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={field.value}
                                type="number"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                        </Col>
                        {!whiteLabel && (
                          <Col md="6 mb-3" className="">
                            <Label htmlFor="validationCustom01">
                              {t("MIN_STAKE")}{" "}
                              <span style={{ fontSize: "12px", color: "#818188" }}>{t("(BOOKMAKER)")}</span>
                            </Label>

                            <Controller
                              name="minBookMaker"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="form-control"
                                  min={0}
                                  value={field.value}
                                  onKeyDown={(e) => handleKeyDown(e, 10)}
                                  type="number"
                                  readOnly={userData?.role === layerRoles.WHITE_LABEL}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                            <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                          </Col>
                        )}
                        <Col md="6 mb-3" className="">
                          <div className="d-flex justify-content-between">
                            <Label htmlFor="validationCustom01">
                              {t("MAX_STAKE")}{" "}
                              <span style={{ fontSize: "12px", color: "#818188" }}>{t("(BOOKMAKER)")}</span>
                            </Label>
                            {whiteLabel && (
                              <span className="pr-2">
                                LIMITS: {settingsLimit?.minBookMaker} -{settingsLimit?.maxBookMaker}
                              </span>
                            )}
                          </div>
                          <Controller
                            name="maxBookMaker"
                            rules={{ required: "This field is required" }}
                            control={control}
                            disabled={whiteLabel && settingsLimit?.maxBookMaker <= 0}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="form-control"
                                min={0}
                                onKeyDown={(e) => handleKeyDown(e, 10)}
                                value={field.value}
                                type="number"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                        </Col>
                        {!whiteLabel && (
                          <Col md="6 mb-3" className="">
                            <Label htmlFor="validationCustom01">
                              {t("MIN_STAKE")}{" "}
                              <span style={{ fontSize: "12px", color: "#818188" }}>{t("(FANCY)")}</span>
                            </Label>
                            <Controller
                              name="minFancy"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="form-control"
                                  min={0}
                                  value={field.value}
                                  onKeyDown={(e) => handleKeyDown(e, 10)}
                                  type="number"
                                  readOnly={userData?.role === layerRoles.WHITE_LABEL}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              )}
                            />
                            <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                          </Col>
                        )}
                        <Col md="6 mb-3" className="">
                          <div className="d-flex justify-content-between">
                            <Label htmlFor="validationCustom01">
                              {t("MAX_STAKE")}{" "}
                              <span style={{ fontSize: "12px", color: "#818188" }}>{t("(FANCY)")}</span>
                            </Label>
                            {whiteLabel && (
                              <span className="pr-2">
                                LIMITS: {settingsLimit?.minFancy} -{settingsLimit?.maxFancy}
                              </span>
                            )}
                          </div>
                          <Controller
                            name="maxFancy"
                            control={control}
                            disabled={whiteLabel && settingsLimit?.maxFancy <= 0}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="form-control"
                                min={0}
                                value={field.value}
                                onKeyDown={(e) => handleKeyDown(e, 10)}
                                type="number"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                        </Col>
                      </Row>

                      <hr className="border border-[#ecf3fa] opacity-25 mb-4" />

                      {!whiteLabel && (
                        <>
                          <Row className="d-flex flex-col flex-wrap">
                            <h3 className="mb-4 fs-5">{t("BET_DELAY").toUpperCase()}</h3>
                            <Col md="4 mb-3" className="">
                              <Label htmlFor="validationCustom01">
                                {t("BET_DELAY")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(EXCH)")}</span>
                              </Label>
                              <Controller
                                name="betExch"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    min={0}
                                    value={field.value}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    type="number"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                            </Col>
                            <Col md="4 mb-3" className="">
                              <Label htmlFor="validationCustom01">
                                {t("BET_DELAY")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(BOOKMAKER)")}</span>
                              </Label>
                              <Controller
                                name="betBookMaker"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    min={0}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    value={field.value}
                                    type="number"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                            </Col>
                            <Col md="4 mb-3" className="">
                              <Label htmlFor="validationCustom01">
                                {t("BET_DELAY")}{" "}
                                <span style={{ fontSize: "12px", color: "#818188" }}>{t("(FANCY)")}</span>
                              </Label>
                              <Controller
                                name="betFancy"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    min={0}
                                    value={field.value}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    type="number"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                            </Col>
                          </Row>
                          <hr className="border border-[#ecf3fa] opacity-25 mb-4" />
                        </>
                      )}

                      <Row className="d-flex flex-col flex-wrap">
                        {!whiteLabel && (
                          <Col>
                            <h3 className="mb-4 fs-5">{t("LIMIT").toUpperCase()}</h3>

                            <Col md="6 mb-3" className="">
                              <Label htmlFor="validationCustom01">{t("PROFIT_LIMIT")}</Label>
                              <Controller
                                name="profitLimit"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    onKeyDown={(e) => handleKeyDown(e, 10)}
                                    value={field.value || ""}
                                    min={0}
                                    type="number"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                            </Col>
                          </Col>
                        )}
                        {sport?.label === "Cricket" ? (
                          <Col>
                            <h3 className="mb-4 fs-5">{t("BOOKMAKER").toUpperCase()}</h3>

                            <Col md="6 mb-3" className="">
                              <Label htmlFor="validationCustom01">{t("BOOKMAKER")}</Label>
                              <Controller
                                name="fancyLimit"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className="form-control"
                                    onKeyDown={(e) => handleKeyDown(e, 10)}
                                    value={field.value || ""}
                                    min={0}
                                    type="number"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">{errors.sportId && t("FIELD_REQUIRED")}</span>
                            </Col>
                          </Col>
                        ) : null}
                        {/* </Row>
                      <Row className="d-flex flex-col flex-wrap"> */}
                      </Row>
                    </Form>
                  </>
                )}
              </CardBody>
              {isFormAvailable && (
                <>
                  <CardFooter className="py-3 text-center text-md-start">
                    <Button className="mx-2" form="create" type="submit" color="success" disabled={isSubmit}>
                      {t("SUBMIT")}
                    </Button>
                    <button onClick={handleClear} className="btn" style={{ backgroundColor: "#CCC" }}>
                      {t("RESET")}
                    </button>
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

export default SportSettings;
