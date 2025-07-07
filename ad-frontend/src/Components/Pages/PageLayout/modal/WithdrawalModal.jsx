// import React from "react";
import { Modal} from "react-bootstrap";

const WithdrawlModal = (props) => {
  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title className="m-0">Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`text-center`}>
        <img width="600" height="500" className="mb-5" src={props.imageUrl} alt="PaymentImage" />
      </Modal.Body>
    </Modal>
  );
};

export default WithdrawlModal;
