import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import { H4 } from "../../../../AbstractElements";
import SvgIcon from "../SvgIcon";
import { IoIosRefresh } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CryptoPendingWithdrawalRequestComponent from "./CryptoWithdrawalPendingRequest";

//added
const WidgetsB2C = ({ data }) => {
  const whiteLabelData = useSelector((state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel)
  const { t } = useTranslation();
  return (
    <Card className="widget-1">
      <CardBody>
        <div className="widget-content">
          <div className={`widget-round ${data.color}`}>

            <div
              className="bg-round"
            >
              <SvgIcon className="svg-fill" iconId={`${data.icon}`} />
              <SvgIcon className="half-circle svg-fill" iconId="halfcircle" />
            </div>
          </div>
          <div className="ms-5">
            <H4 color="dark" className="text-dark fs-2">
              {data?.total}
            </H4>
            <span className="f-light fs-6">{t(data.title)}</span>
          </div>
          <Link to={data?.title.includes("Withdrawal") ? "/withdrawal-list" : "/deposit-list"}>
            <div className="ms-5">
              <h4 className="fs-2" style={{ color: data?.title.includes("Withdrawal") ? "red" : "green" }}>
                {data?.pending}
              </h4>
              <span className="f-light fs-6">{t("Requests Pending")}</span>
            </div>
          </Link>

          <CryptoPendingWithdrawalRequestComponent whiteLabelData={whiteLabelData} data={data} />

        </div>
      </CardBody>
    </Card>
  );
};

export default WidgetsB2C;
