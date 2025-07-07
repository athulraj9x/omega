import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

const EditableChannelCodeField = ({
  channelCode,
  handleSubmitChannelCode,
  id,
  // isEditableRadarId,
  // setIsEditableRadarId,
  isCheck,
  setIsCheck,
}) => {
  const [inputValueChannelCode, setInputValueChannelCode] = useState(channelCode);
  const [eventId, setEventId] = useState("");
  const [isEditableRadarId, setIsEditableRadarId] = useState(false);
  
  useEffect(() => {
    if (eventId === id) {
      setIsEditableRadarId(true);
    } else {
      setIsEditableRadarId(false);
    }
  }, []);

  const toggleEditability = (e) => {
    e.stopPropagation();
    setEventId(id);
    setIsEditableRadarId(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setIsEditableRadarId(false);
    setIsCheck(true);
    // setInputValueChannelCode(radarId);
  };

  const handleInputChange = (e) => {
    setIsCheck(false);
    setInputValueChannelCode(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.target.value.length >= 9 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleSubmitOnEnter = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsCheck(true);
    setIsEditableRadarId(false);
    handleSubmitChannelCode(id, inputValueChannelCode); // Call your handleSubmit function
  };

  return (
    <form onSubmit={handleSubmitOnEnter}>
      <div className="d-flex align-items-center">
        <input
          className="form-control placeholder:text-xs"
          type="text"
          min={1}
          placeholder="channel code"
          value={inputValueChannelCode}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          disabled={!isEditableRadarId}
          style={{
            width: "110px",
          }}
        />

        <span className="cursor-pointer fs-5 lh-1 m-0 p-1 " color="success">
          {isEditableRadarId && eventId === id ? (
            <>
              {isCheck ? (
                <RxCross2
                  className="align-text-top fs-5 pointer"
                  onClick={handleClose}
                />
              ) : (
                <BsCheckLg
                  className="align-text-top fs-5 pointer"
                  onClick={() => handleSubmitChannelCode(id, inputValueChannelCode)}
                />
              )}
            </>
          ) : (
            <CiEdit
              className="align-text-top fs-5 pointer"
              onClick={toggleEditability}
            />
          )}
        </span>
      </div>
    </form>
  );
};

export default EditableChannelCodeField;
