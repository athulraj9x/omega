import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Col, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import { settlement } from "../../../../redux/action";
import validateSettlement from "../../../../validations/settlement";

const SettlementAmountModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = useState({
    // to_id: "",
    amount: 0,
    old_p_l: 0,
    new_p_l: 0,
    desc: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setInputValues((prev) => ({
      ...prev,
      old_p_l: props?.modalData?.settlement,
      new_p_l: props?.modalData?.settlement,
    }));
  }, []);

  const handleSettlementSubmit = () => {
    const data = {
      to_id: props?.modalData?.userId,
      p_l: parseFloat(inputValues?.amount) / parseFloat(props?.modalData?.currencyValue),
      desc: inputValues?.desc,
      password: inputValues?.password,
    };

    const { errors, isValid } = validateSettlement(data);

    if (isValid) {
      setIsSubmit(true);
      dispatch(
        settlement({
          data,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              props.toggler(false);
              props.fetchDefaultLayers();
            }
            setIsSubmit(false);
          },
        })
      );
    } else {
      setError(errors);
    }
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    // setInputValues((prev) => ({ ...prev, [name]: value }));
    if (name === "amount") {
      setInputValues((prevState) => ({
        ...prevState,
        amount: value,
        desc: inputValues?.desc,
        password: inputValues?.password,
        new_p_l: inputValues?.old_p_l -  parseFloat(value / parseFloat(props?.modalData?.currencyValue)),
      }));
    }
    if (name === "desc") {
      setInputValues((prevState) => ({
        ...prevState,
        desc: value,
      }));
    }
    if (name === "password") {
      setInputValues((prevState) => ({
        ...prevState,
        password: value,
      }));
    }
  };

  const fillAmountWithOldPL = () => {
    setInputValues((prevState) => ({
      ...prevState,
      // amount: inputValues.old_p_l,
      amount : (inputValues?.old_p_l * props?.modalData?.currencyValue).toFixed(2),
      new_p_l: 0,
    }));
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
          <Modal.Title className="fs-6 ">
            {props.title}{" "}
            <span className="text-primary">{props?.modalData?.username}</span>
          </Modal.Title>
        </Modal.Header>
        <hr className="m-0 border border-[#a1a1a1] opacity-25" />
        <Form
          id="settlementModal"
          onSubmit={handleSubmit(handleSettlementSubmit)}
        >
          <Modal.Body className="modalbody" style={{ padding: "0px" }}>
            <div className="border">
              <table className="table table-bordered">
                <tbody className="text-dark">
                  <tr>
                    <td className="align-middle">{t("AMOUNT")}</td>
                    <td className="text-end">
                      {" "}
                      <input
                        type="number"
                        className="text-dark form-control shadow-none bg-transparent border w-100 px-3 my-6 rounded"
                        // style={{border:"1px solid #dee2e6"}}
                        onChange={(e) => {
                          handleInputChange(e);
                          setError({ amount: "" });
                        }}
                        value={
                          inputValues.old_p_l < 0
                            ? `-${Math.abs(inputValues.amount)}`
                            : inputValues.amount
                        }
                        name="amount"
                        id=""
                      />
                      <span className="text-danger m-2">
                        {error.amount && error.amount}
                      </span>
                      <div
                        onClick={fillAmountWithOldPL}
                        className="btn p-0 pt-1 text-dark text-xs "
                      >
                        Full Settlement
                      </div>
                    </td>
                  </tr>

                  <tr className="align-middle">
                    <td>{t("OLD_PL")}</td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        disabled
                        className="form-control shadow-none border w-100 px-3 my-6 disabled rounded"
                        style={{ backgroundColor: "#EEE" }}
                        value={(inputValues?.old_p_l * props?.modalData?.currencyValue).toFixed(2)}
                        name="p_l"
                        id=""
                      />
                      {/* <span className="text-danger">
                      {error.p_l && error.p_l}
                    </span> */}
                    </td>
                  </tr>

                  <tr className="align-middle">
                    <td>{t("NEW_PL")}</td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        disabled
                        className="form-control shadow-none border w-100 px-3 my-6 disabled rounded"
                        style={{ backgroundColor: "#EEE" }}
                        value={(inputValues?.new_p_l * props?.modalData?.currencyValue).toFixed(2)}
                        name="p_l"
                        id=""
                      />
                      <span className="text-danger">
                        {error.p_l && error.p_l}
                      </span>
                    </td>
                  </tr>

                  <tr className="align-middle">
                    <td>{t("DESCRIPTION")}</td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="text-dark form-control shadow-none bg-transparent border w-100 px-3 my-6 rounded"
                        placeholder={t("REMARK")}
                        onChange={(e) => handleInputChange(e)}
                        name="desc"
                        id=""
                      />
                      {/* <span className="text-danger">
                      {error.desc && error.desc}
                    </span> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-3">
            <Row className="d-flex">
              <Col className="d-flex gap-2">
                <input
                  type="password"
                  name="password"
                  placeholder={t("PASSWORD")}
                  onChange={(e) => handleInputChange(e)}
                  className="bg-transparent form-control focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                ></input>
                <span className="text-danger">
                  {error.password && error.password}
                </span>
                <button
                  disabled={isSubmit}
                  form="settlementModal"
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

export default SettlementAmountModal;
