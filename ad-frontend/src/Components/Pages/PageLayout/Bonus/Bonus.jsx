import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Button,
  CardFooter,
} from "reactstrap";
import {
  notifyWarning,
  notifySuccess,
  notifyDanger,
} from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { userBonus, getBonus, getCurrency } from "../../../../redux/action";

const Bonus = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const get_bonus = useSelector((state) => state?.Bonus);
  const currencyData = useSelector((state) => state?.GetCurrency?.currencyData);

  const [formValues, setFormValues] = useState({
    bonus: 0,
    bonusPercentage: 0,
    cryptoPaymentLimit: 0
  });

  const [bonusDate, setBonusDate] = useState("");
  const [bonusPercentageDate, setBonusPercentageDate] = useState("");
  const [cryptoPaymentLimitUpdatedDate, setCryptoPaymentLimitUpdatedDate] = useState("");
  const [availableCurrency, setAvailableCurrency] = useState(null);


  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (get_bonus) {
      setFormValues({
        bonus: get_bonus?.bonus?.bonus || 0,
        bonusPercentage: get_bonus?.bonus?.bonusPercentage || 0,
        cryptoPaymentLimit: parseFloat((100) * Number(get_bonus?.bonus?.cryptoPaymentLimit)) || 0,
      });

      setBonusDate(get_bonus?.bonus?.bonusUpdatedDate || "");
      setBonusPercentageDate(get_bonus?.bonus?.bonusPercentageUpdatedDate || "");
      setCryptoPaymentLimitUpdatedDate(get_bonus?.bonus?.cryptoPaymentLimitUpdatedDate || "");
    }
  }, [get_bonus]);

  const init = useCallback(() => {
    dispatch(getBonus({}));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate bonusPercentage to be between 0 and 100
    if (name === "bonusPercentage") {
      if (/^\d*$/.test(value) && (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 100))) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: parseInt(value),
        }));
      }
    } else if (name === "cryptoPaymentLimit") {
      if (/^\d*$/.test(value) && (value === "" || (parseInt(value) >= 0))) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: parseInt(value),
        }));
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: parseInt(value),
      }));
    }
  };

  const handleInputBonusChange = (e) => {
    const { name, value } = e.target;
    // Validate bonusPercentage to be between 0 and 100
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: parseInt(value),
    }));
  };

  const onBonusPercentagSubmit = (e) => {
    e.preventDefault();
    const { bonusPercentage } = formValues;

    if (bonusPercentage === 0) {
      notifyWarning("Please enter Bonus Percentage");
      return;
    }

    const form = { bonusPercentage };
    dispatch(
      userBonus({
        form,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setBonusPercentageDate(data?.data?.bonus?.bonusPercentageUpdatedDate || "");
            notifySuccess("Bonus Percentage updated successfully");
          } else {
            notifyDanger("Error in updating Bonus");
          }
        },
      })
    );
  };

  const onSubmitBonus = (e) => {
    e.preventDefault();
    const { bonus } = formValues;

    if (bonus === 0 || isNaN(bonus)) {
      notifyWarning("Please enter Bonus");
      return;
    }

    const form = { bonus };
    dispatch(
      userBonus({
        form,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setBonusDate(data?.data?.bonus?.bonusUpdatedDate || "");
            notifySuccess("Bonus updated successfully");
          } else {
            notifyDanger("Error in updating Bonus");
          }
        },
      })
    );
  };
  const onSubmitCryptoPaymentLimit = (e) => {
    e.preventDefault();
    const { cryptoPaymentLimit } = formValues;

    if (cryptoPaymentLimit === 0 || isNaN(cryptoPaymentLimit)) {
      notifyWarning("Please Enter Valid CryptoPayment Limit");
      return;
    }

    const form = { cryptoPaymentLimit: parseFloat((Number(availableCurrency?.value) * Number(cryptoPaymentLimit))?.toFixed(2)) };
    console.log({ form })
    dispatch(
      userBonus({
        form,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setCryptoPaymentLimitUpdatedDate(data?.data?.bonus?.bonusUpdatedDate || "");
            notifySuccess("CryptoPayment updated successfully");
          } else {
            notifyDanger("Error in updating CryptoPayment");
          }
        },
      })
    );
  };

  useEffect(() => {
    if (!currencyData || currencyData === null) {
      dispatch(
        getCurrency({
          callback: (data) => {
            const usdCurrency = data.find((currency) => currency?.code === "USD");
            if (usdCurrency) {
              setAvailableCurrency(usdCurrency);
            }
          },
        })
      );
    } else {
      const usdCurrency = currencyData?.find((currency) => currency?.code === "USD");
      if (usdCurrency) {
        setAvailableCurrency(usdCurrency);
      }
    }
  }, [currencyData, dispatch]);

console.log({formValues})
  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("BONUS")}
        title={title?.title}
        parent={title?.parent}
        className="ms-2"
      />

      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              <Form className="needs-validation" noValidate="" id="create" onSubmit={onSubmitBonus}>
                <Row className="mb-3">
                  <Col sm="6">
                    <Input
                      type="number"
                      name="bonus"
                      value={formValues.bonus}
                      onChange={handleInputBonusChange}
                      placeholder="Enter Bonus"
                    />
                  </Col>
                </Row>
                <Button type="submit">Update Users Bonus</Button>
              </Form>
            </CardBody>
            <CardFooter>
              <p className="text-danger">
                Last update at:{" "}
                <span className="fw-900">
                  {bonusDate ? new Date(bonusDate).toLocaleString() : ""}
                </span>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              <Form className="needs-validation" noValidate="" id="create" onSubmit={onBonusPercentagSubmit}>
                <Row className="mb-3">
                  <Col sm="6">
                    <span className="d-flex text-danger">
                      <p>*</p>
                      <p>{`A bonus of ${formValues.bonusPercentage}% will be added to the user's first deposit. For example, if the deposit amount is ₹1000, the user will receive an additional ₹${(formValues.bonusPercentage / 100) * 1000} as a bonus.`}</p>
                    </span>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm="6">
                    <Input
                      type="number"
                      name="bonusPercentage"
                      value={formValues.bonusPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter Bonus Percentage"
                      min="0"
                      max="100"
                      step="1"
                      onKeyDown={(e) => {
                        if (['e', 'E', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Button type="submit">First deposit Bonus</Button>
              </Form>
            </CardBody>
            <CardFooter>
              <p className="text-danger">
                Last update at:{" "}
                <span className="fw-900">
                  {bonusPercentageDate ? new Date(bonusPercentageDate).toLocaleString() : ""}
                </span>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              <Form className="needs-validation" noValidate="" id="create" onSubmit={onSubmitCryptoPaymentLimit}>
                <Row>
                  <Col sm="6">
                    <span className="d-flex text-danger">
                      <p>*</p>
                      {formValues.cryptoPaymentLimit > 0 && 
                      <>
                      <p>
                      {`A USDT of ${(availableCurrency?.value && formValues?.cryptoPaymentLimit) ? (Number(availableCurrency?.value) * Number(formValues?.cryptoPaymentLimit))?.toFixed(2) : 0} will be the limit.`}
                      {` For example, if the user crypto withdrawal amount is morethan USDT ${(Number(availableCurrency?.value) * Number(formValues?.cryptoPaymentLimit))?.toFixed(2)}, then the userParent (B2C whiteLabel) approval required to remaining process.`}
                      </p>
                      <br/>
                      </>
                      }
                    </span>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm="6">
                    <Input
                      type="number"
                      name="cryptoPaymentLimit"
                      value={formValues.cryptoPaymentLimit}
                      onChange={handleInputBonusChange}
                      placeholder="Enter crypto PaymentLimit In INR"
                    />
                  </Col>
                </Row>
                <Button type="submit">Update Users Crypto Payment Limit</Button>
              </Form>
            </CardBody>
            <CardFooter>
              <p className="text-danger">
                Last update at:{" "}
                <span className="fw-900">
                  {cryptoPaymentLimitUpdatedDate ? new Date(cryptoPaymentLimitUpdatedDate).toLocaleString() : ""}
                </span>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Bonus;
