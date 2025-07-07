import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, Row, Tooltip } from "reactstrap";

import { Badges, Breadcrumbs, Btn } from "../../../../AbstractElements";
import { ManagerRoles, PAGINATION, layerRoles } from "../../../../Constant";
import { Actions } from "../../../../Constant/index";
import usePageTitle from "../../../../Hooks/usePageTitle";
import "../../../../assets/scss/pages/_customCheckBox.scss";
import "../../../../assets/scss/pages/settlement/modalBtn.scss";
import { addPermission, getInactiveLayers, getWhiteLabel, getUserBetsEvent, getLayers } from "../../../../redux/action";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import DepositModal from "../modal/DepositModal";
import PermissionModal from "../modal/PermissionModal";
import ResetPasswordModal from "../modal/ResetPasswordModal";
import SettlementAmountModal from "../modal/SettlementAmountModal";
import SettlementHistoryModal from "../modal/SettlementHistoryModal";
import ShareModal from "../modal/ShareModal";
import CreditReference from "./../users/CreditReference";

import Loader from "../../../../Layout/Loader";

import { toast } from "react-toastify";
import "../../../../assets/scss/pages/resultTransaction.scss";
import BetsModal from "../modal/BetsModal";
import { finduserParent, notifyWarning } from "../../../../utils/helper";

const ListWhiteLabels = ({ inactive }) => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const history = useNavigate();
  const adminData = useSelector((state) => state.Login.userData);
  const whiteLabelType = useSelector(
    (state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType
  );
  const [depositModal, setdepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalDataCount, setTotalDataCount] = useState(1);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage); // Current selected row count
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  const [newBalance, setNewBalance] = useState(0);
  const [idToUpdate, setIdToUpdate] = useState("");
  const [sharesModal, setSharesModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [betsModal, setBetsModal] = useState(false);
  const [password, setPassword] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  // const [actions, setActions] = useState(Actions);
  const [settlementAmountModal, setsettlementAmountModal] = useState(false);
  const [settlementHistoryModal, setsettlementHistoryModal] = useState(false);
  const [layerData, setLayerData] = useState([]);
  const [layerPaths, setLayerPaths] = useState([]);
  const [copied, setCopied] = useState(false);
  const [actionToolTip, setActionToolTip] = useState({ id: "", val: "" });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [dataUpdate, setDataUpdate] = useState([]);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm();
  //Getting user datas
  useEffect(() => {
    if (!inactive) {
      fetchWhiteLabels();
    } else {
      fetchInactiveLayers();
    }
  }, [currentPage, rowCount, inactive]);

  useEffect(() => {
    updateBalance(layerData, idToUpdate, newBalance);
  }, [newBalance]);

  useEffect(() => {
    let totalPages;
    if (rowCount === PAGINATION?.perPage) {
      totalPages = Math.ceil(totalDataCount / rowCount);
    } else {
      totalPages = Math.ceil(totalDataCount / rowCount[currentPage]);
    }
    setTotalPages(totalPages);
  }, [rowCount, totalDataCount]);

  const fetchInactiveLayers = () => {
    setLayerPaths([]);
    setLoading(true);
    dispatch(
      getInactiveLayers({
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          setLayerData(data);
          setTotalDataCount(data?.meta?.count);
          setLoading(false);
        },
      })
    );
  };
  const updateBalance = (layerData, id, newBalance) => {
    setLayerData((prevLayerData) => {
      return prevLayerData.map((userGroup, index) => {
        if (index === 0) {
          return userGroup.map((user) => {
            if (user._id === id) {
              return {
                ...user,
                balance: newBalance,
              };
            }
            return user;
          });
        }
        return userGroup;
      });
    });
  };

  const fetchWhiteLabels = () => {
    setLayerPaths([]);
    setLoading(true);
    dispatch(
      getWhiteLabel({
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          setLayerData(data.data);
          setTotalDataCount(data?.meta?.count);
          setLoading(false);
        },
      })
    );
  };

  const handleLayerView = (userId, role, username) => {
    // Create a new array of layers up to the clicked index
    const newLayerPaths = layerPaths.slice(0, layerPaths?.length + 1);

    if (username) {
      // Add the new layer to the end of the array
      newLayerPaths.push({ username, role, userId });
      setLayerPaths(newLayerPaths);
    } else {
      let userIndex = newLayerPaths?.findIndex((item) => item?.userId == userId);
      let newArray = newLayerPaths?.slice(0, userIndex + 1);
      setLayerPaths(newArray);
    }

    setLoading(true);
    setDataUpdate([]);
    if (!inactive) {
      dispatch(
        getLayers({
          buildTreeFrom: userId,
          role,
          search: "",
          page: currentPage,
          perPage: rowCount,
          callback: (data) => {
            setLayerData(data?.data);
            setTotalDataCount(data?.meta?.count);
            setLoading(false);
          },
        })
      );
    } else {
      dispatch(
        getInactiveLayers({
          buildTreeFrom: userId,
          role,
          page: currentPage,
          perPage: rowCount,
          callback: (data) => {
            setLayerData(data);
            setTotalDataCount(data?.meta?.count);
            setLoading(false);
          },
        })
      );
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeposit = (balance, name, userId, exposure) => {
    setIdToUpdate(userId);
    setModaldata({ balance, name, userId, type: "deposit", exposure });
    setdepositModal(true);
  };

  const handleWidrawal = (balance, name, userId, exposure) => {
    setIdToUpdate(userId);
    setModaldata({ balance, name, userId, type: "withdrawl", exposure });
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

  const handleCheckboxChange = (id) => {
    const isSelected = selectedIds.includes(id);
    let updatedSelectedIds = [];

    if (isSelected) {
      updatedSelectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedIds = [...selectedIds, id];
    }

    setSelectedIds(updatedSelectedIds);
    setSelectAll(updatedSelectedIds?.length === layerData[0]?.length);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = layerData[0]?.map((item) => item._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  const handleAllowAndBlock = (values) => {
    if (selectedIds?.length !== 0 && password !== "") {
      let dynamicKey = selectedAction?.value === "status" ? "status" : "betAllow";
      let data = {
        ids: selectedIds,
        password: password,
        [dynamicKey]: selectedAction?.value === "status" ? (values ? "1" : "0") : values ? "true" : "false",
      };

      if (data) {
        dispatch(
          addPermission({
            data,
            callback: (data) => {
              reset();
              setSelectedIds([]);
              setPassword("");
              if (inactive) {
                fetchInactiveLayers();
              } else {
                fetchWhiteLabels();
              }
            },
          })
        );
      } else {
        notifyWarning("No datas Selected", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      if (selectedIds?.length === 0) {
        notifyWarning("Select users to perform an action", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else if (password === "") {
        notifyWarning("Please enter the password.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
    // const data = {
    //   ids: selectedIds,
    //   password: password,
    //   [action]: type,
    // };
    // if (data) {
    //   dispatch(addPermission({ data }));
    // } else {
    //   alert(NoDataFound);
    // }
  };

  const toggleTooltip = (id) => {
    setActiveTooltip(id === activeTooltip ? null : id);
  };

  const toggleActionTooltip = (val, id) => {
    const data = { id: id === actionToolTip?.id ? null : id, val };
    setActionToolTip(data);
  };

  //for Copy text to clipboard
  const handleTextCopy = (textToCopy) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => setCopied(true))
        .catch((error) => console.error("Error copying text:", error));

      setTimeout(() => setCopied(false), 1500);
    } else {
      // Handle the case when clipboard API is not available

      notifyWarning("Copy feature not available in private browsing", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handlePermission = (betAllow, status, username, userId, role, index) => {
    const prevUpdate =
      dataUpdate?.length > 0
        ? dataUpdate.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue === index ? 1 : 0);
          }, 0)
        : 0;
    if (prevUpdate % 2 === 1) betAllow = !betAllow;
    setModaldata({ betAllow, status, username, userId, role, index });
    setPermissionModal(true);
  };

  const handleShowBets = (userId, username) => {
    const data = { userId };
    dispatch(
      getUserBetsEvent({
        data,
        callback: (data) => {
          setModaldata({ bets: data, username });
          setBetsModal(true);
        },
      })
    );
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={inactive ? t("INACTIVE_USER_LIST") : t("USER_LIST")}
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
          {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
            <CardHeader className="py-3">
              <Form>
                <Row className="g-2 align-items-center">
                  <Col className=" col-12 col-md-3" style={{ zIndex: 8 }}>
                    <span className="text-danger">{errors.action && t("FIELD_REQUIRED")}</span>
                    <Controller
                      name="action"
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={Actions}
                          className="mySelect"
                          value={selectedAction}
                          placeholder={t("SELECT_DOT")}
                          onChange={(option) => {
                            setSelectedAction(option);
                            field.onChange(option?.value);
                          }}
                        />
                      )}
                    />
                    {/* <select
                  name="Select Action"
                  type=" Password "
                  onChange={(e) => handleActionChange(e)}
                  className="enter_password bg-[#22262a] w-full p-2 rounded focus:outline-none text-[#CCD1D5]"
                  placeholder="-----"
                  required
                >
                  <option selected>Select Action </option>

                  <option value={"status"}>Active </option>

                  <option value={"betAllow"}>BetAllow </option>
                </select> */}
                  </Col>
                  <Col className=" col-12 col-md-3">
                    <span className="text-danger">{errors.password && t("FIELD_REQUIRED")}</span>
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "This field is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          style={{ fontSize: "14px" }}
                          className="form-control py-2"
                          id="passwordInput"
                          type="password"
                          placeholder={t("ENTER_PASSWORD")}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      )}
                    />

                    {/* <input
                  type=" Password "
                  id="passwordInput"
                  onChange={(e) => handlePasswordChange(e)}
                  className="enter_password bg-[#22262a] w-full p-2 ms-2 rounded focus:outline-none text-[#CCD1D5]"
                  placeholder="Enter Password"
                /> */}
                  </Col>

                  <Col className="d-flex align-items-center">
                    {selectedAction?.value === "status" && inactive ? (
                      <Button
                        className={`allow_button rounded px-4 text-light justify-content-center m-1`}
                        onClick={() => handleAllowAndBlock(true)}
                        color="primary"
                      >
                        {t("ALLOW")}
                      </Button>
                    ) : selectedAction?.value === "betAllow" ? (
                      <>
                        <Button
                          className={`allow_button rounded px-4 text-light justify-content-center m-1`}
                          onClick={() => handleAllowAndBlock(true)}
                          color="primary"
                        >
                          {t("ALLOW")}
                        </Button>
                        <Button
                          className="block_button fw-normal rounded px-4 text-white justify-content-center"
                          onClick={() => handleAllowAndBlock(false)}
                          color="warning"
                        >
                          {t("BLOCK")}
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="block_button fw-normal rounded px-4 text-white justify-content-center"
                        onClick={() => handleAllowAndBlock(false)}
                        color="warning"
                      >
                        {t("BLOCK")}
                      </Button>
                    )}
                  </Col>
                  <Col>
                    <Link to={"/whitelabels/add-whitelabel"} className="d-flex align-items-center justify-content-end">
                      <Button color="success">{t("ADD_WHITELABEL")}</Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </CardHeader>
          )}

          <CardBody className="p-0">
            <Row className="bg-light p-2">
              <Col className="d-flex gap-1">
                <span
                  className="text-dark pointer path-text"
                  onClick={inactive ? fetchInactiveLayers : fetchWhiteLabels}
                >
                  {adminData?.username}
                </span>
                {layerPaths?.length !== 0 &&
                  layerPaths.map((path, index) => {
                    return (
                      <span
                        key={index}
                        className="d-flex align-items-center gap-1 text-dark pointer"
                        onClick={() => handleLayerView(path.userId, path.role)}
                      >
                        <span className="path-text">{` > `}</span>
                        <span className="ml-1">
                          <Badges
                            attrBadge={{
                              color: `badge ${"badge-custom"}`,
                            }}
                          >
                            {` ${
                              path.role === layerRoles?.USER
                                ? "U"
                                : path.role === layerRoles?.WHITE_LABEL
                                ? "WL"
                                : path.role === layerRoles?.MASTER
                                ? "MS"
                                : path.role === layerRoles?.DOUBLE_SUPER
                                ? "DS"
                                : path.role === layerRoles?.SUPER_MASTER
                                ? "SM"
                                : path.role === layerRoles?.ADMIN
                                ? "AD"
                                : "SA"
                            }`}
                          </Badges>
                        </span>
                        <span className="path-text">{` ${path.username}`}</span>
                      </span>
                    );
                  })}
              </Col>
            </Row>

            <div className="overflow-auto" style={{ height: "62vh" }}>
              <table className="table table-bordered table-hover ">
                <thead className="table-light bg-light sticky-top " style={{ zIndex: 1 }}>
                  <tr className="text-left m-0" style={{ border: "none " }}>
                    {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                      <th className="align-middle">
                        <label className="input-border" style={{ margin: "0px" }}>
                          <input
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                            className="text-nowrap align-center"
                            type="checkbox"
                          />
                          <div className="custom-checkmark"></div>
                        </label>
                      </th>
                    )}
                    {/* <th className="text-nowrap ">{t("NAME")}</th> */}
                    <th className="text-nowrap ">{t("USER_NAME_NAME")}</th>
                    <th className="text-nowrap ">{t("CREATED_BY")}</th>
                    <th className="text-nowrap ">
                      {t("CREDIT_REFERENCE")} <br />
                      {layerData?.length > 1
                        ? `Total : ${layerData[1]?.total_ClientCreditsReference?.toFixed(2)}`
                        : null}
                    </th>
                    <th className="text-nowrap ">
                      {t("BALANCE")} <br />
                      {layerData?.length > 1 ? `Total : ${layerData[1]?.total_Balance?.toFixed(2)}` : null}
                    </th>
                    <th className="text-nowrap ">
                      {t("CLIENT_BALANCE")} <br />
                      {layerData?.length > 1 ? `Total : ${layerData[1]?.total_ClientBalance?.toFixed(2)}` : null}
                    </th>

                    {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                      <th className="text-nowrap text-center">{t("CREDIT")}</th>
                    )}
                    <th className="text-nowrap">{t("CLIENT P/L")}</th>
                    <th className="text-nowrap ">{t("EXPOSURE")}</th>
                    <th className="text-nowrap ">{t("AVAILABLE_BALANCE")}</th>
                    <th className="text-nowrap ">{t("COMMISSION")}</th>
                    <th className="text-nowrap text-center">{t("PASSWORD")}</th>
                    <th className="text-nowrap text-center">{t("ACTION")}</th>
                  </tr>
                </thead>
                <tbody>
                  {layerData?.length > 0
                    ? layerData[0]?.map((layers, index) => {
                        let createdBy = finduserParent(layers?.parents);
                        let pl =
                          layers?.balance +
                          (layers?.clientBalance ? layers?.clientBalance : 0) -
                          layers?.creditReference;
                        return (
                          <tr className="text-left align-middle py-2" key={index}>
                            {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                              <td className="align-middle py-2">
                                <label className="input-border" style={{ margin: "0px" }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(layers._id)}
                                    onChange={() => handleCheckboxChange(layers._id)}
                                  />
                                  <div className="custom-checkmark"></div>
                                </label>
                              </td>
                            )}
                            <td className=" py-2">
                              <div className="name align-items-center d-flex">
                                {layers.role === layerRoles?.USER ? (
                                  <span className="ms-2 text-nowrap">
                                    {layers?.username} ({layers?.name})
                                  </span>
                                ) : (
                                  <Link
                                    className="ms-2 text-nowrap pointer"
                                    onClick={() => handleLayerView(layers?._id, layers?.role, layers?.username)}
                                  >
                                    {layers?.username} ({layers?.name})
                                  </Link>
                                )}
                              </div>
                              <div className="d-flex">
                                {layers?.whiteLabelId?.sharing ? (
                                  <div className="d-flex justify-content-center w-50">
                                    <span>
                                      <badges
                                        style={{
                                          backgroundColor: "#f4f4f4",
                                          width: "50px",
                                          height: "18px",
                                          borderRadius: "5px",
                                          color: "#2f2f3b",
                                          padding: "0.25rem 0.4rem",
                                          fontSize: "12px",
                                          fontWeight: "700",
                                          textAlign: "center",
                                        }}
                                      >
                                        {`Share ${layers?.whiteLabelId?.sharing}%`}
                                      </badges>
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {layers?.whiteLabelId?.currencyId && (
                                  <div className="d-flex justify-content-center w-30">
                                    <span>
                                      <badges
                                        style={{
                                          backgroundColor: "#f4f4f4",
                                          width: "50px",
                                          height: "18px",
                                          borderRadius: "5px",
                                          color: "#2f2f3b",
                                          padding: "0.25rem 0.4rem",
                                          fontSize: "12px",
                                          fontWeight: "700",
                                          textAlign: "center",
                                        }}
                                      >
                                        {`${layers?.whiteLabelId?.currencyId?.code}`}
                                      </badges>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="align-middle py-2">{createdBy?.parent_id?.username}</td>
                            <td className="align-middle py-2">
                              {adminData?.role !== ManagerRoles.MONITORING_MANAGER ? (
                                <CreditReference
                                  defaultValue={layers?.creditReference ? layers?.creditReference : 0}
                                  userId={layers?._id}
                                  fetchDefaultLayers={fetchWhiteLabels}
                                  adminBalance={adminData?.balance ? adminData?.balance : 0}
                                />
                              ) : (
                                layers?.creditReference?.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              )}
                            </td>
                            <td className="align-middle py-2">
                              {layers?.balance
                                ? layers?.balance?.toLocaleString("en-us", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : 0}
                            </td>
                            <td>
                              {layers?.clientBalance
                                ? layers?.clientBalance?.toLocaleString("en-us", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : 0}
                            </td>
                            {/* <td className="align-middle py-1">{layers?.credit}</td> */}

                            {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                              <td className="py-2  ">
                                <div className="d-flex align-items-center gap-1">
                                  <button
                                    onClick={() =>
                                      handleDeposit(layers?.balance, layers?.name, layers?._id, layers?.totalExposure)
                                    }
                                    className="deposit bg-light rounded"
                                  >
                                    D
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleWidrawal(layers?.balance, layers?.name, layers?._id, layers?.totalExposure)
                                    }
                                    className="withdrawal bg-light rounded"
                                  >
                                    W
                                  </button>
                                </div>
                              </td>
                            )}
                            <td className="align-middle py-1">
                              <div className="d-flex flex-column">
                                <span>{pl ? pl.toFixed(2) : 0}</span>
                              </div>
                            </td>
                            <td className="align-middle py-1">
                              <span
                                onClick={() => handleShowBets(layers?._id, layers?.username)}
                                className="exposure-txt"
                              >
                                {layers?.totalExposure
                                  ? layers?.totalExposure.toFixed(2)?.toLocaleString("en-us")
                                  : (0).toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <span className="availale-balance">
                                {layers?.availableBalance ? layers?.availableBalance?.toFixed(2) : 0}
                              </span>
                            </td>
                            <td className="align-middle py-1">
                              {layers?.commission && layers.commission === 1 ? "ON" : "OFF"}
                            </td>

                            <td className="align-middle py-1">
                              <div
                                className="d-flex justify-content-center"
                                onClick={() => handleTextCopy(layers?.passwordText)}
                              >
                                <Btn
                                  attrBtn={{
                                    color: "",
                                    className: "transparent-button text-dark",
                                    id: `TooltipExample-${layers._id}`,
                                  }}
                                  onMouseEnter={() => toggleTooltip(layers._id)}
                                  onMouseLeave={() => toggleTooltip(layers._id)}
                                >
                                  ****
                                </Btn>
                                <Tooltip
                                  placement="top"
                                  isOpen={activeTooltip === layers._id}
                                  target={`TooltipExample-${layers._id}`}
                                  toggle={() => toggleTooltip(layers._id)}
                                >
                                  {copied ? "copied" : layers?.passwordText ? layers?.passwordText : "****"}
                                </Tooltip>
                              </div>
                            </td>

                            <td className="py-2 ">
                              <div className="d-flex btn-group">
                                <Tooltip
                                  placement="top"
                                  isOpen={actionToolTip.id === layers?._id && actionToolTip.val === "Reports"}
                                  target={`Reports`}
                                  toggle={() => toggleActionTooltip("Reports", layers?._id)}
                                >
                                  {"Reports"}
                                </Tooltip>
                                <button
                                  id="Reports"
                                  className="px-2 py-1  credit-ref-btn btn border border-success bg-light"
                                  onClick={() => {
                                    history(`/report/${layers?.username}`, {
                                      state: {
                                        id: layers?._id,
                                        role: layers?.role,
                                        username: finduserParent(layers?.parents),
                                      },
                                    });
                                  }}
                                  onMouseEnter={() => toggleActionTooltip("Reports", layers?._id)}
                                  onMouseLeave={() => toggleActionTooltip("Reports", layers?._id)}
                                >
                                  R
                                </button>
                                {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                                  <>
                                    <Tooltip
                                      placement="top"
                                      isOpen={
                                        actionToolTip.id === layers?._id && actionToolTip.val === "password-change"
                                      }
                                      target={`password-change`}
                                      toggle={() => toggleActionTooltip("password-change", layers?._id)}
                                    >
                                      {"Password Change"}
                                    </Tooltip>
                                    <button
                                      id="password-change"
                                      onClick={() => handleResetPassword(layers?.username, layers?._id)}
                                      onMouseEnter={() => toggleActionTooltip("password-change", layers?._id)}
                                      onMouseLeave={() => toggleActionTooltip("password-change", layers?._id)}
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      PC
                                    </button>
                                    <Tooltip
                                      placement="top"
                                      isOpen={actionToolTip.id === layers?._id && actionToolTip.val === "permissions"}
                                      target={`permissions`}
                                      toggle={() => toggleActionTooltip("permissions", layers?._id)}
                                    >
                                      {"Permissions"}
                                    </Tooltip>
                                    <button
                                      id="permissions"
                                      onClick={() =>
                                        handlePermission(
                                          layers?.betAllow,
                                          layers?.status,
                                          layers?.username,
                                          layers?._id,
                                          layers?.role,
                                          index
                                        )
                                      }
                                      onMouseEnter={() => toggleActionTooltip("permissions", layers?._id)}
                                      onMouseLeave={() => toggleActionTooltip("permissions", layers?._id)}
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      P
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
                {/* </CardBody> */}
              </table>
              {loading === false && layerData === null && layerData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow
                rowCount={rowCount}
                setRowCount={setRowCount}
                keyVal={currentPage}
                setCurrPage={setCurrentPage}
              />
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
          title={t("DEPOSIT_OF")}
          fetchDefaultLayers={fetchWhiteLabels}
          toggler={setdepositModal}
          setNewBalance={setNewBalance}
          modalData={modalData}
          deposit={true}
          size="md"
          layerData={layerData}
          setLayerData={setLayerData}
          whiteLabelType={whiteLabelType === undefined ? "NONE" : whiteLabelType}
        />
      )}
      {withdrawalModal && (
        <DepositModal
          isOpen={withdrawalModal}
          title={t("WITHDRAWAL_OF")}
          fetchDefaultLayers={fetchWhiteLabels}
          toggler={setWithdrawalModal}
          modalData={modalData}
          setNewBalance={setNewBalance}
          deposit={false}
          size="md"
          layerData={layerData}
          setLayerData={setLayerData}
          whiteLabelType={whiteLabelType === undefined ? "NONE" : whiteLabelType}
        />
      )}
      {sharesModal && (
        <ShareModal isOpen={sharesModal} title={t("SHARES")} toggler={setSharesModal} modalData={modalData} size="md" />
      )}
      {resetPasswordModal && (
        <ResetPasswordModal
          isOpen={resetPasswordModal}
          title={t("CHANGE_PASSWORD_OF")}
          toggler={setResetPasswordModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("NEW_PASSWORD")}
          fetchDefaultLayers={fetchWhiteLabels}
        />
      )}
      {permissionModal && (
        <PermissionModal
          isOpen={permissionModal}
          title={t("PERMISSIONS_OF")}
          toggler={setPermissionModal}
          modalData={modalData}
          inactive={inactive}
          setDataUpdate={setDataUpdate}
          fetchDefaultLayers={fetchWhiteLabels}
          fetchInactiveLayers={fetchInactiveLayers}
          size="md"
        />
      )}
      {settlementAmountModal && (
        <SettlementAmountModal
          isOpen={settlementAmountModal}
          fetchDefaultLayers={fetchWhiteLabels}
          title={t("SETTLEMENT_OF")}
          toggler={setsettlementAmountModal}
          modalData={modalData}
          size="md"
        />
      )}
      {settlementHistoryModal && (
        <SettlementHistoryModal
          isOpen={settlementHistoryModal}
          title={t("SETTLEMENT_HISTORY")}
          toggler={setsettlementHistoryModal}
          modalData={modalData}
          size="lg"
        />
      )}
      {betsModal && (
        <BetsModal
          isOpen={betsModal}
          title={"Bets Of"}
          toggler={setBetsModal}
          modalData={modalData}
          deposit={true}
          size="xl"
        />
      )}
    </Fragment>
  );
};
export default ListWhiteLabels;
