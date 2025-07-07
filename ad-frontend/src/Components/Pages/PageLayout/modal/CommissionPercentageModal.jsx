import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { notifyWarning } from "../../../../utils/helper";
import { updateCommissionPercentage } from "../../../../redux/action";

const CommissionPercentageModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      commissionPercentage: props.modalData.commissionPercentage,
    },
  });

  const [isSubmit, setIsSubmit] = useState(true);
  const [value, setValue] = useState(props.modalData.commissionPercentage);
  const onSubmit = (val) => {
    if (parseFloat(val.commissionPercentage) <= 1) {
      setIsSubmit(false);
      const data = {
        commissionPercentage: parseFloat(val.commissionPercentage),
        password: val.password,
        userId: props.modalData.id,
      };

      if (
        parseFloat(data.commissionPercentage) !==
        props.modalData.commissionPercentage
      ) {
        dispatch(
          updateCommissionPercentage({
            data,
            callback: (resData) => {
              
              if (resData?.meta?.code === 200) {
                setIsSubmit(true);
                if (props?.inactive) {
                  props.fetchInactiveLayers();
                } else {
                  props.fetchDefaultLayers();
                }
              }
            },
          })
        );
      } else {
        notifyWarning("can't update with same value as before...");
        setIsSubmit(false);
      }
    } else {
      notifyWarning(`Commission Percentage cannot be greater than 1.`);
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
            <span>{props.title}</span>{" "}
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
            <div className="position-relative">
              <Controller
                name="commissionPercentage"
                control={control}
                rules={{
                  required: "This field is required",
                  min: { value: 0, message: "Value must be at least 0" },
                  max: { value: 1, message: "Value must not exceed 1" },
                }}
                render={({ field }) => (
                  <input
                    placeholder="Enter Commission Percentage"
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    className="w-full h-50 text-dark form-control bg-transparent focus:bg-[white] border border-gray-700 p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    value={field.value}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      if (rawValue === "") {
                        setValue("");
                        field.onChange("");
                        return;
                      }
                      const numericValue = parseFloat(rawValue);
                      if (numericValue >= 0 && numericValue <= 1) {
                        setValue(numericValue);
                        field.onChange(numericValue);
                      }
                      setIsSubmit(false)
                    }}
                    aria-label="Commission Percentage"
                    aria-describedby="basic-addon2"
                  />
                )}
              />
            </div>
            <span className="text-danger">
              {errors.commissionPercentage && t("FIELD_REQUIRED")}
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
                {errors.commissionPercentage && t("FIELD_REQUIRED")}
              </span>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CommissionPercentageModal;
