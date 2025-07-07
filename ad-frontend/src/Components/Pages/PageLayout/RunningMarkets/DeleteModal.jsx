import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ChangeStatusModal = ({ item, changeStatus }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangeStatus = () => {
    changeStatus(item?._id);
    handleClose();
  };

  return (
    <>
      <Button className="btn text-white" style={{ backgroundColor: "rgb(115, 103, 253)" }} onClick={handleShow}>
        Change
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangeStatus}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangeStatusModal;
