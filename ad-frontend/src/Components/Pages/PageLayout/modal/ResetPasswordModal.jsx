import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { resetPassword } from "../../../../redux/action";

const ResetPasswordModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [inputValues, setInputValues] = useState({
    password: "",
    resetPassword: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit = (data) => {
    const datas = {
      userId: props?.modalData?.userId,
      password: data?.password,
      resetPassword: data?.resetPassword,
    };
    setIsSubmit(true);
    dispatch(
      resetPassword({
        datas,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            props?.toggler(false);
            props?.fetchDefaultLayers();
          }
          setIsSubmit(false);
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
          className="px-1 text-dark"
          color="light dark"
        >
          <Modal.Title className="fs-6">
            <span>{props.title}</span>
            {" "}
            <span className="text-primary">{props?.modalData?.username} </span>
          </Modal.Title>
        </Modal.Header>
        <hr className="m-0 border border-[#a1a1a1] opacity-25" />
        <Form id="modalRPE" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className={`${props.bodyClass} px-4 py-3`}>

            <label htmlFor="" className="text-uppercase ps-1">
              {props.fieldTitle}
              <span className="text-danger fs-6">
                <sup>*</sup>
              </span>
            </label>
            <Controller
              name="resetPassword"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <input
                  placeholder="Enter new password"
                  type="password"
                  className="w-full h-50 text-dark form-control bg-transparent focus:bg-[white]  border border-gray-700  p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
              )}
            />
            <span className="text-danger">
              {errors.resetPassword && t("FIELD_REQUIRED")}
            </span>

          </Modal.Body>
          <Modal.Footer className="py-3">
            <Row className="d-flex">
              <Col className="d-flex gap-2">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder={t("PASSWORD")}
                      // onChange={(e) => handleInputChange(e)}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className="bg-transparent text-dark form-control focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    />
                  )}
                />

                <button
                  type="submit"
                  form="modalRPE"
                  disabled={isSubmit}
                  className="deposit-button text-white btn btn-success px-3 rounded-2"
                >
                  {t("SUBMIT")}
                </button>
              </Col>
              <span className="text-danger">
                {errors.password && t("FIELD_REQUIRED")}
              </span>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
