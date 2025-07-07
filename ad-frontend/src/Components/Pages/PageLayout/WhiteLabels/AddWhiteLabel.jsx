import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Card, CardBody, CardFooter, Col, Container, Form, Label, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Breadcrumbs, H3 } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { addWhiteLabel, getCurrency, checkWhiteLabelPresence } from "../../../../redux/action";
import Loader from "../../../../Layout/Loader";
import { ManagerRoles, layerRoles } from "../../../../Constant/index";
import { notifyWarning } from "../../../../utils/helper";
import { useSelector } from "react-redux";
import { Themes, UserSideLayouts, WhiteLabelsType, WhiteLabelsBankServices } from "../../../../utils/constants";

const AddWhiteLabel = () => {
  const [currency, setCurrency] = useState("");
  const title = usePageTitle();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const userData = useSelector((state) => state.Login);
  const selectedWhiteLabelTypeWatch = watch("whiteLabelType");

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedWhiteLabelType, setSelectedWhiteLabelType] = useState("");
  // const [selectedWhiteLabelBankService, setSelectedWhiteLabelBankService] = useState();
  // const [selectedCurrency, setSelectedCurrency] = useState("");
  // const [selectedWhiteLabelType, setSelectedWhiteLabelType] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreviewDark, setImagePreviewDark] = useState(null);
  const [imagePreviewLight, setImagePreviewLight] = useState(null);
  const [isDomainExists, setIsDomainExists] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");

  const whiteLabelPresenceHandler = (input) => {
    dispatch(
      checkWhiteLabelPresence({
        domain: input,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setIsDomainExists(true);
          } else {
            setIsDomainExists(false);
          }
        },
      })
    );
  };
  useEffect(() => {
    dispatch(
      getCurrency({
        callback: (data) => {
          const newData = data.map(({ _id, name }) => ({
            label: name,
            value: _id,
          }));

          let currency_id = data?.filter((ele) => ele?.code?.toUpperCase() === "INR");
          setCurrency(currency_id[0]?._id || null);
          setCurrencies((prevArray) => [...prevArray, ...newData]);
        },
      })
    );
  }, []);

  useEffect(() => {
    if (selectedWhiteLabelType?.value !== "B2C") {
      setValue("whiteLabelBankServices", null);
    }
  }, [selectedWhiteLabelTypeWatch, setValue]);

  useEffect(() => {
    if (debouncedValue) {
      const handler = setTimeout(() => {
        whiteLabelPresenceHandler(debouncedValue);
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [debouncedValue]);

  // console.log({selectedWhiteLabelTypeWatch})

  const handleClear = () => {
    reset();
    // setSelectedCurrency(""); // Reset selected currency
    setImagePreviewDark(null);
    setImagePreviewLight(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (e.target.name === "logo_light") {
            setImagePreviewLight(reader.result);
          } else {
            setImagePreviewDark(reader.result);
          }
        };

        reader.readAsDataURL(file);
      } else {
        notifyWarning("Selected file type not allowed.");
        handleClear();
      }
    }
  };

  const onSubmit = (data) => {
    setIsSubmit(true);
    setLoading(true);
    // if (data && currency) {
    // if (data && selectedCurrency?.value) {
    // data.currency = currency;
    // data.currency = selectedCurrency?.value;
    if (data) {
      data.logo_dark = imagePreviewDark;
      data.logo_light = imagePreviewLight;
      //passing default value as bank in
      if (selectedWhiteLabelType.value === "B2C" && data?.whiteLabelBankServices === null) {
        data.whiteLabelBankServices = WhiteLabelsBankServices[1].value;
      }
      dispatch(
        addWhiteLabel({
          data,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              handleClear();
              setIsSubmit(false);
              setLoading(false);
            } else {
              setIsSubmit(false);
              setLoading(false);
            }
          },
        })
      );
    }
  };

  const handleKeyDown = (e) => {
    // Allow only numeric keys (0-9), Backspace, Delete, and Arrow keys
    if (
      !(
        (e.key >= "0" && e.key <= "9") ||
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Tab"
      )
    ) {
      e.preventDefault();
    }
  };

  const validateShares = (value) => {
    if (userData?.userData?.role === 1) {
      if (parseFloat(value) > 0 && parseFloat(value) < 100) {
        return true;
      } else {
        return "Shares must be less than 100.";
      }
    }
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("ADD_WHITELABEL")} title={title?.title} parent={title?.parent} />

      <Container fluid={false}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Row>
          <Col sm="12" className="px-3">
            <Card className="px-2">
              <CardBody>
                <Form className="needs-validation" noValidate="" id="create" onSubmit={handleSubmit(onSubmit)}>
                  {/* Started Personal Details  */}
                  <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("DETAILS")}</H3>
                  <Row className="d-flex flex-col flex-wrap ">
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("USERID")}
                      </Label>
                      <Controller
                        name="userId"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_USERId")}
                            className="form-control"
                            value={field.value || ""}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.userId && errors.userId.message}</span>
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("USERNAME")}
                      </Label>
                      <Controller
                        name="userName"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_USERNAME")}
                            className="form-control"
                            value={field.value || ""}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.userName && errors.userName.message}</span>
                    </Col>

                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("PHONE")}
                      </Label>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_PHONE")}
                            className="form-control"
                            value={field.value || ""}
                            onKeyDown={handleKeyDown}
                            type="number"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.phone && errors.phone.message}</span>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-col flex-wrap ">
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("SHARING")}
                      </Label>
                      <Controller
                        name="sharing"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          validate: validateShares,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_SHARING")}
                            className="form-control"
                            value={field.value || ""}
                            type="number"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.sharing && errors.sharing.message}</span>
                    </Col>

                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("PASSWORD")}
                      </Label>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_PASSWORD")}
                            className="form-control"
                            value={field.value || ""}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.password && errors.password.message}</span>
                    </Col>
                  </Row>
                  {/* <Row className="d-flex flex-col flex-wrap ">
                   
                  </Row> */}

                  <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("DOMAIN")}</H3>
                  <Row className="d-flex flex-col flex-wrap ">
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("DOMAIN_URL")}
                      </Label>
                      <Controller
                        name="domain"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_DOMAIN_URL")}
                            className="form-control"
                            value={field.value || ""}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              //check domain existance//
                              setDebouncedValue(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.domain && errors.domain.message}</span>
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("ADMIN_DOMAIN_URL")}
                      </Label>
                      <Controller
                        name="admin_domain"
                        control={control}
                        rules={{
                          required: "This field is required.",
                          //   validate: validateName,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder={t("ENTER_ADMIN_DOMAIN_URL")}
                            className="form-control"
                            value={field.value || ""}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.admin_domain && errors.admin_domain.message}</span>
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("CURRENCY")}
                      </Label>
                      <Controller
                        name="currency"
                        control={control}
                        rules={{ required: "This field is required." }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={currencies}
                            className="mySelect"
                            placeholder={t("SELECT_DOT")}
                            value={currencies.find((option) => option.value === field.value) || ""}
                            onChange={(selectedOption) => {
                              const newvalue = selectedOption?.value;
                              field.onChange(newvalue);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">{errors.currency && errors.currency.message}</span>
                    </Col>
                    {[layerRoles.DIRECTOR, ManagerRoles?.MANAGER]?.includes(userData?.userData?.role) && (
                      <>
                        <Col md="4 mb-3">
                          <Label htmlFor="validationCustom01">{t("GROUP_NAME")}</Label>
                          <Controller
                            name="groupname"
                            control={control}
                            // rules={{
                            //   required: "This field is required.",
                            // }}
                            render={({ field }) => (
                              <input
                                {...field}
                                placeholder={t("ENTER_GROUP_NAME")}
                                className="form-control"
                                value={field.value || ""}
                                type="text"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.groupname && errors.groupname.message}</span>
                        </Col>
                        <Col md="4 mb-3">
                          <Label className="col-form-label py-0" htmlFor="validationCustom00">
                            {t("WHITE_LABEL_TYPE")}
                          </Label>
                          <Controller
                            name="whiteLabelType"
                            control={control}
                            rules={{ required: "This field is required." }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={WhiteLabelsType}
                                className="mySelect"
                                placeholder={t("SELECT_DOT")}
                                value={WhiteLabelsType.find((option) => option.value === field.value) || ""}
                                onChange={(selectedOption) => {
                                  const newvalue = selectedOption?.value;
                                  setSelectedWhiteLabelType(selectedOption);
                                  field.onChange(newvalue);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.whiteLabelType && errors.whiteLabelType.message}</span>
                        </Col>

                        {/* {console.log({selectedWhiteLabelType})} */}
                        {selectedWhiteLabelType?.value === "B2C" && (
                          <Col md="4 mb-3">
                            <Label className="col-form-label py-0" htmlFor="validationCustom00">
                              {t("WHITE_LABEL_BANK")}
                            </Label>
                            <Controller
                              name="whiteLabelBankServices"
                              control={control}
                              // rules={{ required: "This field is required." }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={WhiteLabelsBankServices}
                                  className="mySelect"
                                  placeholder={t("SELECT_DOT")}
                                  value={
                                    WhiteLabelsBankServices.find((option) => option.value === field.value) ||
                                    WhiteLabelsBankServices[1]
                                  }
                                  onChange={(option) => {
                                    // setSelectedWhiteLabelBankService(option);
                                    field.onChange(option?.value);
                                  }}
                                />
                              )}
                            />
                            <span className="text-danger">
                              {errors?.whiteLabelBankServices && errors?.whiteLabelBankServices?.message}
                            </span>
                          </Col>
                        )}

                        <Col md="4 mb-3">
                          <Row className="mb-3">
                            {/* whitelabel brandname */}
                            <Col>
                              <Label className="col-form-label py-0" htmlFor="validationCustom00">
                                {t("WHITE_LABEL_BRANDNAME")}
                              </Label>
                              <Controller
                                name="whiteLabelBrandName"
                                control={control}
                                rules={{ required: "This field is required." }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    placeholder={t("ENTER_BRAND_NAME")}
                                    className="form-control"
                                    value={field.value || ""}
                                    type="text"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">
                                {errors.whiteLabelBrandName && errors.whiteLabelBrandName.message}
                              </span>
                            </Col>
                          </Row>
                          {/* whitelabel layout */}
                          <Row className="mb-3">
                            <Col>
                              <Label className="col-form-label py-0" htmlFor="validationCustom00">
                                {t("WHITE_LABEL_LAYOUT")}
                              </Label>
                              <Controller
                                name="whiteLabelLayout"
                                control={control}
                                rules={{ required: "This field is required." }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={UserSideLayouts}
                                    className="mySelect"
                                    placeholder={t("SELECT_DOT")}
                                    value={UserSideLayouts.find((option) => option.value === field.value) || ""}
                                    onChange={(selectedOption) => {
                                      const newvalue = selectedOption?.value;
                                      field.onChange(newvalue);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">
                                {errors.whiteLabelLayout && errors.whiteLabelLayout.message}
                              </span>
                            </Col>
                          </Row>
                          {/* whitelabel theme */}
                          <Row className="mb-3">
                            {/* darktheme */}
                            <Col>
                              <Label className="col-form-label py-0" htmlFor="validationCustom00">
                                {t("WHITE_LABEL_DARK_THEME")}
                              </Label>
                              <Controller
                                name="whiteLabelDarkTheme"
                                control={control}
                                rules={{ required: "This field is required." }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={Themes}
                                    className="mySelect"
                                    placeholder={t("SELECT_DOT")}
                                    value={Themes.find((option) => option.value === field.value) || ""}
                                    onChange={(selectedOption) => {
                                      const newvalue = selectedOption?.value;
                                      field.onChange(newvalue);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">
                                {errors.whiteLabelDarkTheme && errors.whiteLabelDarkTheme.message}
                              </span>
                            </Col>
                            {/* lighttheme */}
                            <Col>
                              <Label className="col-form-label py-0" htmlFor="validationCustom00">
                                {t("WHITE_LABEL_LIGHT_THEME")}
                              </Label>
                              <Controller
                                name="whiteLabelLightTheme"
                                control={control}
                                rules={{ required: "This field is required." }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={Themes}
                                    className="mySelect"
                                    placeholder={t("SELECT_DOT")}
                                    value={Themes.find((option) => option.value === field.value) || ""}
                                    // onChange={(option) => {
                                    //   field.onChange(option?.value);
                                    // }}
                                    onChange={(selectedOption) => {
                                      const newvalue = selectedOption?.value;
                                      field.onChange(newvalue);
                                    }}
                                  />
                                )}
                              />
                              <span className="text-danger">
                                {errors.whiteLabelLightTheme && errors.whiteLabelLightTheme.message}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    )}
                  </Row>
                  {!isDomainExists && (
                    <>
                      <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("LOGO")}</H3>

                      <Row className="d-flex flex-col flex-wrap ">
                        <Col md="4 mb-3">
                          <Label className="col-form-label py-0" htmlFor="validationCustom00">
                            {t("LIGHT_MODE")}
                          </Label>
                          <Controller
                            name="logo_light"
                            control={control}
                            rules={{
                              required: "This field is required.",
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                placeholder={t("ENTER_NAME")}
                                className="form-control"
                                value={field.value || ""}
                                type="file"
                                onChange={(e) => {
                                  handleImageChange(e);
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.name && errors.name.message}</span>
                        </Col>
                        <Col>
                          {imagePreviewLight && (
                            <img
                              src={imagePreviewLight}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                height: "60%",
                                width: "70%",
                                border: "10px solid #ccc", // Add this line for a gray border
                                borderRadius: "5px", // Optional: Add border radius
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                      <Row className="d-flex flex-col flex-wrap ">
                        <Col md="4 mb-3">
                          <Label className="col-form-label py-0" htmlFor="validationCustom00">
                            {t("DARK_MODE")}
                          </Label>
                          <Controller
                            name="logo_dark"
                            control={control}
                            rules={{
                              required: "This field is required.",
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                placeholder={t("ENTER_NAME")}
                                className="form-control"
                                value={field.value || ""}
                                type="file"
                                onChange={(e) => {
                                  handleImageChange(e);
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.name && errors.name.message}</span>
                        </Col>
                        <Col>
                          {imagePreviewDark && (
                            <img
                              src={imagePreviewDark}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                height: "60%",
                                width: "70%",
                                border: "10px solid #ccc", // Add this line for a gray border
                                borderRadius: "5px", // Optional: Add border radius
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              </CardBody>
              <CardFooter className="py-3 text-center text-md-start">
                <button form="create" type="submit" className="btn btn-success " color="success" disabled={isSubmit}>
                  {t("ADD")}
                </button>
                <button className="btn ms-2" style={{ backgroundColor: "#CCC" }} onClick={handleClear}>
                  {t("RESET")}
                </button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddWhiteLabel;
