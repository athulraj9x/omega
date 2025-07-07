import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

const EditableInputField = ({ oddValue, handleSubmit, id, edit }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(oddValue);
  useEffect(() => {
    setIsEditable(false);
  }, [edit]);

  const toggleEditability = () => {
    setIsEditable(true);
  };
  const handleClose = () => {
    setIsEditable(false);
    setInputValue(oddValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Allow only numeric keys (0-9), Backspace, Delete, and Arrow keys
    const input = e.target;

    if (input.value.length >= 4) {
      e.preventDefault(); // Prevent the default tab behavior
    }
  };

  const handleSubmitOnEnter = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleSubmit(id, inputValue); // Call your handleSubmit function
  };

  return (
    <form onSubmit={handleSubmitOnEnter}>
      <div className="d-flex align-items-center">
        <input
          className="form-control"
          type="number"
          min={1}
          placeholder="odd Limit"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          disabled={!isEditable}
          style={{
            width: "110px",
          }}
        />

        <span
          className="cursor-pointer fs-5 lh-1 m-0 p-1 "
          color="success"
        >
          {isEditable ? (
            <>
              {inputValue === undefined ||
              inputValue === oddValue ||
              inputValue === "" ? (
                <RxCross2
                  className="align-text-top fs-5 pointer"
                  onClick={handleClose}
                />
              ) : (
                <BsCheckLg
                  className="align-text-top fs-5 pointer"
                  onClick={() => handleSubmit(id, inputValue)}
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

export default EditableInputField;
