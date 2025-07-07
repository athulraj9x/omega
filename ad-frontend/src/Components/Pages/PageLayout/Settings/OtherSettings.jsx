import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button, Card, CardBody, CardFooter, Col, Form, Label, Row} from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { getHelpline, addHelpline,deleteHelpline} from "../../../../redux/action";
import styles from "./Setting.module.css";

const CardWithInput = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { handleSubmit, control, reset } = useForm();

  const helplines = useSelector(
    (state) => state.GetHelplineReducer.helplineNos
  );
  const getHelplinesLoading = useSelector(
    (state) => state.GetHelplineReducer.loading
  );
  const whiteLabelType = useSelector((state)=>state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect when whiteLabelType is defined and not B2C
    if (!whiteLabelType && whiteLabelType !== "B2C") {
      navigate("/dashboard"); // Redirect to a "Not Authorized" page or any other route
    }
  }, [whiteLabelType, navigate]); // Only run when whiteLabelType changes
  // const handleKeyDown = (e) => {
    
  //   if (
  //     e.key === " " || 
  //     e.key === "_" ||
  //     e.key === "-" ||
  //     e.key === "." ||
  //     e.key === "e" ||
  //     e.key === "E" ||
  //     e.key === "ArrowDown" || 
  //     e.key === "ArrowUp"
  //   ) {
  //     e.preventDefault(); 
  //   }
  // };
  const validateForm = (data) => {
    let formErrors = {};
    if (!data.link) {
      formErrors.link = "Link  is required.";
    }
    // else if (!/^\d+$/.test(data.number)) {
    //   formErrors.number = "Number must contain only digits.";
    // } else if (data.number.length < 9 || data.number.length > 15) {
    //   formErrors.number = "Number must be between 9 and 15 digits.";
    // }
    return formErrors;
  };
  
  const onSubmit = (data) => {
    const formErrors = validateForm(data);
    if (Object.keys(formErrors)?.length === 0) {
      dispatch(
        addHelpline({
          link: data,
          callback: (data) => {
            if (data.meta.code === 200) {
              handleClear();
              setErrors({});
            }
          },
        })
      );
    } else {
      setErrors(formErrors);
    }
  };

  const handleClear = () => {
    reset();
  };

  useEffect(() => {
    dispatch(getHelpline({}));
  }, []);

  const handleDelete = (helplineId) => {
    dispatch(deleteHelpline({ helplineId }));
  };

  return (
    <>
      <Breadcrumbs
        mainTitle={t("Add Helpline")}
        title={title?.title}
        parent={title?.parent}
        className="ms-2"
      />

      <Card>
        <CardBody>
          <Form
            className="needs-validation"
            noValidate=""
            id="create"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Row>
              <Col md="4 mb-3">
                <Label className="col-form-label py-0" htmlFor="name">
                  {t("ADD_HELPLINE_LINK")}
                </Label>
                <Controller
                  name="link"
                  control={control}
                  rules={{
                    required: "This field is required.",
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder={t("ENTER_LINK_HERE")}
                      className={`form-control ${styles.inputField}`}
                      value={field.value || ""}
                      // onKeyDown={handleKeyDown}
                      type="text"
                    />
                  )}
                />
                <span className="text-danger mt-3">
                  {errors.link && errors.link}
                </span>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <CardFooter className="py-3 text-center text-md-start">
          <button
            form="create"
            type="submit"
            className="btn btn-success"
            color="success"
            disabled={getHelplinesLoading}
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
      <h2 className="text-center my-4">{t("HELPLINE_LINKS")}</h2>
      <Card>
        <CardBody>
          {helplines && helplines?.length > 0 ? (
            <Row>
              {helplines.map((helpline, index) => (
                <Col
                  key={index}
                  md={4}
                  className="mb-3 d-flex flex-column align-items-center"
                >
                  <div className="mb-2">
                    <strong>{helpline}</strong>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(helpline)}
                  >
                    Delete
                  </Button>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No helplines available</p>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default CardWithInput;