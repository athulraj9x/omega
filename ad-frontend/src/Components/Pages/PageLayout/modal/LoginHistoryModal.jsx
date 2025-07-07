import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import VoidInvalidModal from "./VoidInvalidModal";

const LoginHistoryModal = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={props.toggler}
        centered
        size={props.size}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`${props.title}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={props.bodyClass} style={{ padding: 0 + "px" }}>
          <div className="overflow-auto" style={{ height: "75vh" }}>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-uppercase text-center">
                    {t("LAST_LOGGED_IN_TIME")}
                  </th>
                  <th scope="col" className="text-uppercase text-center">
                    {t("BROWSER_IP_ADDRESS")}
                  </th>
                  <th scope="col" className="text-uppercase text-center">
                    {t("SYSTEM_IP_ADDRESS")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {props?.modalData?.map((data, index) => {
                  return (
                    <tr className={`align-middle text-white`} key={index}>
                      <td className="text-dark text-center">
                        {data?.last_login === null ||
                        data?.last_login === undefined
                          ? "-"
                          : moment(
                              new Date(data?.last_login),
                              "ddd DD-MMM-YYYY, hh:mm A"
                            ).format("MMMM Do YYYY, h:mm:ss A")}
                      </td>
                      <td className="text-dark text-center">
                        {data?.ip_address?.browser_ip === null
                          ? "-"
                          : data?.ip_address?.browser_ip}
                      </td>
                      <td className="text-dark text-center">
                        {data?.ip_address?.system_ip === null
                          ? "-"
                          : data?.ip_address?.system_ip}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {props?.modalData?.length === 0 && (
              <div className="d-flex justify-content-center">
                <p className="p-3">{t("NO_LOGIN_HISTORY_AVAILABLE")}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginHistoryModal;
