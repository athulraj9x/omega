import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  CardFooter,
} from "reactstrap";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Breadcrumbs, H3 } from "../../../../AbstractElements";
import Loader from "../../../../Layout/Loader";
import { ManagerOptions, ManagerRoles, nameRegex, ManagerMonitorAccessibility } from "../../../../Constant/index";
import { addLayer, addManager, getCurrency, getLayersForManager } from "../../../../redux/action";

const AddManager = () => {
  const title = usePageTitle();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const userData = useSelector((state) => state.Login);
  const addManagerState = useSelector((state) => state.AddManager);

  const [togglePassword, setTogglePassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMonitorAccessibility, setSelectedMonitorAccessibility] = useState("");
  const [layers, setLayers] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  useEffect(() => {
    if (userData?.userData?.role > 1) {
      const roles = ManagerOptions.filter((data) => {
        return data.value > userData?.userData?.role;
      });
      setRoles(roles);
    } else {
      setRoles(ManagerOptions);
    }
  }, [userData]);

  useEffect(() => {
    if (![ManagerRoles.MONITORING_MANAGER]?.includes(selectedRole?.value)) {
      setSelectedLayers([]);
      setSelectedMonitorAccessibility("");
    }
  }, [selectedRole?.value]);


  useEffect(() => {
    if (selectedMonitorAccessibility?.value === ManagerMonitorAccessibility[1]?.value) {
      dispatch(
        getLayersForManager({
          callback: (res) => {
            let data = res?.data?.map((ele) => {
              return ({
                label: `${ele?.username}${"    "}#${ele?.role}`,
                value: ele?._id
              })
            })
            setLayers(data);
          },
        })
      );
    }
  }, [selectedMonitorAccessibility]);

  const alreadyExist = (type, value) => {
    const isExist = userData?.userData?.alreadyExist?.find((checked) => {
      return checked?.[type] == value;
    });
    if (isExist !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const validateName = (value) => {
    if (nameRegex.test(value)) {
      return true;
    } else {
      return "Name must be only characters.";
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

  //Handle the Form Clear Button
  const handleClear = () => {
    reset({
      name: "",
      username: "",
      mobileNo: "",
      password: "",
      role: 0,
    }); // Clear the form controls
    setSelectedRole(""); // Reset selected role
  };

  const onSubmit = (data) => {
    data = { ...data, sportShares: userData?.userData?.sportShares };
    if (selectedMonitorAccessibility?.value) {
      data = { ...data, monitoring_manager_accessibility: selectedMonitorAccessibility?.value?.toString() };
    }

    setIsSubmit(true);
    setLoading(true);
    dispatch(
      addManager({
        data,
        callback: (res) => {
          setLoading(false);
          if (res?.meta?.code === 200) {
            handleClear();
          }
          setIsSubmit(false);
        },
      })
    );
  };

  useEffect(() => {
    setIsSubmit(false);
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

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("ADD_MANAGER")}
        title={title?.title}
        parent={title?.parent}
      />
      {addManagerState?.loading ? (
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
                  <Form
                    className="needs-validation"
                    noValidate=""
                    id="create"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {/* Started Personal Details  */}
                    <H3 attrH3={{ className: "mb-4 fs-5" }}>
                      {t("PERSONAL_DETAILS")}
                    </H3>
                    <Row className="d-flex flex-col flex-wrap ">
                      <Col md="4 mb-3">
                        <Label
                          className="col-form-label py-0"
                          htmlFor="validationCustom00"
                        >
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
                        <span className="text-danger">
                          {errors.name && errors.name.message}
                        </span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom01">
                          {t("USER_NAME")}
                        </Label>
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
                        <span className="text-danger">
                          {errors.username && errors.username.message}
                        </span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom02">
                          {t("EMAIL")}{" "}
                          <span style={{ fontSize: "12px", color: "#818188" }}>
                            {t("(Optional)")}
                          </span>
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
                        <span className="text-danger">
                          {errors.email && errors.email.message}
                        </span>
                      </Col>
                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom03">
                          {t("MOBILE_NO")}{" "}
                          <span style={{ fontSize: "12px", color: "#818188" }}>
                            {t("(Optional)")}
                          </span>
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
                                const numericValue = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                field.onChange(numericValue);
                              }}
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.mobileNo && errors.mobileNo.message}
                        </span>
                      </Col>
                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom07">
                          {t("PASSWORD")}
                        </Label>
                        <Controller
                          name="password"
                          control={control}
                          rules={{ required: "This field is required." }}
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
                        <span className="text-danger">
                          {errors.password && errors.password.message}
                        </span>
                        <div
                          className="show-or-hide"
                          onClick={() => setTogglePassword(!togglePassword)}
                        >
                          <span className={togglePassword ? "" : "show"}></span>
                        </div>
                        <span className={togglePassword ? "" : "show"}></span>
                      </Col>

                      <Col md="4 mb-3">
                        <Label htmlFor="validationCustom04">
                          {t("CURRENCY")}
                        </Label>
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
                        <span className="text-danger">
                          {errors.currencyId && t("fieldRequired")}
                        </span>
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
                                field.onChange(option?.value);
                                setIsRoleSelectOpen(false);
                              }}
                              menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.role && errors.role.message}
                        </span>
                      </Col>

                      {(selectedRole !== "" && selectedRole?.value === ManagerRoles?.MONITORING_MANAGER) && <Col md="4 mb-3">
                        {/* <H3 attrH3={{ className: "mb-3" }}>{t("Ranking")}</H3> */}
                        <Label htmlFor="validationCustom04">{t("MONITOR_MANAGER_ACCESSIBILITY")}</Label>
                        <Controller
                          name="monitoring_manager_accessibility"
                          control={control}
                          // rules={{ required: "This field is required." }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={ManagerMonitorAccessibility}
                              required
                              className="mySelect"
                              placeholder={t("SELECT_DOT")}
                              value={selectedMonitorAccessibility}
                              onChange={(option) => {
                                setSelectedMonitorAccessibility(option);
                                field.onChange(option?.value);
                                // setIsRoleSelectOpen(false);
                              }}
                            // menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                            // onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                            // onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.role && errors.role.message}
                        </span>
                      </Col>}

                      {((selectedMonitorAccessibility !== "" && selectedMonitorAccessibility?.value === ManagerMonitorAccessibility[1]?.value) && selectedRole?.value === ManagerRoles?.MONITORING_MANAGER) && <Col md="4 mb-3">
                        {/* <H3 attrH3={{ className: "mb-3" }}>{t("Ranking")}</H3> */}
                        <Label htmlFor="validationCustom04">{t("MONITOR_MANAGER_ACCESSIBILITY")}</Label>
                        <Controller
                          name="layers"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={layers}
                              isMulti // Enables multi-selection
                              className="mySelect"
                              placeholder={t("SELECT_DOT")}
                              value={selectedLayers}
                              onChange={(options) => {
                                setSelectedLayers(options);
                                field.onChange(options.map(option => option.value)); // Pass array of selected values to the controller
                                // setIsRoleSelectOpen(false);
                              }}
                            // menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                            // onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                            // onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.role && errors.role.message}
                        </span>
                      </Col>}

                    </Row>
                    {/* Personal Details Section End  */}
                  </Form>
                </CardBody>
                <CardFooter className="py-3 text-center text-md-start">
                  <button
                    form="create"
                    type="submit"
                    className="btn btn-success "
                    color="success"
                    disabled={isSubmit}
                  >
                    {t("ADD")}
                  </button>
                  <button
                    className="btn ms-2"
                    style={{ backgroundColor: "#CCC" }}
                    onClick={handleClear}
                  >
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

export default AddManager;
