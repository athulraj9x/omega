import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { client2FADetails } from "../../../../redux/action";
import { notifyDanger } from "../../../../utils/helper";

const UserAuthenticationModal = ({ userData, toggler, updatedLatest }) => {
  const dispatch = useDispatch();

  const [is2FAEnabled, setIs2FAEnabled] = useState(userData.twoFactorEnabled);

  const handleToggle2FA = () => {
    if (!is2FAEnabled) {
      notifyDanger("Please enable 2FA first");
      return;
    }

    setIs2FAEnabled(!is2FAEnabled);
    const data = {
      clientId: userData?.clientId,
      purpose: "updateDetails",
      TFAStatus: !is2FAEnabled,
    };
    dispatch(
      client2FADetails({
        data: data,
        callback: (data) => {

        },
      })
    );
  };

  return (
    <Modal
      show={true}
      onHide={() => {
        toggler(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="m-1">User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Client ID:</Form.Label>
          <Form.Control type="text" value={userData.clientId} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Username:</Form.Label>
          <Form.Control type="text" value={userData.username} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Two-Factor Enabled Status:</Form.Label>
          <Form.Check
            type="switch"
            id="2fa-toggle"
            style={{ cursor: "pointer", fontSize: "1.2rem" }} // Increase the font size
            checked={is2FAEnabled}
            onChange={handleToggle2FA}
            label={is2FAEnabled ? "Enabled" : "Disabled"}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Two-Factor Method:</Form.Label>
          <Form.Control type="text" value={userData.twoFactorMethod || "Not setted"} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Two-Factor Back-Up key:</Form.Label>
          <Form.Control type="text" value={userData.twoFactorSecret} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Two-Factor App login:</Form.Label>
          <Form.Control type="text" value={userData.twoFactorAuthPassword} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">QR Code:</Form.Label>
          <Image src={userData?.qrCode?.url} alt="QR Code Not created" fluid />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            toggler(false);
            updatedLatest();
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => toggler(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserAuthenticationModal;
