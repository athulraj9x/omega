import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Tooltip,
} from "reactstrap";
import { Breadcrumbs, Btn } from "../../../../AbstractElements";
import { ManagerRoles, ManagerTypes, layerRoles } from "../../../../Constant";
import AccessibilityDropdown from "./AccessibilityDropdown";
import usePageTitle from "../../../../Hooks/usePageTitle";
import "../../../../assets/scss/pages/_customCheckBox.scss";
import "../../../../assets/scss/pages/settlement/modalBtn.scss";

import Loader from "../../../../Layout/Loader";

import { toast } from "react-toastify";
import "../../../../assets/scss/pages/resultTransaction.scss";
import { finduserParent, notifyWarning } from "../../../../utils/helper";
import { getLayersForManager, getManager } from "../../../../redux/action";
import ResetPasswordModal from "../modal/ResetPasswordModal";
import PermissionModal from "../modal/PermissionModal";

const ListManagers = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [actionToolTip, setActionToolTip] = useState({ id: "", val: "" });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [layers, setLayers] = useState([]);
  const [activeToggleIndex, setActiveToggleIndex] = useState(null); // 
  const [roleAccess, setRoleAccess] = useState(1); // 
  const [modalData, setModaldata] = useState({}); 
  const [dataUpdate, setDataUpdate] = useState([]);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  useEffect(() => {
    let role;
    if (title?.title === ManagerTypes.ACCOUNTS_MANAGER) {
      role = ManagerRoles.ACCOUNTS_MANAGER;
    } else if (title?.title === ManagerTypes.FANCY_MANAGER) {
      role = ManagerRoles.FANCY_MANAGER;
    } else if (title?.title === ManagerTypes.OPERATIONAL_MANAGER) {
      role = ManagerRoles.OPERATIONAL_MANAGER;
    } else if (title?.title === ManagerTypes.MANAGER) {
      role = ManagerRoles.MANAGER;
    } else {
      role = ManagerRoles.MONITORING_MANAGER;
    }
    setRoleAccess(role);
    init(role);
  }, [title?.title]);

  useEffect(() => {
    if(roleAccess === ManagerRoles.MONITORING_MANAGER){
      dispatch(
        getLayersForManager({
          callback: (res) => {
            let data = res?.data?.map((ele) => {
              return ({
                label: `${ele?.username}${"    "}#${ele?.role}`,
                value: ele?._id
              })
            })
            setLayers(data);
          },
        })
      );
    }
  }, []);

  const init = (role) => {
    dispatch(
      getManager({
        role,
        callback: (data) => {
          setManagerData(data?.data);
        },
      })
    );
  }

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

  const handleResetPassword = (username, userId) => {
    setModaldata({ username: username, userId: userId });
    setResetPasswordModal(true);
  };

  const updatePermissions = (newPermissions) => {
    const { ids, betAllow, status } = newPermissions;

  };

  const fetchDefaultLayers =()=>{
    init(roleAccess);
  }

  const handlePermission = (
    betAllow,
    status,
    username,
    userId,
    role,
    index
  ) => {
    setModaldata({ betAllow, status, username, userId, role, index });
    setPermissionModal(true);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("MANAGERS_LIST")}
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
          <CardBody className="p-0">
            <div className="overflow-auto" style={{ height: "62vh" }}>
              <table className="table table-bordered table-hover ">
                <thead
                  className="table-light bg-light sticky-top "
                  style={{ zIndex: 1 }}
                >
                  <tr className="text-left m-0" style={{ border: "none " }}>
                    <th className="align-middle">
                      <label className="input-border" style={{ margin: "0px" }}>
                        <input
                          // checked={selectAll}
                          // onChange={handleSelectAllChange}
                          className="text-nowrap align-center"
                          type="checkbox"
                        />
                        <div className="custom-checkmark"></div>
                      </label>
                    </th>
                    <th className="text-nowrap ">{t("USER_NAME_NAME")}</th>
                    <th className="text-nowrap ">{t("MOBILE")}</th>
                    {title?.title === ManagerTypes.MONITORING_MANAGER && (
                      <th className="text-nowrap ">{t("MANAGER_ACCESS")}</th>
                    )}
                    <th className="text-nowrap text-center">{t("PASSWORD")}</th>
                    <th className="text-nowrap text-center">{t("ACTION")}</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData?.map((layers, index) => {
                    return (
                      <tr className="text-left align-middle py-2" key={index}>
                        <td className="align-middle py-2">
                          <label
                            className="input-border"
                            style={{ margin: "0px" }}
                          >
                            <input
                              type="checkbox"
                            // checked={selectedIds.includes(layers._id)}
                            // onChange={() => handleCheckboxChange(layers._id)}
                            />
                            <div className="custom-checkmark"></div>
                          </label>
                        </td>
                        <td className=" py-2">
                          <div className="name align-items-center d-flex">
                            <span>
                              <badges
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f4f4f4",
                                  width: "35px",
                                  height: "18px",
                                  borderRadius: "5px",
                                  color: "#2f2f3b",
                                  padding: "0.25rem 0.4rem",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  textAlign: "center",
                                }}
                              >
                                {` ${layers.role === ManagerRoles?.ACCOUNTS_MANAGER
                                  ? "AC_M"
                                  : layers.role ===
                                    ManagerRoles?.OPERATIONAL_MANAGER
                                    ? "OP_M" : layers.role ===
                                    ManagerRoles?.FANCY_MANAGER ? "FY_M"
                                    : "MO_M"
                                  }`}
                              </badges>
                            </span>
                            {/* {layers?.totalShares ? layers?.totalShares : "0"} */}
                            <span className="ms-2 text-nowrap">
                              {layers?.username} ({layers?.name})
                            </span>
                          </div>
                        </td>

                        <td className="align-middle py-1">
                          <div className="d-flex flex-column">
                            <span>{layers?.mobile ? layers?.mobile : "_"}</span>
                          </div>
                        </td>
                        
                        {/* <td className="align-middle py-1">
                        {layers?.totalShares ? layers?.totalShares : "0"}
                      </td> */}
                        {title?.title === ManagerTypes.MONITORING_MANAGER && (
                        <td className="align-middle py-1">
                          <AccessibilityDropdown accessibilities={layers?.layer_accessbility_ids} managerId={layers?._id} isActive={activeToggleIndex === index} // Check if this dropdown is active
                            setActiveToggleIndex={() => setActiveToggleIndex(index)} // Set this dropdown as active
                            // getManagerCallback={init(roleAccess)}
                            getManagerCallback={() => init(roleAccess)}
                          />
                          {/* <ul>{layers?.layer_accessbility_ids?.map((access, index) => {
                            return (<li>{`${index}${"."} ${access?.username} ${"  "} #${access?.role}`}</li>)
                          })}</ul> */}
                        </td>           
                        )}
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
                              {copied
                                ? "copied"
                                : layers?.passwordText
                                  ? layers?.passwordText
                                  : "****"}
                            </Tooltip>
                          </div>
                        </td>

                        <td className="py-2 ">
                          <div className="d-flex btn-group">
                            
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* </CardBody> */}
              </table>
              {loading === false && managerData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
          {/* <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow
                rowCount={rowCount}
                setRowCount={setRowCount}
                keyVal={currentPage}
              />
              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </CardFooter> */}
        </Card>
      </Container>
      {permissionModal && (
        <PermissionModal
          isOpen={permissionModal}
          title={t("PERMISSIONS_OF")}
          toggler={setPermissionModal}
          modalData={modalData}
          setDataUpdate={setDataUpdate}
          updatePermissions={updatePermissions}
          fetchDefaultLayers={fetchDefaultLayers}
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
    </Fragment>
  );
};

export default ListManagers;
