import React, { Fragment, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Container, FormFeedback, Input, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import WithdrawlModal from "../modal/WithdrawalModal";
import Loader from "../../../../Layout/Loader";
import { useNavigate } from "react-router-dom";
import { cryptoPaymentManualUpdation, getDepositList } from "../../../../redux/action";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { transactionStatus } from "../../../../redux/action/transaction/transactionStatusAction";
import { notifyWarning, playNotificationSound } from "../../../../utils/helper";
import { convertINRToCurrency } from "../../../../utils/helper";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import { socket } from "../../../../context/socketContext";
import "./style.css";

const DepositList = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminData = useSelector((state) => state.Login.userData);
  const whiteLabelType = useSelector((state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType);
  const cryptoPaymentManualUpdationing = useSelector((state) => state?.CryptoManualUpdate?.loading);
  const [paymentModal, setPaymentModal] = useState(false);
  const [filter, setFilter] = useState("pending");
  const filterRef = useRef(filter);
  const [depositList, setDepositList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [checkedIds, setCheckedIds] = useState({});
  const [error, setError] = useState(false);
  const [newDeposit, setNewDeposit] = useState(null);
  const [loading, setloading] = useState(false);
  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const [rowCount, setRowCount] = useState(50);
  const toggleModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalOpen(!modalOpen);
  };

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [errors, setErrors] = useState({});

  const toggle = () => {
    setModal(!modal);
    setErrors({});
  };

  const handleUpdateClick = (transaction, index) => {
    console.log({ transaction })
    setSelectedTransaction({
      _id: transaction?._id,
      remark: "Transaction completed Manual Verified",
      transactionNumber: null
    });

    setErrors({});
    toggle();
  };

  const handleChange = (e) => {
    setSelectedTransaction({
      ...selectedTransaction,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (!selectedTransaction.status) newErrors.status = "Status is required.";
    if (!selectedTransaction.transactionNumber) newErrors.transactionNumber = "Transaction ID is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setloading(true)
    const data = {
      _id: selectedTransaction?._id,
      remark: selectedTransaction.remark,
      transactionNumber: selectedTransaction.transactionNumber,
      status: selectedTransaction.status,
    }
    dispatch(
      cryptoPaymentManualUpdation({
        data,
        callback: (data) => {
          if (data) {
            fetchDeposit();
          }
          setloading(false)
        }
      })
    )
    toggle();
  };

  useEffect(() => {
    // Redirect when whiteLabelType is defined and not B2C 
    if (!whiteLabelType && whiteLabelType !== "B2C") {
      navigate("/dashboard"); // Redirect to a "Not Authorized" page or any other route
    }
  }, [whiteLabelType, navigate]);


  useEffect(() => {
    filterRef.current = filter;
  }, [filter])

  const remarkValue = (data) => {
    setModal(!modal);
    if (data.length > 0) {
      setRemark(data);
    }
  };

  const handleVerify = (id) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setError(false);
  };

  const handleAccept = (datas) => {
    if (checkedIds[datas]) {
      let payload = {
        transaction: "deposit",
        status: "accepted",
        id: datas,
        whiteLabelType: whiteLabelType
      }
      dispatch(
        transactionStatus({
          data: payload,
          callback: () => {
            setloading(true);
            fetchDeposit();
            setloading(false)
          },
        })
      );
    } else {
      notifyWarning("Verify Transaction and check It", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  const handleReject = (datas) => {
    if (checkedIds[datas]) {
      let payload = {
        transaction: "deposit",
        status: "rejected",
        id: datas,
        whiteLabelType: whiteLabelType
      }
      dispatch(
        transactionStatus({
          data: payload,
          callback: () => {
            setloading(true);
            fetchDeposit();
            setloading(false)
          },
        })
      );
    } else {
      notifyWarning("Verify Transaction and checkIt", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const handleFilter = (e) => {

    setFilter(e.target.value);

  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setloading(true);
    fetchDeposit();
    setloading(false);
  }, [filter, currentPage, rowCount, dispatch]);

  const fetchDeposit = () => {

    dispatch(
      getDepositList({
        data: filter,
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          setTotalPages(data.data.totalPages);
          setDepositList(data?.data?.data);


        },
      })
    );
  }

  useEffect(() => {
    let timeoutId = null;
    const HandleNewDeposit = (data) => {
      if (filterRef.current === "pending") {
        // playNotificationSound("cash");
        setNewDeposit(data._id)
        timeoutId = setTimeout(() => {
          setNewDeposit(null);
        }, 1000);
        fetchDeposit()
      }
    }

    socket.on("DepositRequestRaised", HandleNewDeposit)
    return () => {
      socket.off("DepositRequestRaised", HandleNewDeposit);
      clearTimeout(timeoutId)
    }
  }, [socket]);

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("DEPOSIT LIST")}
        title={title?.title}
        parent={title?.parent}
      />
      <div style={{ width: "200px" }} className="m-1 py-2">
        <select className="form-select border-dark" defaultValue={"pending"} onChange={handleFilter}>
          {/* <option value="all">All</option> */}
          <option value="pending">
            Pending
          </option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <Container fluid={true} className="p-0">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        ) : (
          <>
            {depositList && depositList.length > 0 ? (
              <Card>
                <CardBody className="p-0">
                  <div className="overflow-auto" style={{ height: '70vh' }}>
                    <table className="table table-bordered table-hover">
                      <thead
                        className="table-light bg-light sticky-top "
                        style={{ zIndex: 1 }}
                      >
                        <tr
                          className="text-left m-0"
                          style={{ border: "none " }}
                        >
                          {/* <th className="text-nowrap ">{t("NAME")}</th> */}
                          <th className="text-nowrap ">{"AMOUNT"}</th>
                          <th className="text-nowrap ">
                            {t("USERNAME(Parent)")}
                          </th>
                          <th className="text-nowrap ">{t("STATUS")}</th>
                          <th className="text-nowrap ">{t("DEPOSIT DATE")}</th>
                          <th className="text-nowrap">
                            {t("TRANSACTION")} {t("ID")}
                          </th>
                          <th className="text-nowrap">{t("VERIFY")}</th>
                          <th className="text-nowrap">{"REMARK"}</th>
                          <th className="text-nowrap text-center">
                            {t("PAYMENT")} {t("METHOD")}
                          </th>
                          <th className="text-nowrap text-center">
                            {"ACTION"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* </CardBody> */}
                        {depositList?.map((bank_details, index) => {
                          const isCryptoTransaction = bank_details?.depositMethod === "crypto"
                          return (
                            <tr
                              className={`text-left align-middle table-primary ${bank_details._id === newDeposit ? "table-success" : "table-primary"}`}
                              key={index}
                            >
                              {/* <td className="">{bank_details?.amount}
                              </td> */}
                              <td className="">{bank_details?.amount}</td>
                              <td className="">
                                {bank_details?.userId?.username}
                                <span className="text-primary">
                                  ({bank_details?.directParent
                                    ?.username})
                                </span>
                              </td>
                              <td className="" style={{ textTransform: 'capitalize' }}>
                                {bank_details?.status}
                              </td>
                              <td className="">
                                {bank_details?.depositedDate
                                  ? new Date(
                                    bank_details?.depositedDate
                                  )?.toLocaleDateString()
                                  : "Invalid Date"}
                                <br />
                                {/* <span className="py-2"> */}
                                {bank_details?.depositedDate
                                  ? new Date(
                                    bank_details?.depositedDate
                                  )?.toLocaleTimeString()
                                  : "Invalid Time"}
                                {/* </span> */}
                              </td>

                              <td className=" align-items-center">
                                {bank_details?.transactionNumber}
                              </td>
                              {isCryptoTransaction ? (
                                <td className="align-items-center">
                                  <p className="text-success">Crypto Auto Verification</p>
                                </td>
                              ) : (
                                <>
                                  {bank_details.status === "pending" ? (
                                    <td className=" d-flex align-items-center justify-content-center">
                                      <div className="checkbox-wrapper mt-4">
                                        <input
                                          id={`terms-checkbox-${bank_details?._id}`}
                                          name="checkbox"
                                          type="checkbox"
                                          checked={!!checkedIds[bank_details._id]}
                                          onChange={() =>
                                            handleVerify(bank_details?._id)
                                          }
                                        />
                                        <label
                                          className="terms-label "
                                          htmlFor={`terms-checkbox-${bank_details?._id}`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 200 200"
                                            className="checkbox-svg"
                                          >
                                            <mask
                                              fill="white"
                                              id={`path-1-inside-${bank_details?._id}`}
                                            >
                                              <rect height="200" width="200"></rect>
                                            </mask>
                                            <rect
                                              mask={`url(#path-1-inside-${bank_details?._id})`}
                                              strokeWidth="40"
                                              className={`checkbox-box ${checkedIds[bank_details._id]
                                                ? "checked"
                                                : ""
                                                }`} // Apply checked class conditionally
                                              height="200"
                                              width="200"
                                            ></rect>
                                            <path
                                              strokeWidth="15"
                                              d="M52 111.018L76.9867 136L149 64"
                                              className="checkbox-tick"
                                            ></path>
                                          </svg>
                                        </label>
                                      </div>
                                    </td>
                                  ) : (
                                    <td className="align-items-center">
                                      <p className="text-success">Verified</p>
                                    </td>
                                  )}
                                </>
                              )}

                              <td className="">
                                <span>
                                  {bank_details?.remark?.substring(0, 10)}
                                  {bank_details?.remark?.length > 10 ? "..." : ""}
                                </span>
                                <br />
                                {bank_details?.remark?.length > 15 ? (
                                  <a
                                    className="text-primary pointer"
                                    onClick={() =>
                                      remarkValue(bank_details?.remark)
                                    }
                                  >
                                    Read More
                                  </a>
                                ) : (
                                  ""
                                )}
                              </td>

                              <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>Remark</ModalHeader>
                                <ModalBody>{remark}</ModalBody>
                                <ModalFooter>
                                  <Button color="secondary" onClick={toggle}>
                                    Cancel
                                  </Button>
                                </ModalFooter>
                              </Modal>

                              {bank_details.imageUrl ? (
                                <td
                                  className=" text-center cursor-pointer-withdrawl"
                                  onClick={() =>
                                    toggleModal(bank_details.imageUrl)
                                  }
                                >
                                  <WithdrawlModal
                                    isOpen={modalOpen}
                                    toggler={toggleModal}
                                    size="lg"
                                    imageUrl={selectedImageUrl}
                                  />
                                  <img
                                    width="60"
                                    height="60"
                                    src={bank_details.imageUrl}
                                    alt={"depositDetailImage"}
                                  />
                                </td>
                              ) : (
                                <td className=" text-center cursor-pointer-withdrawl">
                                  No image
                                </td>
                              )}
                              {(isCryptoTransaction && bank_details.status == "rejected") ? (
                                <td className=" text-center cursor-pointer-withdrawl">
                                  <button className="btn btn-light cursor-pointer" onClick={() => handleUpdateClick(bank_details, index)}>
                                    {/* {(cryptoPaymentManualUpdationing?.index === index && cryptoPaymentManualUpdation?.loading) ? "Updating" : "Update"} */}
                                    Update
                                  </button>
                                </td>
                              ) : (isCryptoTransaction && bank_details.status == "pending") ? (
                                <td className=" text-center cursor-pointer-withdrawl">
                                  <button className="btn btn-light cursor-pointer disabled">
                                    No Action
                                  </button>
                                </td>
                              ) : (
                                <>
                                  {bank_details.status == "pending" ? (
                                    <td className=" text-center">
                                      <button
                                        className="transaction-button-accepted me-4"
                                        onClick={() => handleAccept(bank_details._id)}
                                      >
                                        Accept
                                      </button>
                                      <button
                                        className="transaction-button-rejected"
                                        onClick={() => handleReject(bank_details._id)}
                                      >
                                        Reject
                                      </button>
                                      {/* </Fragment> */}
                                      {/* )} */}
                                    </td>
                                  ) : (
                                    <td className=" text-center">
                                      <div className="">
                                        <p style={{ textTransform: 'capitalize' }}>{bank_details.status}</p>
                                      </div>
                                    </td>
                                  )}


                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {<div
                    className={`pagination-bdy mt-2 ${paginationDisabled ? "pe-none opacity-50" : ""
                      }`}
                  >
                    <PaginationRow
                      rowCount={rowCount}
                      setRowCount={setRowCount}
                      setCurrPage={setCurrentPage}
                    />
                    <PaginationButtons
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                    />
                  </div>}
                </CardBody>
              </Card>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-4 mt-10">
                <h1 className="text-secondary">No Deposit List to show for now...</h1>
              </div>
            )}
          </>
        )}
      </Container>

      {paymentModal && (
        <WithdrawlModal
          isOpen={paymentModal}
          title={"Bets Of"}
          toggler={setPaymentModal}
          size="xl"
        />
      )}
      {selectedTransaction && (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Transaction Details</ModalHeader>
          <h6 className="mx-4 ">{selectedTransaction?.remark}</h6>
          <ModalBody>
            <Label>Status:</Label>
            <Input
              type="select"
              name="status"
              value={selectedTransaction?.status}
              onChange={handleChange}
              invalid={!!errors.status} // Adds red border if invalid
            >
              <option value="">Select Status</option>
              <option value="accepted">Accepted</option>
            </Input>
            {errors.status && <FormFeedback>{errors.status}</FormFeedback>}

            <Label>Remark:</Label>

            <Input
              type="text"
              name="remark"
              readOnly
              value={"Transaction completed Manual Verified"}
            />

            <Label>Transaction ID:</Label>
            <Input
              type="text"
              name="transactionNumber"
              value={selectedTransaction.transactionNumber}
              invalid={!!errors.transactionNumber}
              onChange={handleChange}
            />
            {errors.transactionNumber && <FormFeedback>{errors.transactionNumber}</FormFeedback>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </Fragment>
  );
};

export default DepositList;