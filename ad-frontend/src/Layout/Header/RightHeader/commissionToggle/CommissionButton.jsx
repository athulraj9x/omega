/** @format */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Label } from "reactstrap";
import { layerRoles } from "../../../../Constant";
import {
  currentCommissionStatus,
  setCommissionValue,
  setCurrentCommissionStatus,
} from "../../../../redux/action";
import { useEffect } from "react";

const CommissionButton = (props) => {
  const adminDataTemp = useSelector((state) => state.Login.userData);
  const [adminData, setAdminData] = useState(adminDataTemp);
  const dispatch = useDispatch();

  const [isCommissionToggle, setIsCommissionToggle] = useState(null);

  const handleCommission = (e) => {
    // setIsCommissionToggle(!isCommissionToggle)
    let data = {
      isChecked: e.target.checked,
      _id: adminData?.userId,
      isCommissionPrimary: true,
    };
    if (data?.isChecked !== undefined) {
      dispatch(
        setCommissionValue({
          data,
          callback: (data) => {
            if (data) {
              dispatch(
                currentCommissionStatus({
                  data: data,
                  callback: (data) => {

                  },
                })
              );
            }
          },
        })
      );
    }
  };

  useEffect(() => {
    let data = {
      isChecked: "undefined",
      _id: adminData?.userId,
      isCommissionPrimary: true,
    };
    if (data?.isChecked !== undefined) {
      dispatch(
        setCommissionValue({
          data,
          callback: (data) => {
            if (data) {
              dispatch(
                currentCommissionStatus({
                  data: data,
                  callback: (data) => {
                    setIsCommissionToggle(data?.isLayerCommission);
                  },
                })
              );
            }
          },
        })
      );
    }
  }, []);

  return (
    <span
      onClick={(e) => handleCommission(e)}
      style={{ cursor: "pointer" }}
      className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
      data-toggle="tooltip"
      data-placement="top"
      title={
        !adminData?.isCommission && adminData?.role !== layerRoles.DIRECTOR
          ? "Admin disabled commission"
          : "Enable Disable will effect All Child"
      }
    >
      {props.isMobile ? (
        <span className="fw-semibold fss-6 d-flex align-items-center">CM</span>
      ) : (
        <span className="fw-semibold fss-6 d-flex align-items-center">
          Commission
        </span>
      )}
      <Label className="m-0 switch">
        <input type="checkbox" defaultChecked={isCommissionToggle} />

        <span className="switch-state" />
      </Label>
    </span>
  );
};

export default CommissionButton;
