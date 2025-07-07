import React, { Fragment, useEffect, useRef, useState } from "react";
import { saveAs } from 'file-saver';
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
  Tooltip,
} from "reactstrap";
import { FiRefreshCw } from "react-icons/fi";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { Badges, Breadcrumbs, Btn } from "../../../../AbstractElements";
import { ManagerRoles, PAGINATION, layerRoles } from "../../../../Constant";
import { Actions } from "../../../../Constant/index";
import usePageTitle from "../../../../Hooks/usePageTitle";
import "../../../../assets/scss/pages/_customCheckBox.scss";
import "../../../../assets/scss/pages/settlement/modalBtn.scss";
import {
  addPermission,
  client2FADetails,
  clientSettlement,
  getCurrency,
  getInactiveLayers,
  getLayers,
  getUserBetsEvent,
  getUsersGroupFunctions,
} from "../../../../redux/action";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import DepositModal from "../modal/DepositModal";
import PermissionModal from "../modal/PermissionModal";
import ResetPasswordModal from "../modal/ResetPasswordModal";
import SettlementAmountModal from "../modal/SettlementAmountModal";
import SettlementHistoryModal from "../modal/SettlementHistoryModal";
import ShareModal from "../modal/ShareModal";
import CreditReference from "./CreditReference";
import Bonus from "./Bonus";
import Loader from "../../../../Layout/Loader";

import { toast } from "react-toastify";
import "../../../../assets/scss/pages/resultTransaction.scss";
import BetsModal from "../modal/BetsModal";
import {
  convertINRToCurrency,
  convertToExcelDynamicFunction,
  finduserParent,
  notifySuccess,
  notifyWarning,
} from "../../../../utils/helper";
import BetfairShareUpdateModal from "../modal/BetfairShareUpdateModal";
import ClientShareUpdateModal from "../modal/ClientShareUpdateModal";
import CommissionPercentageModal from "../modal/CommissionPercentageModal";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UserAuthenticationModal from "../../../Common/Component/Modals/UserAuthenticationModal";
import ClientSettlementPreview from "./ClientSettlementPreview";
import GroupNameUpdateModal from "../modal/GroupNameUpdateModal";
import SelectAllUsers from "./SelectAllUsers";
import { ExcelPreview } from "./ExcelPreview";
import SettlementCompleted from "./SettlementCompleted";

const ListUsers = ({ inactive }) => {
  let userType = inactive ? 0 : 1;
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const history = useNavigate();
  const adminData = useSelector((state) => state.Login.userData);
  const whiteLabelType = useSelector((state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType);
  const [latestCreatedBy, setLatestCreatedBy] = useState(adminData.username);
  const [depositModal, setdepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [idToUpdate, setIdToUpdate] = useState("");
  const [newBalance, setNewBalance] = useState(0);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage); // Current selected row count
  const [totalPages, setTotalPages] = useState(1);
  const [currentClickedUser, setCurrentClickedUser] = useState("");
  const [sharesModal, setSharesModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [betsModal, setBetsModal] = useState(false);
  const [password, setPassword] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedIdsClientSettlement, setSelectedIdsClientSettlement] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [settlementAmountModal, setsettlementAmountModal] = useState(false);
  const [settlementHistoryModal, setsettlementHistoryModal] = useState(false);
  const [layerData, setLayerData] = useState([]);
  const [layerPaths, setLayerPaths] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currentCurrencies, setCurrentCurrencies] = useState([]);
  const [actionToolTip, setActionToolTip] = useState({ id: "", val: "" });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [dataUpdate, setDataUpdate] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [betfareshareModal, setBetfareshareModal] = useState(false);
  const [clientShareModal, setClientShareModal] = useState(false);
  const [groupNameModal, setGroupNameModal] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState({
    label: "Max Exposure",
    value: "maxExposure",
  });
  const sortingOptions = [
    { label: "Max Exposure", value: "maxExposure" },
    { label: "Max Positive PL", value: "maxPositivePL" },
    { label: "Max Negative PL", value: "maxNegativePL" },
    { label: "Recently Created", value: "recentlyCreated" },
    { label: "A -> Z", value: "atoz" },
    { label: "Z -> A", value: "ztoa" },
  ];
  // REVIEW STATES START
  const [excelSheetDataPreview, setExcelSheetDataPreview] = useState([])
  const [usersGroupDetails, setUsersGroupDetails] = useState([])
  const [showReviewGroupModal, setShowReviewGroupModal] = useState(false)
  const [selectAllUsers, setSelectAllUsers] = useState([])
  // REVIEW STATES END

  const [commissionPercentageModal, setCommissionPercentageModal] =
    useState(false);

  const [showUserAuthenticationToggle, setShowUserAuthenticationToggle] =
    useState(false);
  const [clientAuthenticationData, setClientAuthenticationData] = useState([]);
  const [excelSheetTitle, setExcelSheetTitle] = useState("");

  const {
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleFilterByCurrencyReset = () => {
    if (selectedCurrency || selectedSorting.value !== 'maxExposure') {
      setSelectedSorting({
        label: "Max Exposure",
        value: "maxExposure",
      })
      setSelectedCurrency("");
      setIsRotating(true);
      setTimeout(() => {
        setIsRotating(false);
      }, 100);
    }
  };

  let searchTimeout;
  function searchUsers(newSearchText) {
    setSearchText(newSearchText);
  }

  const handleInputChange = (e) => {
    const newSearchText = e.target.value;
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      searchUsers(newSearchText);
    }, 1000);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [currentClickedUser, rowCount, selectedCurrency, userType]);

  useEffect(() => {
    handleFilterByCurrencyReset();
    setLayerPaths([]);
    setCurrentClickedUser("");
  }, [userType]);

  useEffect(() => {
    setRowCount(10);
  }, [currentClickedUser, selectedCurrency, userType]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      getLayers({
        buildTreeFrom: currentClickedUser,
        search: searchText,
        userType: userType,
        selectedCurrency: selectedCurrency.value,
        perPage: rowCount,
        page: currentPage,
        selectedSorting: selectedSorting?.value,
        callback: (data) => {
          setLoading(false);
          setLayerData(data);
          setLatestCreatedBy(data?.meta?.adminData?.username);
          // setCurrentUserDetails(data?.meta?.adminData);
          setTotalPages(data?.meta?.totalPages);
          setCurrentCurrencies(data?.meta.currencies);
        },
      })
    );
  }, [
    currentClickedUser,
    selectedCurrency,
    rowCount,
    currentPage,
    dispatch,
    searchText,
    userType,
    selectedSorting
  ]);

  useEffect(() => {
    updateBalance(layerData, idToUpdate, newBalance);
  }, [newBalance]);

  const fetchDefaultLayers = () => {
    dispatch(
      getLayers({
        buildTreeFrom: currentClickedUser,
        search: searchText,
        userType: 1,
        selectedCurrency: selectedCurrency.value,
        perPage: rowCount,
        page: currentPage,
        selectedSorting: selectedSorting?.value,
        callback: (data) => {
          setLoading(false);
          setLayerData(data);
          setLatestCreatedBy(data?.meta?.adminData?.username);
          // setCurrentUserDetails(data?.meta?.adminData);
          setTotalPages(data?.meta?.totalPages);
          setCurrentCurrencies(data?.meta.currencies);
        },
      })
    );
  };

  const fetchInactiveLayers = () => {
    dispatch(
      getLayers({
        buildTreeFrom: currentClickedUser,
        search: searchText,
        userType: 0,
        selectedCurrency: selectedCurrency.value,
        perPage: rowCount,
        page: currentPage,
        selectedSorting: selectedSorting?.value,
        callback: (data) => {
          setLoading(false);
          setLayerData(data);
          setLatestCreatedBy(data?.meta?.adminData?.username);
          // setCurrentUserDetails(data?.meta?.adminData);
          setTotalPages(data?.meta?.totalPages);
          setCurrentCurrencies(data?.meta.currencies);
        },
      })
    );
  };

  const handleLinkClick = (data) => {
    const { username, role, _id } = data;
    searchUsers("");

    setCurrentClickedUser(_id);

    if (_id === adminData.userId) {
      setLayerPaths([]);
    } else {
      if (layerPaths?.length === 0) {
        setLayerPaths([{ username, role, _id }]);
      } else {
        const existingIndex = layerPaths.findIndex(
          (layer) => layer._id === _id
        );

        if (existingIndex !== -1) {
          setLayerPaths(layerPaths.slice(0, existingIndex + 1));
        } else {
          setLayerPaths([...layerPaths, { username, role, _id }]);
        }
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const updateBalance = (layerData, id, newBalance) => {
    setLayerData((prevLayerData) => {
      const updatedData = prevLayerData?.data?.map((userArray, index) => {
        if (index === 0) {
          const updatedUserArray = userArray.map((user) => {
            if (user._id === id) {
              return { ...user, balance: newBalance };
            }
            return user;
          });
          return updatedUserArray;
        }
        return userArray;
      });

      return {
        ...prevLayerData,
        data: updatedData,
      };
    });
  };

  const updatePermissions = (newPermissions) => {
    const { ids, betAllow, status } = newPermissions;

    setLayerData((prevLayerData) => {
      const updatedData = { ...prevLayerData };
      const userArray = updatedData?.data[0];
      if (userArray && Array.isArray(userArray)) {
        ids.forEach((id) => {
          const user = userArray.find((user) => user._id === id);
          if (user) {
            user.betAllow = betAllow === "true";
            user.status = status;
          }
        });
      }

      return updatedData;
    });
  };

  const handleDeposit = (balance, name, userId, exposure, currencyValues) => {
    setIdToUpdate(userId);
    const currencyValue = selectedCurrency
      ? currencyValues
      : adminData?.currencyId?.value;
    const currencyToChange = currencyValues;
    setModaldata({
      balance,
      name,
      userId,
      type: "deposit",
      exposure,
      currencyValue,
      currencyToChange,
    });
    setdepositModal(true);
  };

  const handleWidrawal = (balance, name, userId, exposure, currencyValues) => {
    setIdToUpdate(userId);
    const currencyValue = selectedCurrency
      ? currencyValues
      : adminData?.currencyId?.value;
    const currencyToChange = currencyValues;

    setModaldata({
      balance,
      name,
      userId,
      type: "withdrawl",
      exposure,
      currencyValue,
      currencyToChange,
    });
    setWithdrawalModal(true);
  };

  const handleShares = (sportShares, casinoShares) => {
    setModaldata({ sportShares, casinoShares });

    setSharesModal(true);
  };

  const handleClientShares = (id, username, clientshares) => {
    // setModaldata({ sportShares, casinoShares });
    setModaldata({ id, username, clientshares });
    setClientShareModal(true);
  };

  const handleGroupName = (id, username, groupName) => {
    // setModaldata({ sportShares, casinoShares });
    setModaldata({ id, username, groupName });
    setGroupNameModal(true);
  };

  const handleResetPassword = (username, userId) => {
    setModaldata({ username: username, userId: userId });
    setResetPasswordModal(true);
  };

  const handleCheckboxChange = (id, layer, pl) => {
    const isSelected = selectedIds.includes(id);
    let updatedSelectedIds = [];
    let updatedSelectedIdsClientSettlement = [];
    if (isSelected) {
      updatedSelectedIds = selectedIds.filter(
        (selectedId) => selectedId !== id
      );
      updatedSelectedIdsClientSettlement = selectedIdsClientSettlement.filter(
        (selectedId) => selectedId?.id !== id
      );
    } else {
      updatedSelectedIds = [...selectedIds, id];
      updatedSelectedIdsClientSettlement = [...selectedIdsClientSettlement, { id: layer?._id, currency: { code: layer?.currencyData?.code, value: layer?.currencyData?.value }, clientBalance: layer?.clientBalance, clientPl: pl }];
    }

    setSelectedIdsClientSettlement(updatedSelectedIdsClientSettlement);
    setSelectedIds(updatedSelectedIds);
    setSelectAll(updatedSelectedIds?.length === layerData?.data[0]?.length);
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedIdsClientSettlement([]);
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = layerData?.data[0]?.map((item) => item._id);
      const allIdsClientSettlement = layerData?.data[0]?.map((item) => {
        let pl =
          item?.balance +
          (item?.clientBalance ? item?.clientBalance : 0) -
          item?.creditReference;
        return ({
          id: item._id,
          currency: { code: item?.currencyData?.code, value: item?.currencyData?.value },
          clientBalance: item?.clientBalance,
          clientPl: pl
        })
      });
      setSelectedIdsClientSettlement(allIdsClientSettlement);
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  const clientSettlementLayer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIdsClientSettlement?.length > 0) {
      if (excelSheetTitle?.length > 0 && selectedIdsClientSettlement?.length > 0) {
        dispatch(
          clientSettlement({
            title: excelSheetTitle,
            settlementIds: selectedIdsClientSettlement,
            callback: (data) => {

              if (data?.meta?.code === 200) {
                if (data?.data?.noBalance) {
                  notifySuccess("The client settlement Excel sheet has been created, except for a few clients whose balance might be less than the client PL.", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    delayTime: 7000,  // Delay time in milliseconds
                  });
                } else {
                  notifySuccess("Client settlement excelsheet has been created.", {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                }
              }
              setExcelSheetTitle("");
              // Use FileSaver.js to download the file
              if (data?.data?.download_link !== "") {
                saveAs(data?.data?.download_link, 'filename.xlsx');
              }

              setSelectedIdsClientSettlement([]);
              setSelectedIds([]);
              dispatch(
                getLayers({
                  buildTreeFrom: currentClickedUser,
                  search: searchText,
                  userType: 1,
                  selectedCurrency: selectedCurrency.value,
                  perPage: rowCount,
                  page: currentPage,
                  selectedSorting: selectedSorting?.value,
                  callback: (data) => {
                    setLayerData(data);
                    setLatestCreatedBy(data?.meta?.adminData?.username);
                    // setCurrentUserDetails(data?.meta?.adminData);
                    setTotalPages(data?.meta?.totalPages);
                    setCurrentCurrencies(data?.meta.currencies);
                  },
                })
              );
            },
          })
        );
      } else {
        notifyWarning(t("TITLE_DESCRIPTION"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setExcelSheetTitle("");
      }
      // setLoading(true);
    } else {
      notifyWarning(t("SELECT_CLIENTS"), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setExcelSheetTitle("");
    }
  };


  const clientSettlementLayerReview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIdsClientSettlement?.length > 0 || selectAllUsers?.length > 0) {
      dispatch(
        clientSettlement({
          review: true,
          title: excelSheetTitle?.length > 0 ? excelSheetTitle : "Preview Sheet",
          settlementIds: selectedIdsClientSettlement?.length > 0 ? selectedIdsClientSettlement : selectAllUsers,
          callback: (data) => {
            if (data?.meta?.code === 200 && data?.data !== null) {
              setExcelSheetDataPreview(data.data)
              setSelectAllUsers([])
            }
          },
        })
      );

    } else {
      notifyWarning(t("SELECT_CLIENTS"), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setExcelSheetTitle("");
    }
  };

  const getClientGroup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      getUsersGroupFunctions({
        review: true,
        update: false,
        callback: (data) => {
          if (data?.meta?.code === 200 && data?.data !== null) {
            setShowReviewGroupModal(true)
            setUsersGroupDetails(data.data)
          }
        },
      })
    );
  };

  const handleAllowAndBlock = (values) => {
    if (selectedIds?.length !== 0 && password !== "") {
      let dynamicKey =
        selectedAction?.value === "status" ? "status" : "betAllow";
      let data = {
        ids: selectedIds,
        password: password,
        [dynamicKey]:
          selectedAction?.value === "status"
            ? values
              ? "1"
              : "0"
            : values
              ? "true"
              : "false",
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
                fetchDefaultLayers();
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

  const toggleActionTooltip = useCallback(
    debounce((val, id) => {
      const data = { id: id === actionToolTip?.id ? null : id, val };

      setActionToolTip(data);
    }, 200),
    [actionToolTip]
  );

  const handleTextCopy = (textToCopy) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => setCopied(true))
        .catch((error) => console.error("Error copying text:", error));

      setTimeout(() => setCopied(false), 1500);
    } else {
      notifyWarning("Copy feature not available in private browsing", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handlePermission = (
    betAllow,
    status,
    username,
    userId,
    role,
    index
  ) => {
    // const prevUpdate =
    //   dataUpdate?.length > 0
    //     ? dataUpdate.reduce((accumulator, currentValue) => {
    //         return accumulator + (currentValue === index ? 1 : 0);
    //       }, 0)
    //     : 0;

    // if (prevUpdate % 2 === 1) betAllow = !betAllow;
    setModaldata({ betAllow, status, username, userId, role, index });
    setPermissionModal(true);
  };

  const handleShowBets = (userId, username, isBonus) => {
    const data = { userId, isBonus };
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

  const iconStyle = {
    transform: isRotating ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s",
    cursor: "pointer", // Add cursor style for clickable icons
    color: " #54ba4a",
    fontSize: "20px",
  };

  const handleBetfairShares = (username, id, role, betFairShare, share) => {
    setBetfareshareModal(true);
    setModaldata({ username, id, betFairShare, share });
  };

  const handleCommissionPercentage = (
    username,
    id,
    role,
    betFairShare,
    commissionPercentage
  ) => {
    setCommissionPercentageModal(true);
    setModaldata({ username, id, betFairShare, commissionPercentage });
  };

  const getClientAuthenticationDetails = (clientId) => {
    const data = {
      clientId,
      purpose: "fetchDetails",
    };
    dispatch(
      client2FADetails({
        data: data,
        callback: (data) => {

          setClientAuthenticationData(data.data);
          setShowUserAuthenticationToggle(true);
          // updateStatus={}
        },
      })
    );
  };

  function getRowData(row) {
    const pl =
      row?.balance +
      (row?.clientBalance ? row?.clientBalance : 0) -
      row?.creditReference;
    const data = [
      row.username ? row.username : "",
      latestCreatedBy,
      row.creditReference !== "null" ? row?.creditReference.toFixed(2) : "0",
      row.balance ? row?.balance.toFixed(2) : "0",
      row?.clientBalance ? row?.clientBalance?.toFixed(2) : "0",
      pl?.toFixed(2),
      row?.totalExposure ? row?.totalExposure?.toFixed(2) : "0",
      row?.balance && row.totalExposure
        ? row?.balance?.toFixed(2) - row?.totalExposure?.toFixed(2)
        : "0",
    ];
    if (whiteLabelType === "B2C") {
      data.push(row?.mobileNo ? row?.mobileNo : "0")
    }
    return data;
  }

  function convertoPDF(e) {
    try {
      e.preventDefault();
      if (!layerData?.data[0]?.length) {
        notifyWarning("No data to convert!!");
        return;
      }

      const doc = new jsPDF();
      const head = [
        "Username",
        "Created By",
        `${"CreditReference " + (layerData?.data[1]?.total_Balance?.toFixed(2))}`,
        `${"Balance " + (layerData?.data[1]?.total_ClientBalance?.toFixed(2))}`,
        `${"Clients Balance " + (layerData?.data[1]?.total_ClientCreditsReference?.toFixed(2))}`,
        "Client PL",
        "Exposure",
        "Available Balance",
      ];

      if (whiteLabelType === "B2C") {
        head.push("Mobile-No");
      }

      const body = layerData?.data[0]?.map((row) => getRowData(row));

      doc.setTextColor(0, 102, 204);
      doc.text("UserList", doc.internal.pageSize.width, 6, null, null, "left");

      doc.autoTable({
        head: [head],
        body: body,
        startY: 5,
        margin: { top: 2, right: 2, bottom: 2, left: 2 },
        cellPadding: 0,
        headStyles: {
          fontSize: 8,
          halign: "center",
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [242, 242, 242],
        },
        // styles: {
        //   lineWidth: 0.1,
        //   lineColor: [0, 0, 0],
        //   cellPadding: 0, // Apply padding removal at the general level
        //   fontSize: 7, // Adjust general font size
        // },
      });

      doc.save(`userlist`);
    } catch (err) {
      console.error(err?.message);
    }
  }


  function convertToExcel(e) {
    try {
      e.preventDefault();
      if (!layerData?.data[0]?.length) {
        notifyWarning("No data to convert!!");
        return;
      }
      let customizedData;
      customizedData = layerData?.data[0]?.map((row) => createDataObj(row));
      customizedData.push(layerData?.data[1]);
      const ws = utils.json_to_sheet(customizedData);

      // Calculate the maximum width of each column
      const colWidths = calculateColumnWidths(customizedData);

      // Set the column widths in the worksheet
      ws['!cols'] = colWidths.map(width => ({ width }));

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, `users` + ".xlsx");
    } catch (err) {
      console.error(err.message);
    }
    function createDataObj(row) {
      try {
        const pl =
          row?.balance +
          (row?.clientBalance ? row?.clientBalance : 0) -
          row?.creditReference;
        const dataObj = {
          username: row.username ? row.username : "",
          latestCreatedBy,
          creditReference:
            row.creditReference !== "null"
              ? row?.creditReference.toFixed(2)
              : "0",
          balance: row.balance ? row?.balance.toFixed(2) : "0",
          clientPL: pl?.toFixed(2),
          clientBalance: row?.clientBalance ? row?.clientBalance : "0",
          totalExposure: row?.totalExposure ? row?.totalExposure?.toFixed(2) : "0",
          availableBalance:
            row?.balance && row.totalExposure
              ? row?.balance?.toFixed(2) - row?.totalExposure?.toFixed(2)
              : "0",
        };

        if (whiteLabelType === "B2C") {
          dataObj.mobileNo = row?.mobileNo ? parseInt(row?.mobileNo) : "0";
        }

        return dataObj;
      } catch (err) {
        console.error(err?.message);
      }
    }

    function calculateColumnWidths(data) {
      const colWidths = [];
      if (data?.length === 0) return colWidths;

      // Initialize column widths based on the headers
      const headers = Object.keys(data[0]);
      headers.forEach((header, index) => {
        colWidths[index] = header?.length + 5;
      });

      // Calculate the maximum width for each column
      data.forEach(row => {
        headers.forEach((header, index) => {
          const cellValue = row[header] ? row[header].toString() : '';
          if (cellValue?.length > colWidths[index]) {
            colWidths[index] = cellValue?.length + 5;
          }
        });
      });

      // Add some padding to the column widths
      return colWidths.map(width => width + 5);
    }
  }


  const clientSettlementListVerified = () => {
    dispatch(
      clientSettlement({
        review: true,
        title: excelSheetTitle,
        settlementIds: selectedIdsClientSettlement,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            if (data?.data !== null) {
              setExcelSheetDataPreview(data.data)
            }
          }
        }
      },
      ))
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
            <CardHeader className="py-3 z-1">
              <Form autoComplete="off">
                <Row className="g-2 align-items-center">
                  <Col className=" col-12 col-md-3" style={{ zIndex: 50 }}>
                    <span className="text-danger">
                      {errors.action && t("FIELD_REQUIRED")}
                    </span>
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
                  </Col>
                  <Col className=" col-12 col-md-3">
                    <span className="text-danger">
                      {errors.password && t("FIELD_REQUIRED")}
                    </span>
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
                    <div className="d-flex">
                      <button
                        className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                        onClick={convertoPDF}
                      >
                        PDF
                      </button>
                      <button
                        className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                        onClick={convertToExcel}
                      >
                        Excel
                      </button>
                    </div>
                  </Col>
                  <Col
                    className="d-flex justify-content-between gap-2"
                    style={{ zIndex: 8 }}
                  >
                    {adminData?.role < 2 && (
                      <Col className="d-flex align-items-center gap-2">
                        <Controller
                          name="currency"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={currentCurrencies.map((currency) => ({
                                label: currency.name,
                                value: currency.code,
                              }))}
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  minWidth: "200px",
                                }),
                              }}
                              className="mySelect"
                              value={selectedCurrency || ""}
                              placeholder={t("CURRENCY")}
                              onChange={(option) => {
                                setSelectedCurrency(option);
                                field.onChange(option?.value);
                              }}
                            />
                          )}
                        />

                        <FiRefreshCw
                          style={iconStyle}
                          onClick={handleFilterByCurrencyReset}
                        />
                      </Col>
                    )}
                    <Col className="d-flex align-items-center justify-content-end">
                      <Link to={"/users/add-user"}>
                        <Button color="success">{t("ADD_USER")}</Button>
                      </Link>
                    </Col>
                  </Col>
                </Row>
                {(layerPaths?.length === 0 &&
                  [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.FANCY_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, layerRoles.DIRECTOR]?.includes(adminData?.role)) && <Row className="g-2 align-items-center mt-4">
                    <Col>
                      <div className="d-flex">
                        <button
                          disabled={selectedIdsClientSettlement?.length === 0 && loading}
                          className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                          onClick={(e) => clientSettlementLayer(e)}
                        >
                          Client Settlement
                        </button>
                        <button
                          disabled={selectedIdsClientSettlement?.length === 0 && loading}
                          className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                          onClick={(e) => clientSettlementLayerReview(e)}
                        >
                          Client Settlement Preview
                        </button>
                        <button
                          disabled={selectedIdsClientSettlement?.length === 0 && loading}
                          className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
                          onClick={(e) => getClientGroup(e)}
                        >
                          Client Group Vise
                        </button>
                      </div>
                    </Col>
                    {selectedIdsClientSettlement?.length > 0 && <Col>
                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            style={{ fontSize: "14px" }}
                            className="form-control py-2"
                            id="passwordInput"
                            type="string"
                            placeholder={t("TITLE_DESCRIPTION")}
                            onChange={(e) => setExcelSheetTitle(e.target.value)}
                          />
                        )}
                      />
                    </Col>}
                  </Row>}
              </Form>
            </CardHeader>
          )}
          <CardBody className="p-0 z-0">
            <Row className="bg-light p-2">
              <Col className="d-flex gap-1">
                <span
                  className="text-dark pointer path-text"
                  onClick={() =>
                    handleLinkClick({
                      username: adminData.username,
                      role: adminData.role,
                      _id: adminData.userId,
                    })
                  }
                >
                  {adminData?.username}
                </span>
                {layerPaths?.length !== 0 &&
                  layerPaths.map((path, index) => {
                    return (
                      <span
                        key={index}
                        className="d-flex align-items-center gap-1 text-dark pointer"
                        onClick={() => handleLinkClick(path)}
                      >
                        <span className="path-text">{` > `}</span>
                        <span className="ml-1">
                          <Badges
                            attrBadge={{
                              color: `badge ${"badge-custom"}`,
                            }}
                          >
                            {` ${path.role === layerRoles?.USER
                              ? "U"
                              : path.role === layerRoles?.AGENT
                                ? "AG"
                                : path.role === layerRoles?.MASTER
                                  ? "MS"
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

            <Row
            //  className="align-items-center"
            >

              <Col className="d-flex justify-content-between align-items-center m-2">
                {(layerPaths?.length === 0 && [
                  ManagerRoles.ACCOUNTS_MANAGER,
                  ManagerRoles.MANAGER,
                  ManagerRoles.MONITORING_MANAGER,
                  ManagerRoles.FANCY_MANAGER,
                  ManagerRoles.OPERATIONAL_MANAGER,
                  layerRoles.DIRECTOR]?.includes(adminData?.role)) && !inactive && (
                    <SelectAllUsers
                      currentClickedUser={currentClickedUser}
                      setLoading={setLoading}
                      userType={userType}
                      setSelectAllUsers={setSelectAllUsers}
                      selectAllUsers={selectAllUsers}
                      setSelectedIdsClientSettlement={setSelectedIdsClientSettlement}
                    />
                  )}

                <input
                  style={{ fontSize: "14px", padding: '10px' }}
                  className="form-control w-25"
                  id="search"
                  type="text"
                  placeholder="Search user"
                  onChange={handleInputChange}
                />

                <div className="d-flex">
                  <Controller
                    name="sorting"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={sortingOptions}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minWidth: "200px",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 100,
                          }),
                        }}
                        className="mySelect"
                        value={selectedSorting}
                        placeholder="Sort By"
                        onChange={(option) => {
                          setSelectedSorting(option);
                          field.onChange(option?.value);
                        }}
                      />
                    )}
                  />
                  {(layerPaths?.length === 0 && [layerRoles.DIRECTOR]?.includes(adminData?.role)) && (
                    <SettlementCompleted />
                  )}
                </div>
              </Col>
            </Row>

            <div className="overflow-auto" style={{ height: "62vh" }}>
              <table className="table table-bordered table-hover ">
                <thead
                  className="table-light bg-light sticky-top "
                  style={{ zIndex: 1 }}
                >
                  <tr className="text-left m-0" style={{ border: "none " }}>
                    {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                      <th className="align-middle">
                        <label
                          className="input-border"
                          style={{ margin: "0px" }}
                        >
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
                      {t("CREDIT_REFERENCE")}
                      <br />
                      Total :&nbsp;
                      {layerData?.data?.length
                        ? Number(
                          layerData?.data[1]?.total_ClientCreditsReference?.toFixed(
                            2
                          )
                        ).toLocaleString()
                        : "-"}
                    </th>
                    {whiteLabelType === "B2C" && <th className="text-nowrap">{t("BONUS")}</th>}
                    <th className="text-nowrap ">
                      {t("BALANCE")} <br />
                      Total :&nbsp;
                      {layerData?.data?.length
                        ? Number(
                          layerData?.data[1]?.total_Balance?.toFixed(2)
                        ).toLocaleString()
                        : "-"}
                    </th>

                    <th className="text-nowrap ">
                      {t("CLIENT_BALANCE")}
                      <br />
                      Total :&nbsp;
                      {layerData?.data?.length
                        ? Number(
                          layerData?.data[1]?.total_ClientBalance?.toFixed(2)
                        ).toLocaleString()
                        : "-"}
                    </th>
                    {/* {adminData?.role !== ManagerRoles.MONITORING_MANAGER && (
                      <th className="text-nowrap text-center">{t("CREDIT")}</th>
                    )} */}
                    <th className="text-nowrap">{t("CLIENT P/L")}</th>
                    <th className="text-nowrap ">{t("EXPOSURE")}</th>
                    {/* {whiteLabelType === "B2C" && <th className="text-nowrap">{t("EXPOSURE_BONUS")}</th>} */}
                    <th className="text-nowrap ">{t("AVAILABLE_BALANCE")}</th>
                    {/* {whiteLabelType === "B2C" && <th className="text-nowrap">{t("AVAILABLE_BONUS")}</th>} */}
                    {/* <th className="text-nowrap ">{t("COMMISSION")}</th> */}
                    {/* <th className="text-nowrap ">{t("SETTLEMENT")}</th> */}
                    {whiteLabelType === "B2C" && <th className="text-nowrap">{t("MOBILE")}</th>}
                    {(Object.values(ManagerRoles)[3] !== adminData?.role) && <th className="text-nowrap text-center">{t("PASSWORD")}</th>}

                    <th className="text-nowrap text-center">{t("ACTION")}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* AN ADDITIONAL DATA IS RECEIVING IN THIS API FOR HIDE THAT WE USE SLICE */}
                  {/* {(Array.isArray(layerData?.data) && layerData?.data?.length >= 1 ? layerData?.data.slice(0, -1) : layerData?.data)?.map((layers, index) => { */}

                  {layerData?.data?.length &&
                    layerData?.data[0]?.map((layers, index) => {
                      // let createdBy = finduserParent(layers?.parents);
                      let pl =
                        layers?.balance +
                        (layers?.clientBalance ? layers?.clientBalance : 0) -
                        layers?.creditReference;
                      return (
                        <tr className="text-left align-middle py-2" key={index}>
                          {adminData?.role !==
                            ManagerRoles.MONITORING_MANAGER && (
                              <td className="align-middle py-2">
                                <label
                                  className="input-border"
                                  style={{ margin: "0px" }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(layers._id)}
                                    onChange={() =>
                                      handleCheckboxChange(layers._id, layers, pl)
                                    }
                                  />
                                  <div className="custom-checkmark"></div>
                                </label>
                              </td>
                            )}
                          <td className=" py-2">
                            <div className="name align-items-center d-flex">
                              <span>
                                <badges
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f4f4f4",
                                    width: "30px",
                                    height: "18px",
                                    borderRadius: "5px",
                                    color: "#2f2f3b",
                                    padding: "0.25rem 0.4rem",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                  }}
                                >
                                  {` ${layers?.role === layerRoles?.USER
                                    ? "U"
                                    : layers?.role === layerRoles?.WHITE_LABEL
                                      ? "WL"
                                      : layers?.role === layerRoles?.MASTER
                                        ? "MS"
                                        : layers?.role ===
                                          layerRoles?.DOUBLE_SUPER
                                          ? "DS"
                                          : layers?.role ===
                                            layerRoles?.SUPER_MASTER
                                            ? "SM"
                                            : layers?.role === layerRoles?.ADMIN
                                              ? "AD"
                                              : "SA"
                                    }`}
                                </badges>
                              </span>
                              {/* {layers?.totalShares ? layers?.totalShares : "0"} */}
                              {layers.role === layerRoles?.USER ? (
                                <span className="ms-2 text-nowrap">
                                  {layers?.username} ({layers?.name})
                                </span>
                              ) : (
                                <Link
                                  className="ms-2 text-nowrap pointer"
                                  onClick={() => handleLinkClick(layers)}
                                >
                                  {layers?.username} ({layers?.name})
                                </Link>
                              )}
                            </div>
                            <div className="d-flex mt-1 w-15 gap-2">
                              {layers?.sportShares ? (
                                <div className="d-flex justify-content-center text-nowrap">
                                  <span>
                                    <badges
                                      style={{
                                        backgroundColor: "#f4f4f4",
                                        width: "40px",
                                        height: "18px",
                                        borderRadius: "5px",
                                        color: "#2f2f3b",
                                        padding: "0.25rem 0.4rem",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                      }}
                                    >
                                      {layers?.sportShares
                                        ? `Share ${layers?.sportShares}%`
                                        : ""}
                                    </badges>
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {layers?.commissionPercentage ? (
                                <div className="d-flex justify-content-center text-nowrap">
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
                                      {`CP ${layers?.commissionPercentage}%`}
                                    </badges>
                                  </span>
                                </div>
                              ) : null}
                              {adminData.role < 2 ? (
                                <div className="d-flex justify-content-center ">
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
                                      {layers?.currencyData
                                        ? `${layers?.currencyData?.code}`
                                        : ""}
                                    </badges>
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                          <td className="align-middle py-2">
                            {latestCreatedBy}
                          </td>
                          <td className="align-middle py-2">
                            {adminData?.role !==
                              ManagerRoles.MONITORING_MANAGER ? (
                              <span className="d-flex">
                                <CreditReference
                                  defaultValue={layers?.creditReference}
                                  userId={layers?._id}
                                  inactive={inactive}
                                  fetchDefaultLayers={fetchDefaultLayers}
                                  fetchInactiveLayers={fetchInactiveLayers}
                                  adminBalance={
                                    adminData?.balance ? adminData?.balance : 0
                                  }
                                  currency={layers?.currencyData}
                                />
                                <span
                                  className="mt-2 font-weight-normal"
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {layers?.currencyData?.value !== "1" &&
                                    adminData?.role < 1.9 && (
                                      <>
                                        {"("}
                                        {convertINRToCurrency(
                                          layers?.creditReference,
                                          layers?.currencyData?.value
                                        )}
                                        {")"}
                                      </>
                                    )}
                                </span>
                              </span>
                            ) : (
                              // layers?.creditReference?.toLocaleString("en-us", {
                              //   minimumFractionDigits: 2,
                              //   maximumFractionDigits: 2,
                              // })
                              <>
                                {/* {selectedCurrency
                                  ? convertINRToCurrency(
                                      layers?.creditReference,
                                      parseFloat(selectedCurrency?.value?.value)
                                    )
                                  : convertINRToCurrency(
                                      layers?.creditReference,
                                      parseFloat(adminData?.currencyId?.value)
                                    )} */}
                                {selectedCurrency
                                  ? convertINRToCurrency(
                                    layers?.creditReference,
                                    parseFloat(selectedCurrency?.value?.value)
                                  )
                                  : layers?.creditReference}
                              </>
                            )}
                          </td>
                          {whiteLabelType === "B2C" && <td className="align-middle py-2">
                            {(adminData?.role !==
                              ManagerRoles.MONITORING_MANAGER) ? (
                              <span className="d-flex">
                                <Bonus
                                  defaultValue={layers?.bonus}
                                  userId={layers?._id}
                                  inactive={inactive}
                                  fetchDefaultLayers={fetchDefaultLayers}
                                  fetchInactiveLayers={fetchInactiveLayers}
                                  adminBalance={
                                    adminData?.balance ? adminData?.balance : 0
                                  }
                                  currency={layers?.currencyData}
                                />
                                <span
                                  className="mt-2 font-weight-normal"
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {layers?.currencyData?.value !== "1" &&
                                    adminData?.role < 1.9 && (
                                      <>
                                        {"("}
                                        {convertINRToCurrency(
                                          layers?.bonus,
                                          layers?.currencyData?.value
                                        )}
                                        {")"}
                                      </>
                                    )}
                                </span>
                              </span>
                            ) : (
                              // layers?.creditReference?.toLocaleString("en-us", {
                              //   minimumFractionDigits: 2,
                              //   maximumFractionDigits: 2,
                              // })
                              <>
                                {/* {selectedCurrency
                                  ? convertINRToCurrency(
                                      layers?.creditReference,
                                      parseFloat(selectedCurrency?.value?.value)
                                    )
                                  : convertINRToCurrency(
                                      layers?.creditReference,
                                      parseFloat(adminData?.currencyId?.value)
                                    )} */}
                                {selectedCurrency
                                  ? convertINRToCurrency(
                                    layers?.bonus,
                                    parseFloat(selectedCurrency?.value?.value)
                                  )
                                  : layers?.bonus}
                              </>
                            )}
                          </td>}

                          <td className="align-middle py-2">
                            {/* {layers?.balance?.toLocaleString("en-us", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} */}

                            <>
                              {/* {selectedCurrency
                                ? convertINRToCurrency(
                                    layers?.balance,
                                    parseFloat(selectedCurrency?.value?.value)
                                  )
                                : convertINRToCurrency(
                                    layers?.balance,
                                    parseFloat(adminData?.currencyId?.value)
                                  )} */}
                              {selectedCurrency
                                ? convertINRToCurrency(
                                  layers?.balance,
                                  parseFloat(selectedCurrency?.value?.value)
                                )
                                : layers?.balance?.toFixed(2)}
                              <span
                                style={{
                                  fontSize: "12px",
                                  marginLeft: "10px",
                                  fontWeight: "normal",
                                }}
                              >
                                {layers?.currencyData?.value !== "1" &&
                                  adminData?.role < 1.9 && (
                                    <>
                                      {"("}
                                      {convertINRToCurrency(
                                        layers?.balance,
                                        layers?.currencyData?.value
                                      )}
                                      {")"}
                                    </>
                                  )}
                              </span>
                            </>
                          </td>
                          <td>
                            {layers?.clientBalance ? (
                              // layers?.clientBalance?.toLocaleString("en-us", {
                              //     minimumFractionDigits: 2,
                              //     maximumFractionDigits: 2,
                              //   })
                              <>
                                {/* {selectedCurrency
                                  ? convertINRToCurrency(
                                      layers?.clientBalance,
                                      parseFloat(selectedCurrency?.value?.value)
                                    )
                                  : convertINRToCurrency(
                                      layers?.clientBalance,
                                      parseFloat(adminData?.currencyId?.value)
                                    )} */}
                                {selectedCurrency
                                  ? convertINRToCurrency(
                                    layers?.clientBalance,
                                    parseFloat(selectedCurrency?.value?.value)
                                  )
                                  : (layers?.clientBalance).toFixed(2)}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    marginLeft: "10px",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {layers?.currencyData?.value !== "1" &&
                                    adminData?.role < 1.9 && (
                                      <>
                                        {"("}
                                        {convertINRToCurrency(
                                          layers?.clientBalance,
                                          layers?.currencyData?.value
                                        )}
                                        {")"}
                                      </>
                                    )}
                                </span>
                              </>
                            ) : (
                              0
                            )}
                          </td>
                          {/* <td className="align-middle py-1">{layers?.credit}</td> */}

                          <td className="align-middle py-1">
                            <div className="d-flex flex-column">
                              {/* <span>{pl.toFixed(2)}</span> */}
                              <span
                                className={`${pl < 0 ? "text-danger" : "exposure-txt"
                                  }`}
                              >
                                {/* {selectedCurrency
                                  ? convertINRToCurrency(
                                      pl,
                                      parseFloat(selectedCurrency?.value?.value)
                                    )
                                  : convertINRToCurrency(
                                      pl,
                                      parseFloat(adminData?.currencyId?.value)
                                    )} */}
                                {selectedCurrency
                                  ? convertINRToCurrency(
                                    pl,
                                    parseFloat(selectedCurrency?.value?.value)
                                  )
                                  : pl?.toFixed(2)}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "black",
                                    marginLeft: "10px",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {layers?.currencyData?.value !== "1" &&
                                    adminData?.role < 1.9 && (
                                      <>
                                        {"("}
                                        {convertINRToCurrency(
                                          pl,
                                          layers?.currencyData?.value
                                        )}
                                        {")"}
                                      </>
                                    )}
                                </span>
                              </span>
                            </div>
                          </td>

                          <td className="align-middle py-1">
                            <span
                              onClick={() =>
                                handleShowBets(layers?._id, layers?.username, false)
                              }
                              className="exposure-txt"
                            >
                              {layers?.totalExposure ? (
                                <>
                                  {/* {selectedCurrency
                                    ? convertINRToCurrency(
                                        layers?.totalExposure,
                                        parseFloat(
                                          selectedCurrency?.value?.value
                                        )
                                      )
                                    : convertINRToCurrency(
                                        layers?.totalExposure,
                                        parseFloat(adminData?.currencyId?.value)
                                      )} */}
                                  {selectedCurrency
                                    ? convertINRToCurrency(
                                      layers?.totalExposure,
                                      parseFloat(
                                        selectedCurrency?.value?.value
                                      )
                                    )
                                    : layers?.totalExposure?.toFixed(2)}
                                </>
                              ) : (
                                (0).toFixed(2)
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "black",
                                marginLeft: "10px",
                              }}
                            >
                              {layers?.currencyData?.value !== "1" &&
                                adminData?.role < 1.9 && (
                                  <>
                                    {"("}
                                    {convertINRToCurrency(
                                      layers?.totalExposure,
                                      layers?.currencyData?.value
                                    )}
                                    {")"}
                                  </>
                                )}
                            </span>
                          </td>
                          {/* {whiteLabelType === "B2C" && <td className="align-middle py-1">
                            <span
                              onClick={() =>
                                handleShowBets(layers?._id, layers?.username, true)
                              }
                              className="exposure-txt"
                            >
                              {layers?.totalBonusExposure ? (
                                <>
                                  {selectedCurrency
                                    ? convertINRToCurrency(
                                      layers?.totalBonusExposure,
                                      parseFloat(
                                        selectedCurrency?.value?.value
                                      )
                                    )
                                    : layers?.totalBonusExposure?.toFixed(2)}
                                </>
                              ) : (
                                (0).toFixed(2)
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "black",
                                marginLeft: "10px",
                              }}
                            >
                              {layers?.currencyData?.value !== "1" &&
                                adminData?.role < 1.9 && (
                                  <>
                                    {"("}
                                    {convertINRToCurrency(
                                      layers?.totalBonusExposure,
                                      layers?.currencyData?.value
                                    )}
                                    {")"}
                                  </>
                                )}
                            </span>
                          </td>} */}
                          {(layers?.role === layerRoles?.USER) ?
                            <td className="align-middle py-1">
                              <span className="availale-balance">
                                {(
                                  layers?.balance + layers?.totalExposure
                                ).toFixed(2)}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "black",
                                  marginLeft: "10px",
                                }}
                              >
                                {layers?.currencyData?.value !== "1" &&
                                  adminData?.role < 1.9 && (
                                    <>
                                      {"("}
                                      {convertINRToCurrency(
                                        layers?.balance + layers?.totalExposure,
                                        layers?.currencyData?.value
                                      )}
                                      {")"}
                                    </>
                                  )}
                              </span>
                            </td> :
                            <td className="align-middle py-2">
                              {selectedCurrency
                                ? convertINRToCurrency(
                                  layers?.balance,
                                  parseFloat(selectedCurrency?.value?.value)
                                )
                                : layers?.balance?.toFixed(2)}
                              <span
                                style={{
                                  fontSize: "12px",
                                  marginLeft: "10px",
                                  fontWeight: "normal",
                                }}
                              >
                                {layers?.currencyData?.value !== "1" &&
                                  adminData?.role < 1.9 && (
                                    <>
                                      {"("}
                                      {convertINRToCurrency(
                                        layers?.balance,
                                        layers?.currencyData?.value
                                      )}
                                      {")"}
                                    </>
                                  )}
                              </span>
                            </td>}

                          {/* {whiteLabelType === "B2C" && ((layers?.role === layerRoles?.USER) ?
                            <td className="align-middle py-1">
                              <span className="availale-balance">
                                {(
                                  layers?.bonus + layers?.totalBonusExposure
                                ).toFixed(2)}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "black",
                                  marginLeft: "10px",
                                }}
                              >
                                {layers?.currencyData?.value !== "1" &&
                                  adminData?.role < 1.9 && (
                                    <>
                                      {"("}
                                      {convertINRToCurrency(
                                        layers?.bonus + layers?.totalBonusExposure,
                                        layers?.currencyData?.value
                                      )}
                                      {")"}
                                    </>
                                  )}
                              </span>
                            </td> :
                            <td className="align-middle py-2">
                              {selectedCurrency
                                ? convertINRToCurrency(
                                  layers?.bonus,
                                  parseFloat(selectedCurrency?.value?.value)
                                )
                                : layers?.bonus?.toFixed(2)}
                              <span
                                style={{
                                  fontSize: "12px",
                                  marginLeft: "10px",
                                  fontWeight: "normal",
                                }}
                              >
                                {layers?.currencyData?.value !== "1" &&
                                  adminData?.role < 1.9 && (
                                    <>
                                      {"("}
                                      {convertINRToCurrency(
                                        layers?.bonus,
                                        layers?.currencyData?.value
                                      )}
                                      {")"}
                                    </>
                                  )}
                              </span>
                            </td>)} */}
                          {whiteLabelType === "B2C" &&
                            <td> {layers.mobileNo ?
                              String(layers.mobileNo).slice(-10) : "NA"}
                            </td>
                          }

                          {/* <td className="align-middle py-1">
                            {layers?.commission && layers.commission === 1
                              ? "ON"
                              : "OFF"}
                          </td> */}

                          {/* <td className="align-middle py-1">
                          <div className="d-flex align-items-center gap-1">
                            <button
                              disabled={
                                adminData?.role ===
                                ManagerRoles.MONITORING_MANAGER
                              }
                              className={`btn ${
                                layers?.balance +
                                  (layers?.clientBalance
                                    ? layers?.clientBalance
                                    : 0) -
                                  layers?.creditReference <
                                0
                                  ? "settlement-btn-2 border-danger"
                                  : layers?.balance +
                                      (layers?.clientBalance
                                        ? layers?.clientBalance
                                        : 0) -
                                      layers?.creditReference ===
                                    0
                                  ? "settlement-btn-0 disabled border-info"
                                  : "settlement-btn border-success"
                              }  px-3 py-2 border bg-light h-25 w-100`}
                              onClick={() =>
                                handleSettlementAmountModal(
                                  layers?.balance,
                                  layers?.mobileNo,
                                  layers?._id,
                                  layers?.username,
                                  layers?.balance +
                                    (layers?.clientBalance
                                      ? layers?.clientBalance
                                      : 0) -
                                    layers?.creditReference,
                                  layers?.currencyId?.value
                                )
                              }
                            >
                              <>
                                {selectedCurrency
                                  ? convertINRToCurrency(
                                      layers?.balance +
                                        (layers?.clientBalance
                                          ? layers?.clientBalance
                                          : 0) -
                                        layers?.creditReference,
                                      parseFloat(selectedCurrency?.value?.value)
                                    )
                                  : convertINRToCurrency(
                                      layers?.balance +
                                        (layers?.clientBalance
                                          ? layers?.clientBalance
                                          : 0) -
                                        layers?.creditReference,
                                      parseFloat(adminData?.currencyId?.value)
                                    )}
                              </>
                            </button>
                            <button
                              className="settlement-history-btn btn px-3 py-2 border border-success bg-light h-25"
                              onClick={() =>
                                handleSettlementHistoryModal(layers?._id)
                              }
                            >
                              H
                            </button>
                          </div>
                        </td> */}

                          {(Object.values(ManagerRoles)[3] !== adminData?.role) && <td className="align-middle py-1">
                            <div
                              className="d-flex justify-content-center"
                              onClick={() =>
                                handleTextCopy(layers?.passwordText)
                              }
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
                                {copied
                                  ? "copied"
                                  : layers?.passwordText
                                    ? layers?.passwordText
                                    : "****"}
                              </Tooltip>
                            </div>
                          </td>}


                          <td className="py-2 ">
                            <div className="d-flex btn-group">
                              {adminData?.role !==
                                ManagerRoles.MONITORING_MANAGER && (
                                  <>
                                    <Tooltip
                                      placement="top"
                                      isOpen={
                                        actionToolTip.id === layers?._id &&
                                        actionToolTip.val === "deposit"
                                      }
                                      target={`deposit`}
                                      toggle={() =>
                                        toggleActionTooltip(
                                          "deposit",
                                          layers?._id
                                        )
                                      }
                                    >
                                      {"Deposit"}
                                    </Tooltip>
                                    <button
                                      id="deposit"
                                      onClick={() =>
                                        handleDeposit(
                                          layers?.balance,
                                          layers?.name,
                                          layers?._id,
                                          layers?.totalExposure,
                                          layers?.currencyData?.value
                                        )
                                      }
                                      onMouseEnter={() =>
                                        toggleActionTooltip(
                                          "deposit",
                                          layers?._id
                                        )
                                      }
                                      onMouseLeave={() =>
                                        toggleActionTooltip(
                                          "deposit",
                                          layers?._id
                                        )
                                      }
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      D
                                    </button>

                                    <Tooltip
                                      isOpen={
                                        actionToolTip.id === layers?._id &&
                                        actionToolTip.val === "withdrawal"
                                      }
                                      target={"withdrawal"}
                                      toggle={() =>
                                        toggleActionTooltip(
                                          "withdrawal",
                                          layers?._id
                                        )
                                      }
                                    >
                                      {"Withdrawal"}
                                    </Tooltip>
                                    <button
                                      id="withdrawal"
                                      onClick={() =>
                                        handleWidrawal(
                                          layers?.balance,
                                          layers?.name,
                                          layers?._id,
                                          layers?.totalExposure,
                                          layers?.currencyData?.value
                                        )
                                      }
                                      onMouseEnter={() =>
                                        toggleActionTooltip(
                                          "withdrawal",
                                          layers?._id
                                        )
                                      }
                                      onMouseLeave={() =>
                                        toggleActionTooltip(
                                          "withdrawal",
                                          layers?._id
                                        )
                                      }
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      W
                                    </button>
                                  </>
                                )}

                              <Tooltip
                                placement="top"
                                isOpen={
                                  actionToolTip.id === layers?._id &&
                                  actionToolTip.val === "Reports"
                                }
                                target={`Reports`}
                                toggle={() =>
                                  toggleActionTooltip("Reports", layers?._id)
                                }
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
                                onMouseEnter={() =>
                                  toggleActionTooltip("Reports", layers?._id)
                                }
                                onMouseLeave={() =>
                                  toggleActionTooltip("Reports", layers?._id)
                                }
                              >
                                R
                              </button>

                              {adminData?.role !==
                                ManagerRoles.MONITORING_MANAGER && (
                                  <>
                                    <Tooltip
                                      placement="top"
                                      isOpen={
                                        actionToolTip.id === layers?._id &&
                                        actionToolTip.val === "password-change"
                                      }
                                      target={`password-change`}
                                      toggle={() =>
                                        toggleActionTooltip(
                                          "password-change",
                                          layers?._id
                                        )
                                      }
                                    >
                                      {"Password Change"}
                                    </Tooltip>
                                    <button
                                      id="password-change"
                                      onClick={() =>
                                        handleResetPassword(
                                          layers?.username,
                                          layers?._id
                                        )
                                      }
                                      onMouseEnter={() =>
                                        toggleActionTooltip(
                                          "password-change",
                                          layers?._id
                                        )
                                      }
                                      onMouseLeave={() =>
                                        toggleActionTooltip(
                                          "password-change",
                                          layers?._id
                                        )
                                      }
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      PC
                                    </button>
                                    <Tooltip
                                      placement="top"
                                      isOpen={
                                        actionToolTip.id === layers?._id &&
                                        actionToolTip.val === "permissions"
                                      }
                                      target={`permissions`}
                                      toggle={() =>
                                        toggleActionTooltip(
                                          "permissions",
                                          layers?._id
                                        )
                                      }
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
                                      onMouseEnter={() =>
                                        toggleActionTooltip(
                                          "permissions",
                                          layers?._id
                                        )
                                      }
                                      onMouseLeave={() =>
                                        toggleActionTooltip(
                                          "permissions",
                                          layers?._id
                                        )
                                      }
                                      className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                    >
                                      P
                                    </button>
                                    {adminData?.role === layerRoles.DIRECTOR ||
                                      Object.values(ManagerRoles).includes(
                                        adminData?.role
                                      ) ? (
                                      <>
                                        <Tooltip
                                          placement="top"
                                          isOpen={
                                            actionToolTip.id === layers?._id &&
                                            actionToolTip.val === "betfair"
                                          }
                                          target={`betfair`}
                                          toggle={() =>
                                            toggleActionTooltip(
                                              "betfair",
                                              layers?._id
                                            )
                                          }
                                        >
                                          {"Betfair Share"}
                                        </Tooltip>
                                        <button
                                          id="betfair"
                                          onClick={() =>
                                            handleBetfairShares(
                                              layers?.username,
                                              layers?._id,
                                              layers?.role,
                                              layers?.betFairShare,
                                              layers?.sportShares,
                                              index
                                            )
                                          }
                                          onMouseEnter={() =>
                                            toggleActionTooltip(
                                              "betfair",
                                              layers?._id
                                            )
                                          }
                                          onMouseLeave={() =>
                                            toggleActionTooltip(
                                              "betfair",
                                              layers?._id
                                            )
                                          }
                                          className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                        >
                                          BF
                                        </button>
                                      </>
                                    ) : null}
                                    {(layers?.role !== 7 &&
                                      layerRoles.DIRECTOR === adminData?.role) ||
                                      [Object.values(ManagerRoles)].includes(
                                        adminData?.role
                                      ) ? (
                                      <>
                                        <Tooltip
                                          placement="top"
                                          isOpen={
                                            actionToolTip.id === layers?._id &&
                                            actionToolTip.val === "clientshares"
                                          }
                                          target={`clientshares`}
                                          toggle={() =>
                                            toggleActionTooltip(
                                              "clientshares",
                                              layers?._id
                                            )
                                          }
                                        >
                                          {"Client Share"}
                                        </Tooltip>
                                        <button
                                          id="clientshares"
                                          onClick={() =>
                                            handleClientShares(
                                              layers?._id,
                                              layers?.username,
                                              layers?.sportShares
                                            )
                                          }
                                          onMouseEnter={() =>
                                            toggleActionTooltip(
                                              "clientshares",
                                              layers?._id
                                            )
                                          }
                                          onMouseLeave={() =>
                                            toggleActionTooltip(
                                              "clientshares",
                                              layers?._id
                                            )
                                          }
                                          className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                        >
                                          CS
                                        </button>
                                      </>
                                    ) : null}
                                    {[layerRoles.DIRECTOR, ManagerRoles.MANAGER]?.includes(adminData?.role)
                                      && (
                                        <>
                                          <Tooltip
                                            placement="top"
                                            isOpen={
                                              actionToolTip.id === layers?._id &&
                                              actionToolTip.val === "groupName"
                                            }
                                            target={`groupName`}
                                            toggle={() =>
                                              toggleActionTooltip(
                                                "groupName",
                                                layers?._id
                                              )
                                            }
                                          >
                                            {"Group Name"}
                                          </Tooltip>
                                          <button
                                            id="groupName"
                                            onClick={() =>
                                              handleGroupName(
                                                layers?._id,
                                                layers?.username,
                                                layers?.groupName
                                              )
                                            }
                                            onMouseEnter={() =>
                                              toggleActionTooltip(
                                                "groupName",
                                                layers?._id
                                              )
                                            }
                                            onMouseLeave={() =>
                                              toggleActionTooltip(
                                                "groupName",
                                                layers?._id
                                              )
                                            }
                                            className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                          >
                                            GN
                                          </button>
                                        </>
                                      )}
                                    {adminData?.role === layerRoles.DIRECTOR ||
                                      Object.values(ManagerRoles).includes(
                                        adminData?.role
                                      ) ? (
                                      <>
                                        <Tooltip
                                          placement="top"
                                          isOpen={
                                            actionToolTip.id === layers?._id &&
                                            actionToolTip.val ===
                                            "commissionPercentage"
                                          }
                                          target={`commissionPercentage`}
                                          toggle={() =>
                                            toggleActionTooltip(
                                              "commissionPercentage",
                                              layers?._id
                                            )
                                          }
                                        >
                                          {"Commission Percentage"}
                                        </Tooltip>
                                        <button
                                          id="commissionPercentage"
                                          onClick={() =>
                                            handleCommissionPercentage(
                                              layers?.username,
                                              layers?._id,
                                              layers?.role,
                                              layers?.betFairShare,
                                              layers?.commissionPercentage,
                                              index
                                            )
                                          }
                                          onMouseEnter={() =>
                                            toggleActionTooltip(
                                              "commissionPercentage",
                                              layers?._id
                                            )
                                          }
                                          onMouseLeave={() =>
                                            toggleActionTooltip(
                                              "commissionPercentage",
                                              layers?._id
                                            )
                                          }
                                          className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                        >
                                          CP
                                        </button>
                                      </>
                                    ) : null}
                                    {adminData?.role === layerRoles.DIRECTOR ||
                                      Object.values(ManagerRoles).includes(
                                        adminData?.role
                                      ) ? (
                                      <>
                                        <Tooltip
                                          placement="top"
                                          isOpen={
                                            actionToolTip.id === layers?._id &&
                                            actionToolTip.val === "authentication"
                                          }
                                          target={`authentication`}
                                          toggle={() =>
                                            toggleActionTooltip(
                                              "authentication",
                                              layers?._id
                                            )
                                          }
                                        >
                                          {"2F Status"}
                                          <br />
                                          Authentication Details
                                        </Tooltip>
                                        <button
                                          id="authentication"
                                          onClick={() =>
                                            getClientAuthenticationDetails(
                                              layers?._id
                                            )
                                          }
                                          onMouseEnter={() =>
                                            toggleActionTooltip(
                                              "authentication",
                                              layers?._id
                                            )
                                          }
                                          onMouseLeave={() =>
                                            toggleActionTooltip(
                                              "authentication",
                                              layers?._id
                                            )
                                          }
                                          className="px-2 py-1 credit-ref-btn btn border border-success bg-light"
                                        >
                                          O
                                        </button>
                                      </>
                                    ) : null}
                                  </>
                                )}

                              {/* {layers?.twoFactorAuthPassword ? ( */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                {/* </CardBody> */}
              </table>
              {loading === false && layerData?.data?.length === 0 && (
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
                // keyVal={currentPage}
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
          fetchDefaultLayers={
            inactive ? fetchInactiveLayers : fetchDefaultLayers
          }
          toggler={setdepositModal}
          modalData={modalData}
          setNewBalance={setNewBalance}
          deposit={true}
          size="md"
          setLayerData={setLayerData}
          currency={selectedCurrency}
          whiteLabelType={whiteLabelType === undefined ? "NONE" : whiteLabelType}
        />
      )}
      {withdrawalModal && (
        <DepositModal
          isOpen={withdrawalModal}
          title={t("WITHDRAWAL_OF")}
          fetchDefaultLayers={
            inactive ? fetchInactiveLayers : fetchDefaultLayers
          }
          toggler={setWithdrawalModal}
          modalData={modalData}
          setNewBalance={setNewBalance}
          deposit={false}
          size="md"
          setLayerData={setLayerData}
          currency={selectedCurrency}
          whiteLabelType={whiteLabelType === undefined ? "NONE" : whiteLabelType}
        />
      )}
      {sharesModal && (
        <ShareModal
          isOpen={sharesModal}
          title={t("SHARES")}
          toggler={setSharesModal}
          modalData={modalData}
          size="md"
        />
      )}
      {resetPasswordModal && (
        <ResetPasswordModal
          isOpen={resetPasswordModal}
          title={t("CHANGE_PASSWORD_OF")}
          toggler={setResetPasswordModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("NEW_PASSWORD")}
          fetchDefaultLayers={fetchDefaultLayers}
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
          updatePermissions={updatePermissions}
          fetchDefaultLayers={fetchDefaultLayers}
          fetchInactiveLayers={fetchInactiveLayers}
          size="md"
        />
      )}
      {settlementAmountModal && (
        <SettlementAmountModal
          isOpen={settlementAmountModal}
          fetchDefaultLayers={fetchDefaultLayers}
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
          currency={selectedCurrency}
        />
      )}

      {/* //For betfare share  */}
      {betfareshareModal && (
        <BetfairShareUpdateModal
          isOpen={betfareshareModal}
          title={t("BETFARE_SHARE_OF")}
          toggler={setBetfareshareModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("BETFARE_SHARE")}
          inactive={inactive}
          fetchDefaultLayers={fetchDefaultLayers}
          fetchInactiveLayers={fetchInactiveLayers}
        />
      )}
      {/* For client share */}

      {/* //For client share  */}
      {clientShareModal && (
        <ClientShareUpdateModal
          isOpen={clientShareModal}
          title={t("CLIENT_SHARE_OF")}
          toggler={setClientShareModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("CLIENT_SHARE")}
          inactive={inactive}
          fetchDefaultLayers={fetchDefaultLayers}
          fetchInactiveLayers={fetchInactiveLayers}
        />
      )}

      {/* //For group name  */}
      {groupNameModal && (
        <GroupNameUpdateModal
          isOpen={groupNameModal}
          title={t("GROUP_NAME_SHARE_OF")}
          toggler={setGroupNameModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("GROUP_NAME")}
          inactive={inactive}
          fetchDefaultLayers={fetchDefaultLayers}
          fetchInactiveLayers={fetchInactiveLayers}
        />
      )}

      {/* //For Commission Percentage  */}
      {commissionPercentageModal && (
        <CommissionPercentageModal
          isOpen={commissionPercentageModal}
          title={t("COMMISSION_PERCENTAGE_OF")}
          toggler={setCommissionPercentageModal}
          modalData={modalData}
          size="md"
          fieldTitle={t("COMMISSION_PERCENTAGE")}
          inactive={inactive}
          fetchDefaultLayers={fetchDefaultLayers}
          fetchInactiveLayers={fetchInactiveLayers}
        />
      )}

      {/* SHOW USER MODAL DETAILS AND ALL */}
      {showUserAuthenticationToggle && (
        <UserAuthenticationModal
          userData={clientAuthenticationData}
          toggler={setShowUserAuthenticationToggle}
          updatedLatest={fetchDefaultLayers}
        />
      )}


      {/* SHOW SETTLEMENT MODAL PREVIEW */}
      {showReviewGroupModal && (
        <ClientSettlementPreview
          data={usersGroupDetails}
          toggler={showReviewGroupModal}
          setShowReviewGroupModal={setShowReviewGroupModal}
        />
      )}

      {excelSheetDataPreview?.length > 0 && (
        <ExcelPreview
          data={excelSheetDataPreview}
          onBack={() => {
            setExcelSheetDataPreview([])
            setSelectedIdsClientSettlement([])
            setSelectAllUsers([]);
          }}
          groupName={'Preview'}
          convertToExcel={() => convertToExcelDynamicFunction(excelSheetTitle?.length > 0 ? excelSheetTitle : "Preview Sheet", excelSheetDataPreview, "Preview Title")}
          groupPreview={false}
        />
      )}

    </Fragment>
  );
};
export default ListUsers;
