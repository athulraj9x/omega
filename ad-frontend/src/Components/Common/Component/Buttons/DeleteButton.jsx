import React, { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import ConfirmModal from "../Modals/ConfirmModal";

const DeleteButton = ({
  clickAction,
  actionId,
  actionType,
  indexOne,
  indexTwo,
  indexThree,
  countryIndex,
  type,
  multi,
  disabled,
  sportsCode
}) => {
  const [isButtonDisabled, setButtonDisabled] = useState(
    disabled === "2" ? true : false
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (clickAction) {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    setButtonDisabled(disabled === "2" ? true : false);
  }, [disabled]);

  const handleDelete = () => {
    
    clickAction(actionId, actionType, indexOne, indexTwo, indexThree,sportsCode,countryIndex);
    setButtonDisabled(true);
    setModalOpen(false);
    if (multi) {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 2000);
    }
  };

  return (
    <>
      <div
        // className={`${
        //   isButtonDisabled ? "delete-btn-disabled" : "delete-btn"
        // } `}
        className="delete-btn"
        // onClick={isButtonDisabled ? null : handleClick}
        onClick={handleClick}
      >
        <MdDelete className="delete_btn-icon" />
        {multi && <span style={{ fontSize: "10px" }}>{actionId?.length}</span>}
      </div>
      <ConfirmModal
        open={isModalOpen}
        setOpen={setModalOpen}
        modalAction={handleDelete}
        title={type}
      />
    </>
  );
};

export default DeleteButton;
