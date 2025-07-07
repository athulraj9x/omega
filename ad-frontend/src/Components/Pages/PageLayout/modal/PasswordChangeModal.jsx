import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { changePassword } from "../../../../redux/action";
import { Controller, useForm } from "react-hook-form";

const PasswordChangeModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [inputValues, setInputValues] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmitButton = () => {
        
  }

  const onSubmit = (data) => {
    const datas = {
      userId: props?.modalData?.userId,
      old_password: data?.old_password,
      password: data?.password,
      confirm_password: data?.confirm_password,
    };
    dispatch(
      changePassword({
        datas,
        callback: (data) => {
          props.toggler(false);
        },
      })
    ); //add redux function
  };
  
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
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
        <Modal.Header
          closeButton
          className="px-1 bg-light text-black"
          color="light dark"
        >
          <Modal.Title className="fs-6 ">

            <span className="text-primary">{props?.modalData?.username} </span>
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <hr className="m-0 border border-[#a1a1a1] opacity-25" />
        <Modal.Body className={`${props.bodyClass} px-4 py-3`}>
          <Form className="d-flex flex-column gap-3" id="modalCP" onSubmit={handleSubmit(onSubmit)}>
            <div className="current-password">
              <label htmlFor="" className="ps-1">
                {props.currentPassword}
                <span className="text-danger fs-6">
                  <sup>*</sup>
                </span>
              </label>
              <Controller
                name="old_password"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <input
                    type="password"
                    className="w-full h-50 text-black form-control bg-transparent focus:bg-[white]  border border-gray-700  p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    onChange={(e) => field.onChange(e.target.value)}

                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                )}
              />
            </div>
            <span className="text-danger">
              {errors.old_password && t("FIELD_REQUIRED")}
            </span>
            <div className="new-password">
              <label htmlFor="" className="ps-1">
                {props.newPassword}
                <span className="text-danger fs-6">
                  <sup>*</sup>
                </span>
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <input
                    type="password"
                    className="w-full h-50 text-black form-control bg-transparent focus:bg-[white]  border border-gray-700  p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                )}
              />
            </div>
            <span className="text-danger">
              {errors.confirmPassword && t("FIELD_REQUIRED")}
            </span>
            <div className="confirm-password">
              <label htmlFor="" className="ps-1">
                {props.confirmPassword}
                <span className="text-danger fs-6">
                  <sup>*</sup>
                </span>
              </label>
              <Controller
                name="confirm_password"
                control={control}
                rules={{
                  required: "This field is required" }}
                render={({ field }) => (
                  <input
                    type="password"
                    className="w-full h-50 text-black form-control bg-transparent focus:bg-[white]  border border-gray-700  p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    onChange={(e) => field.onChange(e.target.value)}

                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                )}
              />
            </div>
            <span className="text-danger">
              {errors.confirm_password && t("FIELD_REQUIRED")}
            </span>
          </Form>
        </Modal.Body>
        <Modal.Footer className="py-3">
          <Row className="d-flex">
            <Col className="d-flex gap-2">
              <button
                type="submit"
                form="modalCP"
                className="deposit-button text-white btn btn-success px-3 rounded-2"
                onClick={handleSubmitButton}
              >
                {t("SUBMIT")}
              </button>
            </Col>
           
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PasswordChangeModal;
