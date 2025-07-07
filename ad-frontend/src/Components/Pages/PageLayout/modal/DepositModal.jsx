import React, { useEffect, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import {
  addWithdrawal,
  postDeposit,
  authDetail,
} from "../../../../redux/action";
import {
  convertINRToCurrency,
  convertToINR,
  notifyWarning,
} from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import { CurrencyConversionRoles } from "../../../../Constant";

const DepositModal = (props) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.Login.userData);
  const authDetails = useSelector(
    (state) => state.GetAuthDetail.authDetailData
  );

  const [chipValue, setChipValue] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [defaultValue, setDefaultValue] = useState({
    adminBalance: 0,
    userBalance: 0,
  });
  const [convertedUserBalance, setConvertedUserBalance] = useState();
  const [convertedAdminBalance, setConvertedAdminBalance] = useState();

  //Converting all default values based on currency
  useEffect(() => {
    let userBalance;
    let adminBalance;

    if (props.currency && adminData.role < CurrencyConversionRoles) {
      const exposure = props?.modalData?.exposure
        ? props?.modalData?.exposure
        : 0;
      userBalance = convertINRToCurrency(
        props?.modalData?.balance + exposure,
        parseFloat(props?.modalData?.currencyToChange),
        true // pass if want response in number
      );

      adminBalance = convertINRToCurrency(
        authDetails?.balance,
        parseFloat(props?.modalData?.currencyValue),
        true // pass if want response in number
      );
    } else {
      const amount = props?.modalData?.exposure
        ? props?.modalData?.exposure
        : 0;
      // if( adminData.role <CurrencyConversionRoles){
      //   userBalance = convertINRToCurrency(
      //     props?.modalData?.balance + amount,
      //     parseFloat(props?.modalData?.currencyValue),
      //     true
      //   );
      // }else{
      //   userBalance = props?.modalData?.balance + amount;
      //   adminBalance = authDetails?.balance;
      // }
      userBalance =
        adminData.role < CurrencyConversionRoles
          ? convertINRToCurrency(
              props?.modalData?.balance + amount,
              parseFloat(props?.modalData?.currencyToChange),
              true // pass if want response in number
            )
          : props?.modalData?.balance + amount;
      // userBalance = props?.modalData?.balance + amount;
      adminBalance = authDetails?.balance;
    }

    setConvertedUserBalance(userBalance);
    setConvertedAdminBalance(adminBalance);
  }, [adminData, props, authDetails?.balance]);

  //Setting Default values after conversion

  useEffect(() => {
    setDefaultValue({
      userBalance: convertedUserBalance,
      adminBalance: convertedAdminBalance,
    });

    dispatch(
      authDetail({
        username: adminData?.username,
      })
    );
  }, [convertedAdminBalance, convertedUserBalance]);

  const onSubmit = async (data) => {
    let convertedAmount;
    if (props.currency && adminData?.role < CurrencyConversionRoles) {
      convertedAmount = convertToINR(
        parseFloat(data?.chipValue),
        parseFloat(props?.currency?.value?.value)
      );
    } else {
      convertedAmount = data?.chipValue;
    }

    const datas = {
      toId: props.modalData.userId,
      description: data?.remark,
      amount: parseFloat(convertedAmount),
      transaction_type: props.modalData.type,
      password: data?.password,
      whiteLabelType: props?.whiteLabelType,
    };

    if (parseInt(data?.chipValue) > 0) {
      if (props.modalData.type === "deposit") {
        if (parseInt(chipValue) > convertedAdminBalance) {
          notifyWarning("chip value  is more than balance", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          setIsSubmit(true);

          dispatch(
            postDeposit({
              datas,
              callback: (data) => {
                if (data?.meta?.code === 200) {
                  props.fetchDefaultLayers();
                  if (adminData?.role < 1.9) {
                    props?.setNewBalance(
                      Number(
                        convertToINR(
                          parseFloat(data?.data?.balance),
                          parseFloat(props?.modalData?.currencyToChange)
                        )
                      )
                    );
                  } else {
                    props?.setNewBalance(data?.data?.balance);
                  }
                  props.toggler(false);
                  const socketData = {
                    id: props?.modalData?.userId,
                    balance: data?.data?.balance,
                  };
                  socket.emit("balance", socketData);
                } else {
                  setIsSubmit(false);
                }
              },
            })
          );
        }
      } else {
        // return;
        if (parseInt(chipValue) > parseInt(convertedUserBalance)) {
          notifyWarning("chip value  is more than balance");
        } else {
          setIsSubmit(true);
          dispatch(
            addWithdrawal({
              datas,
              callback: (data) => {
                if (data?.meta?.code === 200) {
                  props.fetchDefaultLayers();
                  if (adminData?.role < 1.9) {
                    props?.setNewBalance(
                      Number(
                        convertToINR(
                          parseFloat(data?.data?.balance),
                          parseFloat(props?.modalData?.currencyToChange)
                        )
                      )
                    );
                  } else {
                    props?.setNewBalance(data?.data?.balance);
                  }
                  props.toggler(false);
                  const socketData = {
                    id: props?.modalData?.userId,
                    balance: data?.data?.balance,
                  };

                  socket.emit("balance", socketData);
                }
                setIsSubmit(false);
              },
            })
          );
        }
      }
    } else {
      notifyWarning("chip value must be greater than 0!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleBalances = (e) => {
    const { value } = e.target;

    if (value !== "") {
      setChipValue(value);
      if (props.deposit) {
        setDefaultValue((prev) => {
          // console.log("uuuuuuuuuu",value);
          const updatedUserBalance =
            parseInt(convertedUserBalance) + parseFloat(value);

          const updatedAdminBalance = convertedAdminBalance - parseFloat(value);

          if (convertedAdminBalance < parseFloat(value)) {
            return prev; // Return the previous state without any updates
          }
          // console.log("ddddddddddd",updatedAdminBalance);
          return {
            userBalance: updatedUserBalance,
            adminBalance: updatedAdminBalance,
          };
        });
      } else {
        setDefaultValue((prev) => {
          const updatedUserBalance = convertedUserBalance - parseFloat(value);
          const updatedAdminBalance =
            parseFloat(convertedAdminBalance) + parseFloat(value);
          if (convertedUserBalance < parseFloat(value)) {
            // console.log("hooooo",value);
            return prev; // Return the previous state without any updates
          }

          return {
            userBalance: updatedUserBalance,
            adminBalance: updatedAdminBalance,
          };
        });
        const exposure = props?.modalData?.exposure
          ? props?.modalData?.exposure
          : 0;
        let userBalance = convertINRToCurrency(
          props?.modalData?.balance + exposure,
          parseFloat(props?.modalData?.currencyToChange),
          true // pass if want response in number
        );
        if (parseInt(userBalance) < parseFloat(value)) {
          setDefaultValue((prev) => ({
            ...prev,
            userBalance: userBalance, // Replace `newValue` with the value you want to set
          }));
        }
      }
    } else {
      setDefaultValue({
        userBalance: convertedUserBalance,
        adminBalance: convertedAdminBalance,
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
      <Modal.Header closeButton className="px-1 text-dark" color="light dark">
        <Modal.Title className="fs-6 text-dark">
          <span>{props.title}</span>{" "}
          <span className="text-primary">{props.modalData.name}</span>
          {props.currency && (
            <div>
              <p className="m-0 text-secondary">
                {` *Every values will be in `}
                <span className="text-primary">{props?.currency?.label}</span>
              </p>
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Form id="transactionModal" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="modalbody" style={{ padding: "0px" }}>
          <Table responsive className="table table-bordered p-0  ">
            <tbody className="text-dark">
              <tr>
                <td className="align-middle">
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
                            style={{
                              "-moz-appearance": "textfield", // Firefox
                            }}
                            className="w-full text-black form-control bg-transparent focus:bg-[white] border border-gray-700 p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-none"
                            placeholder={t("ENTER_CHIPS")}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                              if (
                                props.deposit &&
                                e.target.value <= authDetails.balance
                              ) {
                                field.onChange(e.target.value);
                              } else if (
                                parseInt(e.target.value) <=
                                  parseInt(
                                    convertINRToCurrency(
                                      props?.modalData?.balance,
                                      parseFloat(
                                        props?.modalData?.currencyToChange
                                      ),
                                      true // pass if want response in number
                                    )
                                  ) &&
                                adminData?.role < CurrencyConversionRoles
                              ) {
                                field.onChange(e.target.value);
                              } else if (
                                parseInt(e.target.value) <=
                                  props?.modalData?.balance &&
                                adminData?.role > CurrencyConversionRoles
                              ) {
                                field.onChange(e.target.value);
                              } else {
                                field.onChange("");
                              }
                              handleBalances(e);
                            }}
                            onKeyDown={(e) => {
                              if (
                                !/[0-9]/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete"
                              ) {
                                e.preventDefault();
                              }
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
                  <Col>{adminData?.username}</Col>
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
                <td className="align-middle">
                  <Col>{t("REMARK")}</Col>
                </td>
                <td>
                  <Col>
                    <Controller
                      name="remark"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full bg-transparent focus:bg-[white] border border-gray-700 rounded p-2 px-3 my-6 focus:ring-1 focus:ring-sky-500 focus:outline-none text-dark"
                          placeholder={t("REMARK")}
                          onChange={(e) => field.onChange(e.target.value)}
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
                form="transactionModal"
                className="deposit-button text-white btn btn-success px-3 rounded-2"
                disabled={isSubmit}
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
  );
};

export default DepositModal;
