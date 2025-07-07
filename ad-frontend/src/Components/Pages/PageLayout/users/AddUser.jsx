import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, CardBody, Form, Label, CardFooter } from "reactstrap";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Breadcrumbs, H3 } from "../../../../AbstractElements";
import { addLayer } from "../../../../redux/action/users/addLayerAction";
import Loader from "../../../../Layout/Loader";
import {
  ManagerRoles,
  Options,
  Roles,
  WhiteLabelB2CRoles,
  availableCasinos,
  layerRoles,
  nameRegex,
} from "../../../../Constant/index";
import { authDetail, getCurrency } from "../../../../redux/action";
import { notifyWarning } from "../../../../utils/helper";

const AddUser = () => {
  const title = usePageTitle();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userData = useSelector((state) => state.Login);
  const addUserState = useSelector((state) => state.addLayer);
  const whiteLabelData = useSelector((state) => state.FetchWhiteLabelData?.data);
  const whiteLabelType = useSelector(
    (state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType
  );
  const [togglePassword, setTogglePassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(Roles);
  const [selectedRole, setSelectedRole] = useState("");
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  // const [casinos, setCasinos] = useState([]);
  const [selectedCasinos, setSelectedCasino] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [alreadyExistUserNames, setAlreadyExistUserNames] = useState([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      commission: 0,
      // Other fields with default values
    },
    mode: "onChange", // This ensures validation is triggered on every change
    reValidateMode: "onChange", // This ensures validation is re-checked on every change
  });

  useEffect(() => {
    setAlreadyExistUserNames(userData?.userData?.alreadyExist);
  }, [userData]);

  //For Filtering roles in ADD-USER based on current user Role...
  useEffect(() => {
    setIsSubmit(false);
    const result = Roles.filter((role) => role.value > userData?.userData?.role);
    setRoles(result);
    dispatch(
      getCurrency({
        callback: (data) => {
          setCurrencies([]);

          data.forEach((data) => {
            const { _id, name } = data;
            const obj = { label: name, value: _id };
            setCurrencies((prevArray) => [...prevArray, obj]);
          });
        },
      })
    );
  }, []);

  //For Filtering roles in ADD-USER based on current user Role...
  useEffect(() => {
    setIsSubmit(false);
    let result;
    if (
      userData?.userData?.role === ManagerRoles.ACCOUNTS_MANAGER ||
      userData?.userData?.role === ManagerRoles.MANAGER
    ) {
      result = Roles.filter((role) => role.value > layerRoles.DIRECTOR);
    } else {
      result = Roles.filter((role) => role.value > userData?.userData?.role);
    }
    setRoles(result);
    // setCasinos(availableCasinos);
    // setOptions(Options);
  }, []);

  useEffect(() => {
    if (whiteLabelType === "B2C") {
      setRoles(WhiteLabelB2CRoles);
    }
  }, [whiteLabelType]);
  //Handle the Form Clear Button
  const handleClear = () => {
    reset({
      name: "",
      username: "",
      groupname: "",
      mobileNo: "",
      password: "",
      role: 0,
      sportShares: "",
      creditReference: "",
      balance: "",
      casino: "",
      commissionPercentage: "",
    }); // Clear the form controls
    setSelectedRole(""); // Reset selected role
    setSelectedCasino([]);
    setSelectedCurrency(""); // Reset selected currency
  };

  //Handle The Form Submit Button
  const onSubmit = (data, e) => {
    if (data?.casino === undefined) {
      data.casino = [{ label: "All", value: 0 }];
    }

    data.commission = 1;

    if (userData?.userData?.role !== 1) {
      data.currencyId = userData?.userData?.currencyId?._id;
    }
    if (data.role === 7 && whiteLabelType === "B2C") {
      data.whiteLabelType = whiteLabelType;
    }

    // }
    // return;
    setIsSubmit(true);
    setLoading(true);

    dispatch(
      addLayer({
        data,
        callback: (res) => {
          setLoading(false);
          if (res?.meta?.code === 200) {
            dispatch(
              authDetail({
                callback: (data) => {
                  setAlreadyExistUserNames(data?.alreadyExist);
                },
              })
            );
            handleClear();
            reset({
              name: "",
              username: "",
              groupname: "",
              mobileNo: "",
              password: "",
              role: 0,
              sportShares: "",
              creditReference: "",
              balance: "",
              commissionPercentage: "",
            });
          } else {
            notifyWarning(res?.meta?.message);
          }
          setIsSubmit(false);
        },
      })
    );
  };

  const validateName = (value) => {
    if (nameRegex.test(value)) {
      return true;
    } else {
      return "Name must be only characters.";
    }
  };

  const validateShares = (value) => {
    // console.log("value", value);
    if ([undefined, ""]?.includes(value)) {
      return true;
    } else {
      if (userData?.userData?.role === 1) {
        if (parseFloat(value) > 0 && parseFloat(value) <= 100) {
          return true;
        } else {
          return "Shares must be less than or equal to 100.";
        }
      } else {
        // For other roles, check for greater than 50 as well
        if (userData?.userData?.role === layerRoles.WHITE_LABEL) {
          if (
            parseFloat(value) !== 0 &&
            parseFloat(value) <=
              whiteLabelData.data?.whiteLabel?.find(
                (whitelabel) => whitelabel?.userId === userData?.userData?.whiteLabelId
              )?.sharing
          ) {
            return true;
          } else {
            return "Shares must be less than or equal to your shares.";
          }
        } else {
          if (parseFloat(value) !== 0 && parseFloat(value) <= userData?.userData?.sportShares) {
            return true;
          } else {
            return "Shares must be less than or equal to your shares.";
          }
        }
      }
    }
  };

  const validateCommissionPercentage = (value) => {
    if (value >= 0 && value <= 1) {
      return true;
    } else {
      return "Commission percentage must be between 0 and 1.";
    }
  };

  const validateCreditReference = (value) => {
    if (userData?.userData?.role === 1) {
      if (value >= 0 && value <= userData?.userData?.creditReference) {
        return true;
      } else {
        return "Amount must be less than your credit Reference.";
      }
    } else {
      // For other roles, check for greater than 50 as well
      if (value >= 0 && value <= userData?.userData?.creditReference) {
        return true;
      } else {
        return "Amount must be less than your credit Reference.";
      }
    }
  };

  const validateBalance = (value) => {
    if (value !== undefined && value !== "") {
      if (userData?.userData?.role == 1) {
        if (value >= 0 && value <= userData?.userData?.balance) {
          return true;
        } else {
          return "Balance must be less than your balance.";
        }
      } else {
        // For other roles, check for greater than 50 as well
        if (value >= 0 && value <= userData?.userData?.balance) {
          return true;
        } else {
          return "Balance must be less than your balance.";
        }
      }
    }
  };

  const alreadyExist = (type, value) => {
    const isExist = alreadyExistUserNames?.find((checked) => {
      return checked?.[type] == value;
    });
    if (isExist !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const validateMobileNo = (value) => {
    if (value === undefined) {
      return true;
    } else if (value === "") {
      return true;
    } else {
      if (value?.length >= 9 && value?.length <= 15) {
        const isExist = alreadyExist("mobileNo", value);
        if (isExist) {
          return "Mobile no. is already exist.";
        } else {
          return true;
        }
      } else {
        return "Mobile no shouldn't be less or more then 9-15.";
      }
    }
  };

  const validateEmail = (value) => {
    if (value === undefined) {
      return true;
    } else if (value === "") {
      return true;
    } else {
      const isExist = alreadyExist("email", value);
      if (isExist) {
        return "Email ID is already exist.";
      } else {
        return true;
      }
    }
  };

  const validateUsername = (value) => {
    if (value === undefined && value === "") {
      return true;
    } else if (value === "") {
      return true;
    } else {
      const isExist = alreadyExist("username", value);
      if (isExist) {
        return "Username is already exist.";
      } else {
        return true;
      }
    }
  };

  const validatePassword = (value) => {
    if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
      return "First character should be Uppercase";
    }
    if (value?.length < 6) {
      return "Password length should be at least 6 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password should contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Password should contain at least one lowercase letter";
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~`-]/.test(value)) {
      return "Password should contain at least one special character";
    }
    if (value?.length < 6) {
      return "Password length should be at least 6 characters";
    }
    return true;
  };
  const handleKeyDownAllowDecimal = (e) => {
    // Allow only numeric keys (0-9), Backspace, Delete, Arrow keys, Tab, and Decimal point
    if (
      !(
        (
          (e.key >= "0" && e.key <= "9") ||
          e.key === "Backspace" ||
          e.key === "Delete" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Tab" ||
          e.key === "."
        ) // Allow the decimal point
      )
    ) {
      e.preventDefault();
    }

    // Prevent multiple decimal points
    if (e.key === "." && e.target.value.includes(".")) {
      e.preventDefault();
    }
  };

  // console.log("errors", errors);

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

  // console.log("userData?.userData?.role", userData?.userData?.role);
  // console.log("userdata",userData);
  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("ADD_USER")} title={title?.title} parent={title?.parent} />

      {addUserState.loading ? (
        <Container fluid={true}>
          <Loader />
        </Container>
      ) : (
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
                    <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("PERSONAL_DETAILS")}</H3>
                    <Row className="d-flex flex-col flex-wrap ">
                      <Col md="4 mb-3">
                        <Label className="col-form-label py-0" htmlFor="validationCustom00">
                          {t("NAME")}
                        </Label>
                        <Controller
                          name="name"
                          control={control}
                          rules={{
                            required: "This field is required.",
                            validate: validateName,
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_NAME")}
                              className="form-control"
                              value={field.value || ""}
                              type="text"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.name && errors.name.message}</span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom01">{t("USER_NAME")}</Label>
                        <Controller
                          name="username"
                          control={control}
                          rules={{
                            required: "This field is required.",
                            validate: validateUsername, // Add the custom validation rule
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
                        <span className="text-danger">{errors.username && errors.username.message}</span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom02">
                          {t("EMAIL")} <span style={{ fontSize: "12px", color: "#818188" }}>{t("(Optional)")}</span>
                        </Label>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            validate: validateEmail, // Add the custom validation rule
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_EMAIL_OPTIONAL")}
                              className="form-control"
                              value={field.value || ""}
                              type="email"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.email && errors.email.message}</span>
                      </Col>
                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom03">
                          {t("MOBILE_NO")}
                          <span style={{ fontSize: "12px", color: "#818188" }}>{t("(Optional)")}</span>
                        </Label>
                        <Controller
                          name="mobileNo"
                          control={control}
                          rules={{
                            validate: validateMobileNo, // Add the custom validation rule
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_MOBILE_OPTIONAL")}
                              className="form-control"
                              onKeyDown={handleKeyDown}
                              value={field.value || ""}
                              type="number"
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                field.onChange(numericValue);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.mobileNo && errors.mobileNo.message}</span>
                      </Col>
                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom07">{t("PASSWORD")}</Label>
                        <Controller
                          name="password"
                          control={control}
                          rules={{
                            validate: validatePassword,
                            required: "This field is required.",
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_PASSWORD")}
                              className="form-control"
                              value={field.value || ""}
                              type={togglePassword ? "text" : "password"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.password && errors.password.message}</span>
                        <div className="show-or-hide" onClick={() => setTogglePassword(!togglePassword)}>
                          <span className={togglePassword ? "" : "show"}></span>
                        </div>
                        <span className={togglePassword ? "" : "show"}></span>
                      </Col>
                      <Col md="4 mb-3">
                        {/* <H3 attrH3={{ className: "mb-3" }}>{t("Ranking")}</H3> */}
                        <Label htmlFor="validationCustom04">{t("ROLE")}</Label>
                        <Controller
                          name="role"
                          control={control}
                          rules={{ required: "This field is required." }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={roles}
                              className="mySelect"
                              placeholder={t("SELECT_DOT")}
                              value={selectedRole}
                              onChange={(option) => {
                                setSelectedRole(option);
                                setIsRoleSelectOpen(false);
                                field.onChange(option?.value);
                              }}
                              menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">{errors.role && errors.role.message}</span>
                      </Col>

                      {/* {whiteLabelData && userData?.userData?.role === layerRoles.WHITE_LABEL */}
                      {false && (
                        <Col md="4 mb-3">
                          {/* <H3 attrH3={{ className: "mb-3" }}>{t("Currency")}</H3> */}
                          <Label htmlFor="validationCustom04">{t("CURRENCY")}</Label>
                          <Controller
                            name="currencyId"
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={currencies}
                                className="mySelect"
                                value={selectedCurrency}
                                placeholder={t("SELECT_DOT")}
                                onChange={(option) => {
                                  setSelectedCurrency(option);
                                  field.onChange(option.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.currencyId && t("fieldRequired")}</span>
                        </Col>
                      )}

                      {(selectedRole?.value === 1 ||
                        userData?.userData?.role === layerRoles.DIRECTOR ||
                        userData?.userData?.role === ManagerRoles?.MANAGER ||
                        userData?.userData?.role === ManagerRoles?.ACCOUNTS_MANAGER) && (
                        <Col md="4 mb-3">
                          {/* <H3 attrH3={{ className: "mb-3" }}>{t("Currency")}</H3> */}
                          <Label htmlFor="validationCustom04">{t("CURRENCY")}</Label>
                          <Controller
                            name="currencyId"
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={currencies}
                                className="mySelect"
                                value={selectedCurrency}
                                placeholder={t("SELECT_DOT")}
                                onChange={(option) => {
                                  setSelectedCurrency(option);
                                  field.onChange(option.value);
                                }}
                              />
                            )}
                          />
                          <span className="text-danger">{errors.currencyId && t("fieldRequired")}</span>
                        </Col>
                      )}
                      {[layerRoles.DIRECTOR, ManagerRoles?.MANAGER]?.includes(userData?.userData?.role) && (
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
                      )}
                    </Row>
                    {/* Personal Details Section End  */}

                    {/* Started Shares Section  */}

                    {(selectedRole.value !== 7 ||
                      [layerRoles.DIRECTOR, ManagerRoles?.MANAGER]?.includes(userData?.userData?.role) ||
                      userData?.userData?.commission === 1) && (
                      <>
                        <hr className="border border-[#ecf3fa] opacity-25 mb-4" />
                        <Row className="d-flex flex-col flex-wrap">
                          {selectedRole.value !== 7 && <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("SHARES")}</H3>}
                          {selectedRole.value !== 7 && (
                            <>
                              <Col md="4 mb-3">
                                <Label htmlFor="validationCustom05">{t("CLIENTSHARE")}</Label>
                                <Controller
                                  name="sportShares"
                                  control={control}
                                  rules={{
                                    // required: "This field is required.",
                                    validate: validateShares, // Add the custom validation rule
                                  }}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      placeholder={t("ENTER_SHARES")}
                                      className="form-control"
                                      onKeyDown={handleKeyDown}
                                      value={field.value || ""}
                                      type="number"
                                      onChange={(e) => {
                                        const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                        field.onChange(numericValue);
                                      }}
                                    />
                                  )}
                                />
                                <span className="text-danger">{errors.sportShares && errors.sportShares.message}</span>
                              </Col>
                            </>
                          )}

                          {[
                            layerRoles.DIRECTOR,
                            ManagerRoles?.MANAGER,
                            ManagerRoles?.ACCOUNTS_MANAGER,
                            ManagerRoles?.OPERATIONAL_MANAGER,
                          ].includes(userData?.userData?.role || userData?.userData?.commission) && (
                            <>
                              <Col md="4 mb-3">
                                <Label htmlFor="validationCustom05">{t("COMMISSION_PERCENTAGE")}</Label>
                                <Controller
                                  name="commissionPercentage"
                                  control={control}
                                  rules={{
                                    required: "This field is required.",
                                    min: {
                                      value: 0,
                                      message: "Value must be at least 0",
                                    },
                                    max: {
                                      value: 1,
                                      message: "Value must not exceed 1",
                                    },
                                    validate: validateCommissionPercentage, // Add the custom validation rule
                                  }}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      placeholder={t("ENTER_COMMISSION")}
                                      className="form-control"
                                      min="0"
                                      max="1"
                                      step="0.01"
                                      onKeyDown={handleKeyDownAllowDecimal}
                                      value={field.value || ""}
                                      type="number"
                                      onChange={(e) => {
                                        const inputValue = e.target.value;

                                        if (!/^\d*\.?\d*$/.test(inputValue)) return;
                                        if (
                                          inputValue === "" ||
                                          (parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 1)
                                        ) {
                                          field.onChange(inputValue);
                                        }
                                      }}
                                    />
                                  )}
                                />
                                <span className="text-danger">
                                  {errors.commissionPercentage && errors.commissionPercentage.message}
                                </span>
                              </Col>
                            </>
                          )}
                        </Row>
                      </>
                    )}
                    {/* End of Shares section  */}
                    <hr className="border border-[#ecf3fa] opacity-25 mb-4" />
                    {whiteLabelData && userData?.userData?.role === layerRoles.WHITE_LABEL && selectedCurrency && (
                      <span className="text-danger">{`Please enter only ${selectedCurrency.label} currency`}</span>
                    )}
                    {/* Start of Balance Section  */}

                    <Row>
                      <H3 attrH3={{ className: "mb-3 fs-5" }}>{t("BALANCE")}</H3>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom07">{t("CREDIT_REFERENCE")}</Label>
                        <Controller
                          name="creditReference"
                          control={control}
                          rules={{
                            required: "This field is required.",
                            validate: validateCreditReference, // Add the custom validation rule
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_CREDIT_REFERENCE")}
                              className="form-control"
                              onKeyDown={handleKeyDown}
                              value={field.value || ""}
                              type="number"
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                field.onChange(numericValue);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.creditReference && errors.creditReference.message}</span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom07">{t("BALANCE")}</Label>
                        <Controller
                          name="balance"
                          control={control}
                          rules={{
                            validate: validateBalance, // Add the custom validation rule
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder={t("ENTER_BALANCE")}
                              className="form-control"
                              onKeyDown={handleKeyDown}
                              value={field.value || ""}
                              type="number"
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                field.onChange(numericValue);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">{errors.balance && errors.balance.message}</span>
                      </Col>
                    </Row>
                    {(userData?.userData?.role === layerRoles.DIRECTOR ||
                      userData?.userData?.role === ManagerRoles.ACCOUNTS_MANAGER) &&
                      selectedRole?.value !== layerRoles.USER && (
                        <>
                          <hr className="border border-[#ecf3fa] opacity-25 mb-4" />
                          <H3 attrH3={{ className: "mb-4 fs-5" }}>{t("CASINO")}</H3>
                          <Row className="d-flex flex-col flex-wrap  ">
                            <Col md="4 mb-3">
                              <Label htmlFor="validationCustom06">{t("CASINO")}</Label>
                              <Controller
                                name="casino"
                                control={control}
                                // rules={{ required: "This field is required." }}
                                render={({ field }) => {
                                  const filteredOptions =
                                    selectedCasinos?.length === 0
                                      ? availableCasinos
                                      : availableCasinos?.filter((option) => {
                                          if (selectedCasinos.some((selectedOption) => selectedOption.value === 0)) {
                                            // If "All" is selected, hide all other options
                                            return option.value === 0;
                                          } else if (
                                            selectedCasinos.some((selectedOption) => selectedOption.value === null)
                                          ) {
                                            return option?.value === null;
                                          } else {
                                            // If other option is not selected, hide the "All" option
                                            return option.value > 0;
                                          }
                                        });
                                  return (
                                    <Select
                                      {...field}
                                      options={filteredOptions} // from constants add available casino options
                                      isMulti={true}
                                      className="mySelect"
                                      placeholder={t("SELECT_DOT")}
                                      value={selectedCasinos}
                                      onChange={(option) => {
                                        setSelectedCasino(option);
                                        setIsRoleSelectOpen2(false);
                                        field.onChange(option);
                                      }}
                                      menuIsOpen={isRoleSelectOpen2} // Set menuIsOpen based on state
                                      onFocus={() => setIsRoleSelectOpen2(true)} // Open menu on focus
                                      onBlur={() => setIsRoleSelectOpen2(false)} // Close menu on blur
                                    />
                                  );
                                }}
                              />
                              {/* <span className="text-danger">
                                {errors.casino && errors.casino.message}
                              </span> */}
                            </Col>
                          </Row>
                        </>
                      )}

                    {/* End of Authorization Section  */}
                  </Form>
                </CardBody>
                <CardFooter className="py-3 text-center text-md-start">
                  <button form="create" type="submit" className="btn btn-success " color="success" disabled={isSubmit}>
                    {t("ADD_USER")}
                  </button>
                  <button className="btn ms-2" style={{ backgroundColor: "#CCC" }} onClick={handleClear}>
                    {t("RESET")}
                  </button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

export default AddUser;
