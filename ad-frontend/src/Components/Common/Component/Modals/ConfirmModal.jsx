import React from "react";
import { Btn } from "../../../../AbstractElements";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ConfirmModal = ({ open, setOpen, modalAction, title }) => {
  const handleCancelClick = () => {
    setOpen(false);
  };

  const handleClick = () => {
    modalAction();
  };
  return (
    <Modal isOpen={open} size="sm" centered>
      <ModalHeader className="d-flex justify-content-center">
        Delete {title}
      </ModalHeader>
      <ModalBody className={"props.bodyClass"}>
        <div className="d-flex justify-content-center">
          <h6>Are you Sure?</h6>
        </div>
        <div className="d-flex justify-content-center">
          <p>You want to Delete the data!</p>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Btn attrBtn={{ color: "primary", onClick: handleCancelClick }}>
          {"Close"}
        </Btn>
        <Btn attrBtn={{ color: "danger", onClick: handleClick }}>
          {"Delete"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
