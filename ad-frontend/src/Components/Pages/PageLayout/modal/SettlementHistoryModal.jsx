import React, { Fragment, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSettlement } from "../../../../redux/action";

const SettlementHistoryModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [settlementData, setSettlementData] = useState([]);

  useEffect(() => {
    dispatch(
      getSettlement({
        userId: props?.modalData?.userId,
        callback: (data) => {
          setSettlementData(data.data);
        },
      })
    );
  }, []);

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={props.toggler}
        centered
        size={props.size}
        className=""
      >
        <Modal.Header
          closeButton
          className="px-1 text-dark"
          color="light dark"
        >
          <Modal.Title className="fs-6 ">
            {props.title}
            {/* <span className="text-primary">{props?.modalData?.username}</span> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0px' }}
          className={`${props.bodyClass}  custom-modal-body`}
        >
          <div className="overflow-auto" style={{ height: "80vh" }}>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-uppercase">
                    {t("DATE")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("DESCRIPTION")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("CREDIT")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("DEBIT")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  settlementData?.length <= 0 ? (
                    <>
                      <tr className="text-center">
                        <td colSpan={7} className="py-4">{t("NO_DATA_AVAILABLE")}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {settlementData?.map((data, index) => {
                        return (
                          <Fragment key={index}>
                            <tr >
                              <td className="table-text-blue text-dark">
                                <span>
                                  {new Date(data?.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="text-dark">{data?.description}</td>
                              <td className="table-text-blue text-dark">
                                {data?.transaction_type === "deposit"
                                  ? (data?.amount)?.toLocaleString("en-us")
                                  : ""}
                              </td>
                              <td className="text-dark">
                                {data?.transaction_type === "withdrawl"
                                  ? (data?.amount)?.toLocaleString("en-us")
                                  : ""}
                              </td>
                            </tr>
                          </Fragment>
                        );
                      })}
                    </>
                  )
                }
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SettlementHistoryModal;
