import React, { useEffect, useState } from "react";
import { Input, Label, Media } from "reactstrap";

const ToggleButton = ({
  toggleAction,
  actionId,
  actionType,
  toggle,
  countryIndex,
  indexOne,
  indexTwo,
  indexThree,
  card,
  permission,
  sportsCode
}) => {
  const [checked, setChecked] = useState(toggle === "1");

  useEffect(() => {
    setChecked(toggle === "1");
  }, [toggle]);

  const handleClick = (e) => {
    e.stopPropagation();
    const newChecked = !checked;

    setChecked(newChecked);

    if (toggleAction) {
      // for permission modal
      if (permission) {
        if (newChecked) {
          if (actionId === "0") {
            toggleAction(true);
          } else {
            toggleAction("1");
          }
        } else {
          if (actionId === "0") {
            toggleAction(false);
          } else {
            toggleAction("0");
          }
        }
      } else {
        toggleAction(actionId, actionType, indexOne, indexTwo, indexThree,sportsCode,countryIndex);
      }
    }
  };

  return (
    <Media
      body
      className={`${card ? "text-center" : "text-left"} d-flex align-items-center justify-content-end`}
    >
      <Label className={`m-0 ${card ? "card-switch" : "switch"}`}>
        <Input
          type="checkbox"
          onClick={handleClick}
          checked={checked}
          // defaultChecked={checked}
          readOnly
        />
        <span className="switch-state" />
      </Label>
    </Media>
  );
};

export default ToggleButton;