import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { notifyWarning } from "../../../../utils/helper";
import { addGroupName, updateClientShare } from "../../../../redux/action";

const GroupNameUpdateModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      groupName: props.modalData.groupName || "",
    },
    mode: "onChange",  // Trigger validation on input change
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.modalData.groupName);

  const validateGroupName = (value) => {
    if (value === "" || value === undefined) {
      return "This field is required.";
    }
  };
  // console.log("value",value);
  const onSubmit = (val) => {
    // Your existing submit logic here...
    setIsSubmit(true);
    const data = {
      groupName: val.groupName,
      password: val.password,
      userId: props.modalData.id,
    };

    dispatch(
      addGroupName({
        data,
        callback: (resData) => {
          setIsSubmit(false);
          if (resData?.meta?.code === 200) {
            setEdit(false);
            props.fetchDefaultLayers();
          }
        },
      })
    );

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
                name="groupName"
                control={control}
                rules={{
                  validate: validateGroupName,
                  required: "This field is required.",
                }}
                render={({ field }) => (
                  <input
                    placeholder="Enter Group Name"
                    type="text"
                    className="w-full h-50 text-dark form-control bg-transparent focus:bg-[white] border border-gray-700 p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                    readOnly={!edit}
                    defaultValue={value || 0}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue(e.target.value);
                    }}
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                )}
              />

              {!edit && (
                <CiEdit
                  className="position-absolute top-50  end-0 translate-middle-y fs-5 pointer"
                  onClick={() => setEdit(true)}
                />
              )}
            </div>
            <span className="text-danger">
              {errors.groupName && errors.groupName.message}
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
                      readOnly={!edit ? true : false}
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
                  disabled={isSubmit || !edit}
                  className="deposit-button text-white btn btn-success px-3 rounded-2"
                >
                  {t("SUBMIT")}
                </button>
              </Col>
              <span className="text-danger">
                {errors.betfair && t("FIELD_REQUIRED")}
              </span>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};


export default GroupNameUpdateModal;
