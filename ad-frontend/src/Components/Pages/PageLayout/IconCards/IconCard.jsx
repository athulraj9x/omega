import React from "react";
import { ACTIONTYPES } from "../../../../Constant";
import ToggleButton from "../../../Common/Component/Buttons/ToggleButton";

const IconCard = ({
  iconName,
  name,
  setSelected,
  handleSportClick,
  sportId,
  index,
  status,
  handleToggle,
}) => {
  const handleClick = () => {
    setSelected({ name, sportId });
    handleSportClick(sportId);
  };

  return (
    <div className="bg-light border p-1 rounded card-bdy">
      <div
        className="cardBg rounded px-2 py-2 d-flex flex-column align-items-center"
        onClick={handleClick}
      >
        <img
          src={require(`../../../../assets/images/sports-icons/${iconName}.png`)}
          className="iconCard-img p-md-1 p-lg-2 p-1"
          alt={iconName}
        />
        <p
          className="m-0 text-center text-black text-truncate col-10 text-nowrap fw-medium"
          style={{ fontSize: "13px" }}
        >
          {name}
        </p>
      </div>
      <div className="d-flex mt-2 align-items-center justify-content-center">
        <ToggleButton
          card={true}
          actionId={sportId}
          actionType={ACTIONTYPES.sport}
          indexOne={index}
          toggle={status}
          toggleAction={handleToggle}
        />
      </div>
    </div>
  );
};

export default IconCard;
