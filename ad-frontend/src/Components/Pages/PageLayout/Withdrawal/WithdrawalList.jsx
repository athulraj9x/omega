import React, { Fragment, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import WithdrawlModal from "../modal/WithdrawalModal";
import { getWithdrawal } from "../../../../redux/action";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import { transactionStatus } from "../../../../redux/action/transaction/transactionStatusAction";
import { convertINRToCurrency, notifyWarning } from "../../../../utils/helper";
import "./style.css";
import Loader from "../../../../Layout/Loader";
import { socket } from "../../../../context/socketContext";
import { useNavigate } from "react-router";

const WithdrawlList = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const whiteLabelType = useSelector(
    (state) =>
      state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType
  );
  const adminData = useSelector((state) => state.Login.userData);
  const [paymentModal, setPaymentModal] = useState(false);
  const [withdrawlList, setWithdrawlList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const filterRef = useRef(filter);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [checkedIds, setCheckedIds] = useState({});
  const [error, setError] = useState(false);
  const [newWithdrawal, setNewWithdrawal] = useState(null);
  const [loading, setloading] = useState(false);
  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowCount, setRowCount] = useState(50);

  useEffect(() => {
      if (!whiteLabelType && whiteLabelType !== "B2C") {
        navigate("/dashboard"); // Redirect to a "Not Authorized" page or any other route
      }
    }, [whiteLabelType, navigate]);

  const toggleModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalOpen(!modalOpen);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const remarkValue = (data) => {
    setModal(!modal);
    if (data?.length > 0) {
      setRemark(data);
    }
  };
  //changing ref whenever the filter is changing 
  useEffect(() => {
    filterRef.current = filter;
  }, [filter])

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
        transaction: "withdrawl",
        status: "accepted",
        id: datas,
        whiteLabelType: whiteLabelType? whiteLabelType: "NONE"
      }
      dispatch(
        transactionStatus({
          data: payload,
          callback: (data) => {
            fetchWithdrawalList();
          },
        })
      );
    } else {
      notifyWarning("Verify Transaction and checkIt", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  const handleReject = (datas) => {
    if (checkedIds[datas]) {
      let payload = {
        transaction: "withdrawl",
        status: "rejected",
        id: datas,
        whiteLabelType: whiteLabelType? whiteLabelType: "NONE"
      }
      dispatch(
        transactionStatus({
          data: payload,
          callback: () => {
            fetchWithdrawalList();
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
    fetchWithdrawalList();
    setloading(false);
  }, [filter, currentPage, rowCount, dispatch]);

  const fetchWithdrawalList = () => {
    dispatch(
      getWithdrawal({
        data: filter,
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          // console.log({data})
          const filteredData = data?.data?.filter(element => 
            !(element?.withdrawalMethod === "crypto" && element?.status === "pending")
          );
          setWithdrawlList(filteredData);
            setTotalPages(data.totalPages);
        },
      })
    );
  }
  useEffect(()=>{
    let timeoutId = null;
    const HandleNewWithdrawal=(data)=>{
    if (filterRef.current === "pending") {
        setNewWithdrawal(data._id)
        // playNotificationSound("withdraw");
      timeoutId = setTimeout(() => {
        setNewWithdrawal(null);
      }, 1000);
      fetchWithdrawalList()
    }
  }

    socket.on("WithdrawRequestRaised", HandleNewWithdrawal)
    return ()=>{
      socket.off("WithdrawRequestRaised",HandleNewWithdrawal );
      clearTimeout(timeoutId)
    }
  }, [socket]);

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("WITHDRAWAL LIST")}
        title={title?.title}
        parent={title?.parent}
      />
      <div style={{ width: "200px" }} className="m-1 py-2">
        <select className="form-select border-dark" defaultValue={"pending"} onChange={handleFilter}>
          {/* <option value="all">All</option> */}
          <option  value="pending">Pending</option>
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
            {withdrawlList && withdrawlList?.length > 0 ? (
              <Card>
                <CardBody className="p-0">
                  <div className="overflow-auto " style={{ height: '70vh' }}>
                    <table className="table table-bordered table-hover ">
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
                          <th className="text-nowrap ">{t("WITHDRAW DATE")}</th>
                          <th className="text-nowrap">{t("BANK NAME")}</th>
                          <th className="text-nowrap">{t("ACCOUNT NUMBER")}</th>
                          <th className="text-nowrap">{t("IFSC CODE")}</th>
                          <th className="text-nowrap">{t("VERIFY")}</th>
                          <th className="text-nowrap text-center">
                            {"ACTION"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                      {/* </CardBody> */}
                      {withdrawlList?.map((bank_details, index) => {
                          const isCryptoTransaction = bank_details?.withdrawalMethod === "crypto"
                       return (
                          <tr
                            className={`text-left align-middle py-2 ${
                              bank_details._id === newWithdrawal
                                ? "table-success"
                                : "table-danger"
                            }`}
                            key={index}
                          >
                            <td className="">{bank_details?.amount}</td>
                            <td className="">
                              {bank_details?.userId?.username}
                              <span className="text-primary">
                                ({bank_details?.directParent?.username})
                              </span>
                            </td>
                            <td className="" style={{ textTransform: 'capitalize' }}>
                              {bank_details?.status}
                            </td>
                            <td className="">
                              {bank_details?.withdrawalDate
                                ? new Date(
                                )?.toLocaleDateString()
                                : "Invalid Date"}
                              <br />
                              {/* <span className="py-2"> */}
                              {bank_details?.withdrawalDate
                                ? new Date(
                                  bank_details?.withdrawalDate
                                )?.toLocaleTimeString()
                                : "Invalid Time"}
                              {/* </span> */}
                            </td>

                            <td className=" align-items-center">
                              {bank_details?.bankId?.bankName}
                            </td>

                            {isCryptoTransaction ? (
                            <td className=" align-items-center">
                              {bank_details?.bankId?.walletAddress}
                            </td>
                            ):
                            <td className=" align-items-center">
                              {bank_details?.bankId?.accountNumber || bank_details?.bankId?.walletAddress}
                            </td>
                            }
                            {isCryptoTransaction ? (
                            <td className=" align-items-center">
                             Not Required
                            </td>
                            ):
                            <td className=" align-items-center">
                              {bank_details?.bankId?.ifscCode || "Not Required"}
                            </td>
                      }
                            {bank_details.status === "pending" ? (
                              <td className=" align-items-center ">
                              <td className=" align-items-center d-flex justify-content-center">
                                <div className="checkbox-wrapper mt-3">
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
                                    className="terms-label"
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
                                          }`}
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
                              </td>
                            ) : (
                              <td className=" align-items-center">
                                <p className="text-success">{isCryptoTransaction? "Crypto Auto Verified":"Verified"}</p>
                              </td>
                            )}
                            {bank_details.status == "pending" ? (
                              <td className=" p-4 text-center">
                                <button
                                  className="transaction-button-accepted me-4 "
                                  onClick={() =>
                                    handleAccept(bank_details._id)
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="transaction-button-rejected"
                                  onClick={() =>
                                    handleReject(bank_details._id)
                                  }
                                >
                                  Reject
                                </button>
                              </td>
                            ) : (
                              <td className="p-2 text-center">
                                <div className="buttons">
                                  <p style={{ textTransform: "capitalize" }}>
                                    {" "}
                                    {bank_details.status}
                                  </p>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                    </table>
                  </div>
                  {<div
                    className={`pagination-bdy mt-2 ${
                      paginationDisabled ? "pe-none opacity-50" : ""
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
                <h1 className="text-secondary">No Withdrawal List for now...</h1>
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
    </Fragment>
  );
};

export default WithdrawlList;
