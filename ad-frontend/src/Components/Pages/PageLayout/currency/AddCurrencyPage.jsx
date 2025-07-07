import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Label, Row } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import { addCurrency } from "../../../../redux/action";

const AddCurrencyPage = () => {
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = usePageTitle();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data, e) => {
    setIsSubmit(true);
    setLoading(true);

    if (data !== "") {
      dispatch(
        addCurrency({
          data,
          callback: () => {
            reset();
            setIsSubmit(false);
            setLoading(false);
          },
        })
      );
    } else {
      errors.showMessages();
    }
  };
  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("ADD_CURRENCY")} title={title?.title} parent={title?.parent} />

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
                <Form className="needs-validation" noValidate="" onSubmit={handleSubmit(onSubmit)} id="add">
                  <Row className="d-flex flex-col flex-wrap">
                    <Col md="4 mb-3">
                      <Label className="col-form-label py-0" htmlFor="validationCustom00">
                        {t("CURRENCY_NAME")}
                      </Label>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "This field is required" }}
                        defaultValue=""
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
                      <span className="text-danger">{errors.name && t("FIELD_REQUIRED")}</span>
                    </Col>
                    <Col md="4 mb-3">
                      <Label htmlFor="validationCustom01">{t("CURRENCY_CODE")}</Label>
                      <Controller
                        name="code"
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
                      <span className="text-danger">{errors.code && t("FIELD_REQUIRED")}</span>
                    </Col>
                    <Col md="4 mb-3">
                      <Label htmlFor="validationCustom01">{t("CURRENCY_VALUE")}</Label>
                      <Controller
                        name="value"
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
                      <span className="text-danger">{errors.value && t("FIELD_REQUIRED")}</span>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter className="py-3 text-center text-md-start">
                <Button form="add" type="submit" className="" color="success" disabled={isSubmit}>
                  {t("ADD")}
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddCurrencyPage;
