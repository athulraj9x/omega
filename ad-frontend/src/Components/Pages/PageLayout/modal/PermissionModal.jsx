import React, { useState } from "react";
import { Modal, Table, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import ToggleButton from "../../../Common/Component/Buttons/ToggleButton";
import { addPermission } from "../../../../redux/action";
import validatePermission from "../../../../validations/permission";

const PermissionModal = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(props?.modalData?.status);
  const [isSubmit, setIsSubmit] = useState(false);
  const [betAllow, setBetAllow] = useState(props?.modalData?.betAllow);
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  
 
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();
  const handleAllowAndBlock = (e) => {
    let bet_allow = betAllow;
    let data = {
      ids: [props.modalData.userId],
      password: password,
      status: status,
      betAllow: bet_allow?.toString(),
    };
    const newPermissions=data


    const { errors, isValid } = validatePermission(data);

    if (isValid) {
      setIsSubmit(true);
      dispatch(
        addPermission({
          data,
          callback: (data) => {
            setIsSubmit(false);
            if (data?.meta?.code === 200) {
              setPassword("");
              props?.updatePermissions(newPermissions)
              if (betAllow !== props?.modalData?.betAllow) {
                props.setDataUpdate((prev) => [...prev, props.modalData.index]);
              }
              props.toggler(false);
              if (status !== props?.modalData?.status)
                if (props?.modalData?.status === "1") {
                  if (props?.inactive) {
                    props.fetchInactiveLayers();
                  } else {
                    props.fetchDefaultLayers();
                  }
                } else {
                  props.fetchInactiveLayers();
                }
            }
          },
        })
      );
    } else {
      setError(errors);
    }
  };
  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={props.toggler}
        centered
        size={props.size}
        className=""
      >
        <Modal.Header closeButton className="px-1 text-dark" color="light dark">
          <Modal.Title className="fs-6">
            {props.title}
            <span className="text-primary ">
              {` ${props.modalData.username}`}
            </span>
          </Modal.Title>
        </Modal.Header>
        <hr className="m-0 border border-[#a1a1a1] opacity-25" />
        <Form id="modalPermission" onSubmit={handleSubmit(handleAllowAndBlock)}>
          <Modal.Body className={`${props.bodyClass} px-4 py-3`}>
            <Table
              responsive
              className="table table-bordered border-secondary p-0  "
            >
              <tbody className="text-dark">
                <tr className="">
                  <td className="fw-bold align-middle">
                    <Col>{t("ACTIVE")}</Col>
                  </td>
                  <td className="text-end">
                    <Col>
                      <ToggleButton
                        toggleAction={setStatus}
                        toggle={status}
                        permission={true}
                        actionId={"1"} // 1 for betAllow to add condition
                      />
                    </Col>
                  </td>
                </tr>

                <tr className="">
                  <td className="fw-bold align-middle">
                    <Col>{t("BET_ALLOW")}</Col>
                  </td>
                  <td className="text-end">
                    <Col>
                      <ToggleButton
                        toggleAction={setBetAllow}
                        toggle={betAllow ? "1" : "0"}
                        permission={true}
                        actionId={"0"} // 0 for betAllow to add condition
                      />
                    </Col>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="py-3">
            <Row className="d-flex">
              <Col className="d-flex gap-2">
                <input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder={t("PASSWORD")}
                  className="bg-transparent text-dark form-control focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                ></input>
                <span className="text-danger">
                  {error.password && error.password}
                </span>
                <button
                  form="modalPermission"
                  disabled={isSubmit}
                  className="deposit-button text-white btn btn-success px-3 rounded-2"
                >
                  {t("SUBMIT")}
                </button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default PermissionModal;
