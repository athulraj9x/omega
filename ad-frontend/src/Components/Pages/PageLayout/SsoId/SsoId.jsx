import React, { Fragment, useEffect, useState } from "react";
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
  CardHeader,
  Label,
  Media,
} from "reactstrap";
import {
  notifyWarning,
  notifySuccess,
  notifyDanger,
} from "../../../../utils/helper";
import { useDispatch } from "react-redux";
import { addssoId } from "../../../../redux/action";
import { addBetxExchangeSsoId } from "../../../../redux/action"
import {betxexchangeid } from "../../../../utils/helper";

const SsoId = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [ssoId, setSsoId] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState(false);

  const [ssoIdMarket, setSsoIdMarket] = useState("");
  const [betxFairCheckbox, setBetxFairCheckbox] = useState(false);
  const [ssoIdMarketDefaultValue, setSsoIdMarketDefaultValue] = useState("");
  const [dateBetxFair, setDateBetxFair] = useState("");

  useEffect(() => {
    const param = {
      get: true,
      val: country ? "odds" : "bets",
    };
    dispatch(
      addssoId({
        param,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setDefaultValue(data?.data[0]?.ssoId);
            setSsoId(data?.data[0]?.ssoId);
            setDate(data?.data[0]?.updatedAt);
          } else {
            setSsoId("");
            setDate("");
            notifyDanger(data?.meta?.message);
          }
        },
      })
    );
    const betxparam={
      get:true
    }
    dispatch(
      addBetxExchangeSsoId({
        betxparam,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setSsoIdMarketDefaultValue(data?.data?.ssoId);
            setSsoIdMarket(data?.data?.ssoId)
            setDateBetxFair(data?.data?.updatedAt)
          } else {
            setSsoIdMarket("");
            setDateBetxFair("");
            notifyDanger(data?.meta?.message);
          }
        },
      })
    );
  }, [country]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (ssoId.trim() !== "") {
      const param = { ssoId, type: country ? "odds" : "bets" };
      dispatch(
        addssoId({
          param,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              notifySuccess("Sso ID added successfully");
              setDefaultValue(ssoId);
              const currentDate = new Date();
              setDate(currentDate);
              // setSsoId("");
            } else {
              notifyDanger("Error in addding Sso Id");
            }
          },
        })
      );
    } else {
      notifyWarning("Please enter the SsoId");
    }
  };

  const onSubmitMarket = (e) => {
     e.preventDefault();
     if (ssoIdMarket.trim() !== "") {
      const param = { ssoId:ssoIdMarket, id:betxexchangeid, active: true };
      dispatch(
        addBetxExchangeSsoId({
          param,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              notifySuccess("Sso ID added successfully");
              setSsoIdMarketDefaultValue(ssoId);
              const currentDate = new Date();
              setDate(currentDate);
            } else {
              notifyDanger("Error in addding Sso Id");
            }
           },
        })
      );
    } else {
      notifyWarning("Please enter the SsoId");
    }
  };

  const handleSelectAllChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setBetxFairCheckbox(!betxFairCheckbox)
  }
  
  const handleBetfair = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCountry(!country);
    // setSsoId("");
    // setDefaultValue("");
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("ADD_SSO_ID")}
        title={title?.title}
        parent={title?.parent}
        className="ms-2"
      />

      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardHeader>
              <Media
                body
                className={`${"text-left"} d-flex align-items-center justify-content-end gap-2`}
              >
                <span
                  onClick={(e) => handleBetfair(e)}
                  style={{ cursor: "pointer" }}
                  className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                >
                  <span className="fw-semibold fs-6 d-flex align-items-center">
                    {country ? "odds" : "bets"}
                  </span>

                  <Label className={`m-0 ${"switch"}`}>
                    <input type="checkbox" checked={country} />
                    <span
                      className="switch-state"
                      style={{
                        backgroundColor: country ? "limegreen" : "lightgray",
                      }}
                    />
                  </Label>
                </span>
              </Media>
            </CardHeader>
            <CardBody>
              <Form
                className="needs-validation d-flex"
                noValidate=""
                id="create"
                onSubmit={onSubmit}
              >
                <Input
                  type="text"
                  value={ssoId}
                  onChange={(e) => setSsoId(e.target.value)}
                  className="w-50"
                >
                  {" "}
                </Input>
                <Button
                  disabled={defaultValue === ssoId}
                  className="m-2"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </CardBody>
            <CardFooter>
              <p className="text-danger">
                last update at :{" "}
                <span className="fw-900">
                  {date ? new Date(date).toLocaleString() : ""}
                </span>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardHeader>
              <Media
                body
                className={`${"text-left"} d-flex align-items-center justify-content-end gap-2`}
              >
                <span
                  onClick={(e) => handleSelectAllChange(e)}
                  style={{ cursor: "pointer" }}
                  className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                >
                  <span className="fw-semibold fs-6 d-flex align-items-center">
                    {t("BetXFair API")}
                  </span>

                  <Label className={`m-0 ${"switch"}`}>
                    <input type="checkbox" checked={betxFairCheckbox} />
                    <span
                      className="switch-state"
                      style={{
                        backgroundColor: betxFairCheckbox ? "limegreen" : "lightgray",
                      }}
                    />
                  </Label>
                </span>
              </Media>
            </CardHeader>
            <CardBody>  
              <Form
                className="needs-validation d-flex"
                noValidate=""
                id="create"
                onSubmit={onSubmitMarket}
              >
                <Input
                  type="text"
                  value={ssoIdMarket}
                  onChange={(e) => setSsoIdMarket(e.target.value)}
                  className="w-50"
                  disabled={!betxFairCheckbox}
                >
                  {" "}
                </Input>
                <Button
                  disabled={ssoIdMarket === ssoIdMarketDefaultValue || ssoIdMarket === "" || !betxFairCheckbox}
                  className="m-2"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </CardBody>
            <CardFooter>
              <p className="text-danger">
                last update at :{" "}
                <span className="fw-900">
                  {dateBetxFair ? new Date(dateBetxFair).toLocaleString() : ""}
                </span>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default SsoId;
