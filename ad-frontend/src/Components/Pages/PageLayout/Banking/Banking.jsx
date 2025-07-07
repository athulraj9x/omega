import { Fragment, useEffect, useState } from "react";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Badges, Breadcrumbs, Btn } from "../../../../AbstractElements";
import { useTranslation } from "react-i18next";
// import { Col, Container, Row } from "reactstrap";
import WidgetsWrapper from "../Dashboard/WidgetsWraper";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Tooltip,
} from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  Actions,
  PAGINATION,
  layerRoles,
  NoDataFound,
} from "../../../../Constant";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import Select from "react-select";
import {
  getBankingData,
  getLayers,
  getUserExposure,
  addPermission,
} from "../../../../redux/action";

import CreditReference from "../users/CreditReference";
import DepositModal from "../modal/DepositModal";
import ShareModal from "../modal/ShareModal";
import ResetPasswordModal from "../modal/ResetPasswordModal";
import PermissionModal from "../modal/PermissionModal";
import SettlementAmountModal from "../modal/SettlementAmountModal";
import SettlementHistoryModal from "../modal/SettlementHistoryModal";

import Loader from "../../../../Layout/Loader";

// import RecentOrders from "./RecentOrders";
// import GreetingCard from "./GreetingCard";
const Banking = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const history = useNavigate();
  const location = useLocation();
  const { userId, role } = useParams();
  const layerData = useSelector((state) => state.Layers.layersData);

  const bankingData = useSelector(
    (state) => state?.GetBankingData?.bankingData?.data
  );
  const loading = useSelector((state) => state?.GetBankingData?.loading);

  useEffect(() => {
    dispatch(getBankingData());
  }, [dispatch]);

  const [depositModal, setdepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage); // Current selected row count
  const [totalPages, setTotalPages] = useState(0);

  const [sharesModal, setSharesModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [action, setAction] = useState(0);
  const [password, setPassword] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userExposure, setUserExposure] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [actions, setActions] = useState(Actions);
  const [settlementAmountModal, setsettlementAmountModal] = useState(false);
  const [settlementHistoryModal, setsettlementHistoryModal] = useState(false);

  const { control } = useForm();
  //Getting user datas
  useEffect(() => {
    dispatch(
      getLayers({
        userId,
        role,
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          setTotalDataCount(data?.meta?.count);
        },
      })
    );
  }, [currentPage, rowCount, userId]);

  useEffect(() => {
    const totalPages = Math.ceil(totalDataCount / rowCount);
    setTotalPages(totalPages);
  }, [rowCount, totalDataCount]);

  useEffect(() => {
    dispatch(
      getUserExposure({
        callback: (data) => {
          setUserExposure(data);
        },
      })
    );
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeposit = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId, type: "deposit" });
    setdepositModal(true);
  };
  const handleWidrawal = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId, type: "withdrawl" });
    setWithdrawalModal(true);
  };
  const handleShares = (sportShares, casinoShares) => {
    setModaldata({ sportShares, casinoShares });

    setSharesModal(true);
  };
  const handleResetPassword = (username, userId) => {
    setModaldata({ username: username, userId: userId });
    setResetPasswordModal(true);
  };
  const handlePermission = () => {
    setModaldata();
    setPermissionModal(true);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;

    if (value !== "") {
      setPassword(value);
    }
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedIds.includes(id);
    let updatedSelectedIds = [];

    if (isSelected) {
      updatedSelectedIds = selectedIds.filter(
        (selectedId) => selectedId !== id
      );
    } else {
      updatedSelectedIds = [...selectedIds, id];
    }

    setSelectedIds(updatedSelectedIds);
    setSelectAll(updatedSelectedIds.length === layerData?.data.length);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = layerData?.data.map((item) => item._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  const handleAllowAndBlock = (type) => {
    const data = {
      ids: selectedIds,
      password: password,
      [action]: type,
    };
    if (data) {
      dispatch(addPermission({ data }));
    } else {
      alert(NoDataFound);
    }
  };

  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleTooltip = (id) => {
    setActiveTooltip(id === activeTooltip ? null : id);
  };

  const handleSettlementAmountModal = (
    balance,
    mobile,
    userId,
    username,
    settlement
  ) => {
    setModaldata({ balance, mobile, userId, username, settlement });
    setsettlementAmountModal(true);
  };
  const handleSettlementHistoryModal = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId });
    setsettlementHistoryModal(true);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("BANKING")}
        title={title?.title}
        parent={title?.parent}
      />
      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Card>
          <CardHeader className="py-3">
            <Row className="g-2 align-items-center">
              <Col className=" col-12 col-md-3">
                <Controller
                  name="action"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={actions}
                      className="mySelect"
                      value={selectedAction}
                      placeholder={`${t("SELECT_DOT")}`}
                      onChange={(option) => {
                        setSelectedAction(option);
                        field.onChange(option?.value);
                      }}
                    />
                  )}
                />
              </Col>
              <Col className=" col-12 col-md-3">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      id="passwordInput"
                      type=" Password "
                      placeholder={`${t("ENTER_PASSWORD")}`}
                      onChange={(e) => handlePasswordChange(e)}
                    />
                  )}
                />
              </Col>

              <Col>
                <Button
                  className="allow_button justify-content-center m-1"
                  onClick={() =>
                    handleAllowAndBlock(action === "status" ? "1" : "true")
                  }
                  color=""
                >
                  {t("ALLOW")}
                </Button>

                <Button
                  className="block_button justify-content-center"
                  onClick={() =>
                    handleAllowAndBlock(action === "status" ? "0" : "false")
                  }
                  color=""
                >
                  {t("BLOCK")}
                </Button>
              </Col>
              <Col>
                <Link
                  to={"/users/add-user"}
                  className="d-flex justify-content-end"
                >
                  <Button color="success">{t("ADD_USER")}</Button>
                </Link>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="p-0">
            <Table responsive className="table table-bordered table-hover">
              <thead className="table-light">
                <tr className="text-left">
                  <th>
                    <input
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      className="align-center"
                      type="checkbox"
                    />
                  </th>
                  <th>{t("NAME")}</th>
                  <th>{t("USER_NAME")}</th>
                  <th>{t("CREDIT_REFERENCE")}</th>
                  <th>{t("EMAIL")}</th>
                  <th>{t("BALANCE")}</th>
                  <th className="text-center">{t("CREDIT")}</th>
                  <th>{t("P/L")}</th>
                  <th>{t("EXPOSURE")}</th>
                  <th>{t("SETTLEMENT")}</th>
                  <th>{t("PASSWORD")}</th>
                  <th className="text-center">{t("ACTIONS")}</th>
                </tr>
              </thead>
              <tbody>
                {bankingData?.map((data, index) => {
                  const exp = userExposure?.find(
                    (exp) => exp.username === data?.username
                  );
                  return (
                    <tr className="text-left align-middle py-2" key={index}>
                      <td className="align-middle py-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(data._id)}
                          onChange={() => handleCheckboxChange(data._id)}
                        />
                      </td>
                      <td className=" py-2">
                        <div className="name align-middle d-flex">
                          <span>
                            <Badges
                              attrBadge={{
                                color: `${data.role === layerRoles?.USER
                                    ? "success"
                                    : "info"
                                  }`,
                              }}
                            >
                              {` ${data.role === layerRoles?.USER
                                  ? "U"
                                  : data.role === layerRoles?.AGENT
                                    ? "AG"
                                    : data.role === layerRoles?.MASTER
                                      ? "MS"
                                      : data.role === layerRoles?.SUPER_MASTER
                                        ? "SM"
                                        : data.role === layerRoles?.ADMIN
                                          ? "AD"
                                          : "SA"
                                }`}
                            </Badges>
                          </span>

                          {data.role === layerRoles?.USER ? (
                            <span className="ms-2 text-nowrap">
                              {data?.name}
                            </span>
                          ) : (
                            <Link
                              className="ms-2 text-nowrap text-dark"
                              to={`/users/${data?._id}/${data?.role}`}
                            >
                              {data?.name}
                            </Link>
                          )}
                        </div>
                      </td>
                      <td className="align-middle py-2">{data?.username}</td>
                      <td className="align-middle py-2 w-100">
                        <CreditReference
                          defaultValue={data?.creditReference}
                          userId={data?._id}
                        />
                      </td>

                      <td className="align-middle py-2">{data?.email}</td>
                      <td className="align-middle py-2">{data?.balance}</td>
                      {/* <td className="align-middle py-1">{data?.credit}</td> */}

                      <td className="py-2  ">
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            onClick={() =>
                              handleDeposit(
                                data?.balance,
                                data?.mobileNo,
                                data?._id
                              )
                            }
                            className="px-2 py-1"
                            color="success"
                          >
                            D
                          </Button>

                          <Button
                            onClick={() =>
                              handleWidrawal(
                                data?.balance,
                                data?.mobileNo,
                                data?._id
                              )
                            }
                            className="px-2 py-1"
                            color="primary"
                          >
                            W
                          </Button>
                        </div>
                      </td>
                      <td> {data?.balance - data?.creditReference}</td>
                      <td> {exp?.exposure ? exp?.exposure : 0} </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <button
                            className="settlement-btn btn  px-3 py-2 border border-success bg-light h-25 w-100 "
                            onClick={() =>
                              handleSettlementAmountModal(
                                data?.balance,
                                data?.mobileNo,
                                data?._id,
                                data?.username,
                                data?.balance - data?.creditReference
                              )
                            }
                          >
                            {data?.balance - data?.creditReference}
                          </button>
                          <button
                            className="settlement-history-btn btn px-3 py-2 border border-success bg-light h-25"
                            onClick={() =>
                              handleSettlementHistoryModal(
                                data?.balance,
                                data?.mobileNo,
                                data?._id
                              )
                            }
                          >
                            H
                          </button>
                        </div>
                      </td>
                      <td className="align-middle py-1">
                        <div className="d-flex justify-content-center">
                          <Btn
                            attrBtn={{
                              color: "",
                              className: "transparent-button",
                              id: `TooltipExample-${data._id}`,
                            }}
                            onMouseEnter={() => toggleTooltip(data._id)}
                            onMouseLeave={() => toggleTooltip(data._id)}
                          >
                            ****
                          </Btn>
                          <Tooltip
                            placement="top"
                            isOpen={activeTooltip === data._id}
                            target={`TooltipExample-${data._id}`}
                            toggle={() => toggleTooltip(data._id)}
                          >
                            {data?.passwordText ? data?.passwordText : "****"}
                          </Tooltip>
                        </div>
                      </td>

                      <td className="py-2 ">
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            onClick={() =>
                              handleShares(
                                data?.sportShares,
                                data?.casinoShares
                              )
                            }
                            className="px-2 py-1 h-25"
                            color="success"
                          >
                            S
                          </Button>
                          <Button
                            className="px-2 py-1 h-25"
                            color="success"
                            onClick={() => {
                              history(`/reports/${data?.mobileNo}`, {
                                state: { id: data?._id, role: data?.role },
                              });
                            }}
                          >
                            R
                          </Button>

                          <Button
                            onClick={() =>
                              handleResetPassword(data?.username, data?._id)
                            }
                            className="px-2 py-1 d-flex"
                            color="success"
                          >
                            <span>R</span> <span>-</span>
                            <span>P</span>
                          </Button>
                          <Button
                            onClick={() => handlePermission()}
                            className="px-2 py-1 h-25"
                            color="success"
                          >
                            P
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* </CardBody> */}
            </Table>
            {loading === false &&
              (bankingData?.length === 0 ||
                bankingData?.length === undefined) && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
          </CardBody>
          <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow rowCount={rowCount} setRowCount={setRowCount} setCurrPage={setCurrentPage} />
              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </CardFooter>
        </Card>
      </Container>
      {depositModal && (
        <DepositModal
          isOpen={depositModal}
          title={"DEPOSIT OF"}
          toggler={setdepositModal}
          modalData={modalData}
          deposit={true}
          size="md"
        />
      )}
      {withdrawalModal && (
        <DepositModal
          isOpen={withdrawalModal}
          title={"WITHDRAWAL OF"}
          toggler={setWithdrawalModal}
          modalData={modalData}
          deposit={false}
          size="md"
        />
      )}
      {sharesModal && (
        <ShareModal
          isOpen={sharesModal}
          title={"Shares "}
          toggler={setSharesModal}
          modalData={modalData}
          size="md"
        />
      )}
      {resetPasswordModal && (
        <ResetPasswordModal
          isOpen={resetPasswordModal}
          title={"CHANGE PASSWORD OF "}
          toggler={setResetPasswordModal}
          modalData={modalData}
          size="md"
          fieldTitle={"New Password"}
        />
      )}
      {permissionModal && (
        <PermissionModal
          isOpen={permissionModal}
          title={"Permissions OF "}
          toggler={setPermissionModal}
          modalData={modalData}
          size="md"
        />
      )}
      {settlementAmountModal && (
        <SettlementAmountModal
          isOpen={settlementAmountModal}
          title={"Permissions OF "}
          toggler={setsettlementAmountModal}
          modalData={modalData}
          size="md"
        />
      )}
      {settlementHistoryModal && (
        <SettlementHistoryModal
          isOpen={settlementHistoryModal}
          title={"Permissions OF "}
          toggler={setsettlementHistoryModal}
          modalData={modalData}
          size="md"
        />
      )}
    </Fragment>
  );
};

export default Banking;
