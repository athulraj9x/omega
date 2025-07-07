import React, { useEffect, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { addWithdrawal, postDeposit } from "../../../../redux/action";
import { notifyWarning } from "../../../../utils/helper";

const ChangePasswordModal = (props) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.Login.userData);
  const [chipValue, setChipValue] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [defaultValue, setDefaultValue] = useState({
    adminBalance: 0,
    userBalance: 0,
  });

  useEffect(() => {
    setDefaultValue({
      userBalance: props.modalData.balance,
      adminBalance: adminData.balance,
    });
  }, [adminData, props]);

  const onSubmit = (data) => {
    const datas = {
      toId: props.modalData.userId,
      description: data?.remark,
      amount: parseInt(data?.chipValue),
      transaction_type: props.modalData.type,
      password: data?.password,
    };

    if (props.modalData.type === "deposit") {
      if (parseInt(chipValue) > adminData?.balance) {
        notifyWarning("chip value greater is more than balance", {position: toast.POSITION.BOTTOM_CENTER});
      } else {
        setEnabled(false);
        dispatch(
          postDeposit({
            datas,
            callback: (data) => {
              props.toggler(false);
              setEnabled(true);
            },
          })
        );
      }
    } else {
      if (parseInt(chipValue > props?.modalData?.balance)) {
        notifyWarning("chip value greater is more than balance");
      } else {
        setEnabled(false);
        dispatch(
          addWithdrawal({
            datas,
            callback: (data) => {
              props.toggler(false);
            },
          })
        );
      }
    }
  };

  const handleBalances = (e) => {
    const { value } = e.target;

    if (value !== "") {
      setChipValue(value);
      if (props.deposit) {
        setDefaultValue((prev) => {
          const updatedUserBalance = props.modalData.balance + parseInt(value);
          const updatedAdminBalance = adminData.balance - parseInt(value);

          if (adminData.balance < parseInt(value)) {
            return prev; // Return the previous state without any updates
          }

          return {
            userBalance: updatedUserBalance,
            adminBalance: updatedAdminBalance,
          };
        });
      } else {
        setDefaultValue((prev) => {
          const updatedUserBalance = props.modalData.balance - parseInt(value);
          const updatedAdminBalance = adminData.balance + parseInt(value);

          if (props.modalData.balance < parseInt(value)) {
            return prev; // Return the previous state without any updates
          }

          return {
            userBalance: updatedUserBalance,
            adminBalance: updatedAdminBalance,
          };
        });
      }
    } else {
      setDefaultValue({
        userBalance: props.modalData.balance,
        adminBalance: adminData.balance,
      });
    }
  };

  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header
        closeButton
        className="px-1 bg-light text-black' color='light dark"
      >
        <Modal.Title className="fs-6 text-dark">
          {props.title + " " + props.modalData.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalbody" style={{ padding: '0px' }}>
        <Form id="modalDW" onSubmit={handleSubmit(onSubmit)}>
          <Table responsive className="table table-bordered p-0  ">
            <tbody className="text-black bg-white">
              <tr>
                <td>
                  <Col>{t("CHIP_VALUE")}</Col>
                </td>
                <td>
                  <Col>
                    <div className="input-group">
                      <Controller
                        name="chipValue"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            className="w-full text-black form-control bg-transparent focus:bg-[white]  border border-gray-700  p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                            placeholder={t("ENTER_CHIPS")}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBalances(e);
                            }}
                          />
                        )}
                      />
                      <span className="input-group-text" id="basic-addon2">
                        PTS
                      </span>
                    </div>
                    <span className="text-danger">
                      {errors.chipValue && t("FIELD_REQUIRED")}
                    </span>
                  </Col>
                </td>
              </tr>
              <tr>
                <td>
                  <Col>{t("DIRECTOR")}</Col>
                </td>
                <td className="">
                  <Col>
                    {" "}
                    <span>
                      {defaultValue.adminBalance?.toLocaleString("en-us")}
                    </span>
                  </Col>
                </td>
              </tr>

              <tr>
                <td>
                  <Col>{props?.modalData?.name}</Col>
                </td>
                <td>
                  <Col>
                    {" "}
                    <span>
                      {defaultValue.userBalance?.toLocaleString("en-us")}
                    </span>
                  </Col>
                </td>
              </tr>

              <tr>
                <td>
                  <Col>{t("REMARK")}</Col>
                </td>
                <td>
                  <Col>
                    <Controller
                      name="remark"
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full bg-transparent focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none text-dark"
                          placeholder={t("REMARK")}
                          onChange={(e) => field.onChange(e.target.value)}
                          required
                        />
                      )}
                    />
                  </Col>
                  <span className="text-danger">
                    {errors.remark && t("FIELD_REQUIRED")}
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </Modal.Body>
      <Modal.Footer className="deposit-footer">
        <Row>
          <Col className="d-flex gap-2">
            <Controller
              name="password"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  className="bg-transparent form-control focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                  type="password"
                  placeholder={t("PASSWORD")}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />

            <button
              type="submit"
              form="modalDW"
              className="deposit-button text-white btn btn-success px-3 rounded-2"
              disabled={chipValue > props.modalData.userBalance || !enabled}
            >
              {t("SUBMIT")}
            </button>
          </Col>
          <span className="text-danger">
            {errors.password && t("FIELD_REQUIRED")}
          </span>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
