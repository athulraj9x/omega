/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "reactstrap";
import { restrictClientBets } from "../../../../redux/action";

const BetRestrictToggle = () => {
  const dispatch = useDispatch();
  const [isClientBetAllow, setisClientBetAllow] = useState(null);

  useEffect(() => {
    dispatch(
      restrictClientBets({
        status: "undefined",
        callback: (data) => {
          if (data) {
            setisClientBetAllow(data?.data?.layersBetAllow);
          }
        },
      })
    );
  },[]);

  const handleRestrictBet = (e) => {
    let status = e.target.checked;
    if (status !== undefined) {
      dispatch(
        restrictClientBets({
          status: status,
          callback: (data) => {
            if (data) {
              setisClientBetAllow(data.layersBetAllow);
            }
          },
        })
      );
    }
  };

  return (
    <span
      onClick={(e) => handleRestrictBet(e)}
      style={{ cursor: "pointer" }}
      className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
      data-toggle="tooltip"
      data-placement="top"
      title={"Enable Disable will effect All Child"}
    >
      <span className="fw-semibold fss-6 d-flex align-items-center">
        Allow Bets
      </span>
      <Label className="m-0 switch">
        <input type="checkbox" defaultChecked={isClientBetAllow} />
        <span className="switch-state" />
      </Label>
    </span>
  );
};

export default BetRestrictToggle;
