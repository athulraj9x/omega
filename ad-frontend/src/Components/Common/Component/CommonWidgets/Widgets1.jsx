import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import { H4 } from "../../../../AbstractElements";
import SvgIcon from "../SvgIcon";
import { IoIosRefresh } from "react-icons/io";
import { getLiveExposureData } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//added
const Widgets1 = ({ data, handleLiveExposure }) => {
  const { t } = useTranslation();
const adminData = useSelector((state) => state.Login.userData);
  const [refresh, setRefresh] = useState(false);
  const [liveExposureValue, setLiveExposureDataValue] = useState(0);
  const dispatch = useDispatch();

  function liveExposureData() {
    setRefresh(true);
    setLiveExposureDataValue(0)
    dispatch(
      getLiveExposureData({
        onlyExposure: true,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setLiveExposureDataValue(data?.data?.exposure);
          }
        },
      })
    );
  }
  let title = data.title;
  return (
    <Card className="widget-1">
      <CardBody>
        <div className="widget-content">
          <div className={`widget-round ${data.color}`}>
            {handleLiveExposure && (adminData?.role === 1 || adminData?.role === 1.4) ? (
              <Link to="/exposure">
                <div
                  className="bg-round"
                  // onClick={
                  //   title === "LIVE_EXPOSURE" ? () => handleLiveExposure() : null
                  // }
                >
                  <SvgIcon className="svg-fill" iconId={`${data.icon}`} />
                  <SvgIcon
                    className="half-circle svg-fill"
                    iconId="halfcircle"
                  />
                </div>
              </Link>
            ) : (
              <div
                className="bg-round"
                // onClick={
                //   title === "LIVE_EXPOSURE" ? () => handleLiveExposure() : null
                // }
              >
                <SvgIcon className="svg-fill" iconId={`${data.icon}`} />
                <SvgIcon className="half-circle svg-fill" iconId="halfcircle" />
              </div>
            )}
          </div>
          <div>
            <div className="d-flex">
              <H4 color="dark" className="text-dark fs-2">
                {refresh ? liveExposureValue?.toFixed(2) : data?.total}
              </H4>
              <h3>
                {title === "LIVE_EXPOSURE" ? (
                  <IoIosRefresh
                    style={{ color: "green" }}
                    onClick={() => liveExposureData()}
                  />
                ) : null}
              </h3>
            </div>

            {/* <H4 color="dark" className="text-dark fs-2">
              {data?.total}
            </H4> */}
            <span className="f-light fs-6">{t(title)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Widgets1;
