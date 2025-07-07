import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ViewMarketBetsModal = ({ modaldata, isOpen, toggler, size }) => {
  const { t } = useTranslation();
  console.log(modaldata, "modalData");

  return (
    <Modal show={isOpen} onHide={toggler} centered size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{`Bets by ${modaldata?.userId?.username} on ${modaldata?.description}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-0`}>
        <div className="overflow-scroll">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr
                style={{
                  position: "sticky",
                  top: -1,
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              >
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("USER")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("SELECTION")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("TYPE")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("ODD_SIZE")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("STAKE")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("PL")}
                </th>
                {/* {adminData?.role === layerRoles.DIRECTOR ||
                Object.values(ManagerRoles).includes(adminData?.role) ? (
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("BETFAIR_SHARE(%)")}
                  </th>
                ) : null}
                {adminData?.role === layerRoles.DIRECTOR ||
                Object.values(ManagerRoles).includes(adminData?.role) ? (
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("BETFAIR STAKE")}
                  </th>
                ) : null} */}

                <th scope="col" className="text-uppercase text-nowrap">
                  {t("TransactionId")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("DATE")}
                </th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {modaldata.individualBetsOfTheTransaction?.length &&
                modaldata.individualBetsOfTheTransaction?.map((data, index) => {
                  return (
                    <tr
                      key={index}
                      className={` align-middle ${
                        data?.bettingType === "LINE"
                          ? data?.selectionType === "back"
                            ? "table-danger"
                            : data?.selectionType === "lay"
                            ? "table-primary"
                            : "table-danger"
                          : data?.selectionType === "back"
                          ? "table-primary"
                          : "table-danger"
                      } `}
                    >
                      <td className="fw-semibold text-dark">
                        {modaldata?.userId?.username}
                        {`(${modaldata?.userId?.parents[modaldata?.userId?.parents?.length - 1].parent_id.username})`}
                        {` [${data?.currency?.code}]`}
                      </td>

                      <td className="fw-semibold text-dark">{data?.selection}</td>
                      <td className="fw-semibold text-dark">
                        {data.bettingType == "LINE"
                          ? data.selectionType === "back"
                            ? "lay"
                            : "back"
                          : data.selectionType}
                        {/* {data?.selectionType} */}
                      </td>
                      <td className="fw-semibold text-dark">
                        {data?.odds}{" "}
                        {data?.oddsSize != null && !/line/i.test(data?.selection) ? `[${data?.oddsSize}]` : ""}
                      </td>
                      <td className="fw-semibold text-dark">{data.stakeInINR}</td>
                      <td className="fw-semibold text-dark">{data.plInINR}</td>

                      <td className="fw-semibold text-dark">
                        {data.marketType === "fancy" || data.marketType === "bookmaker" ? "NA" : data?.betFairId}
                      </td>
                      <td className="fw-semibold text-dark">{new Date(data?.createdAt)?.toLocaleString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewMarketBetsModal;
