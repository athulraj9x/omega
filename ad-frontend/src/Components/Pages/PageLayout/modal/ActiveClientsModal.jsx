import React, { useEffect, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { CardFooter, Modal } from "react-bootstrap";
import moment from "moment";
import { FiLogOut } from "react-icons/fi";
import { AiFillLock } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../../utils/helper";
import { ManagerRoles, PAGINATION } from "../../../../Constant";
import { getDashboardDataDetails } from "../../../../redux/action";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";

const ActiveClientsModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const adminData = useSelector((state) => state.Login.userData);
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);

  useEffect(()=>{
    dispatch(getDashboardDataDetails({
      type:"activeUsers",
      page:currentPage, 
      perPage:rowCount,
      callback: (data) => {
        setFilteredUsers(data?.data?.activeUsers)
        setTotalPages(data?.data?.totalPagesActiveUsers)
      }
    }));
  },[dispatch,currentPage,rowCount])

  const removeIDFromData = (id) => {
    setFilteredUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(item => item._id !== id);
      props?.setActiveClients(prev => ({
        ...prev, 
        total: updatedUsers?.length,
      }));
      return updatedUsers;
    });
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
 
  const logout = useCallback(async (id, username) => {

    await API.post("admin/logout-block", {
      id: id,
      action_type: "logout",
    })
      .then((response) => {
        if (response?.data?.meta?.code == 200) {
          notifySuccess(`${username}${" "}${response?.data?.meta?.message}`, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          removeIDFromData(id)
        } else {
          notifyWarning(response?.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      })
      .catch((error) => {
        notifyDanger("Inter Server Error", {
          position: error.POSITION.BOTTOM_CENTER,
        });
      });
  }, []);

  const logoutAndBlock = useCallback(async (id, username) => {
    await API.post("admin/logout-block", { id: id, action_type: "block" })
      .then((response) => {
        if (response?.data?.meta?.code == 200) {
          notifySuccess(`${username}${" "}${response?.data?.meta?.message}`, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          props?.setUserIds((prev) => [...prev, id]);
        } else {
          notifyWarning(response?.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      })
      .catch((error) => {
        notifyDanger("Inter Server Error", {
          position: error.POSITION.BOTTOM_CENTER,
        });
      });
  }, []);

  return (
    <Modal
      className=""
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${t("ACTIVE_CLIENT")}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={props.bodyClass} style={{ padding: "0px" }}>
        <div className="overflow-auto" style={{ height: "80vh" }}>
          <table className="table table-responsive table-bordered table-hover">
            <thead className="table-light bg-light">
              <tr>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("LAST_LOGGED_IN_TIME")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("USERNAME")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("BROWSER_IP_ADDRESS")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("SYSTEM_IP_ADDRESS")}
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-nowrap text-center"
                >
                  {t("LOGOUT")}
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-nowrap text-center"
                >
                  {t("BLOCK_AND_LOGOUT")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((data, index) => {
                return (
                  <tr key={index} className="align-middle text-white">
                    <td className="text-dark">
                      {data?.last_login === null ||
                      data?.last_login === undefined
                        ? "-"
                        : moment(
                            new Date(data?.last_login),
                            "ddd DD-MMM-YYYY, hh:mm A"
                          ).format("MMMM Do YYYY, h:mm:ss A")}
                    </td>
                    <td className="text-dark">{data?.username}</td>
                    <td className="text-dark">
                      {data?.ip_address?.browser_ip === null
                        ? "-"
                        : data?.ip_address?.browser_ip}
                    </td>
                    <td className="text-dark">
                      {data?.ip_address?.system_ip === null
                        ? "-"
                        : data?.ip_address?.system_ip}
                    </td>
                    <td
                      onClick={
                        adminData.role === ManagerRoles.MONITORING_MANAGER
                          ? null
                          : () => logout(data?._id, data?.username)
                      }
                      className="text-dark active-client-btn p-0"
                      style={{ fontSize: "2rem" }}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        <FiLogOut
                          className="bg-warning"
                          style={{
                            padding: "8px",
                            borderRadius: "50%",
                            cursor:
                              adminData.role === ManagerRoles.MONITORING_MANAGER
                                ? "not-allowed"
                                : "pointer",
                          }}
                        />
                      </span>
                    </td>
                    <td
                      onClick={
                        adminData.role === ManagerRoles.MONITORING_MANAGER
                          ? null
                          : () => logoutAndBlock(data?._id, data?.username)
                      }
                      className="text-dark active-client-btn p-0"
                      style={{ fontSize: "2rem" }}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        <AiFillLock
                          className="bg-danger"
                          style={{
                            padding: "8px",
                            cursor:
                              adminData.role === ManagerRoles.MONITORING_MANAGER
                                ? "not-allowed"
                                : "pointer",
                            borderRadius: "50%",
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ActiveClientsModal;
