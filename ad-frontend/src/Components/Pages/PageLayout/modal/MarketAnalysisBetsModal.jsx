import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BetStatus } from "../../../../Constant";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import "jspdf-autotable";
import { convertINRToCurrency } from "../../../../utils/helper";

const MarketAnalysisBetsModal = (props) => {
  const { t } = useTranslation();
  const adminData = useSelector((state) => state?.Login.userData);

  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${props.title}  ${props?.modalData?.bets[0].description}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-0 ${props.bodyClass}`}>
        <div className="overflow-scroll">
          <table className="table table-bordered">
            <thead>
              <tr className="">
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("User")}
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("selection")}
                </th>

                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {"Profit"}
                </th>

                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("ip")}
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("status")}
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {props?.modalData?.bets?.length <= 0 ? (
                <>
                  <tr className="text-center">
                    <td colSpan={7} className="py-4">
                      {t("NO_DATA_AVAILABLE")}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {props?.modalData?.bets?.map((data, index) => {
                    return (
                      <tr
                        className={`${data?.selectionType === "back"
                          ? "table-primary"
                          : "table-danger"
                          } `}
                        key={index}
                      >
                        <td className="table-text  text-start">
                          {`${data?.userId?.username}${props?.modalData?.parent
                            ? ` (${props?.modalData?.parent})`
                            : ""
                            }`}
                        </td>
                        <td className="table-text  text-start">
                          {data?.type}
                        </td>


                        <td className="table-text  text-start">
                          { data?.pl.toFixed(2)}
                          {/* {
                            data?.pl < 0 ? (props?.selectedCurrency === 'user' &&
                              (adminData?.role === layerRoles.DIRECTOR ||
                                Object.values(ManagerRoles).includes(adminData?.role))) ?
                              convertINRToCurrency(data?.pl, props?.currency?.value) :
                              data?.pl?.toFixed(2)
                              :
                              data?.pl
                          } */}
                        </td>


                        <td className="table-text-blue  text-start">
                          {data?.userId?.ip_address?.system_ip
                            ? (data?.userId?.ip_address?.system_ip)?.slice(0, 12)
                            : "-"}
                        </td>

                        <td className="table-text-blue  text-start">
                          {data?.status
                            ? data?.status === BetStatus.OPEN
                              ? "open"
                              : data?.status === BetStatus.SETTETLED
                                ? "settled"
                                : data?.status === BetStatus.DELETE
                                  ? "deleted"
                                  : data?.status === BetStatus.INVALID
                                    ? "invalid"
                                    : "void"
                            : "-"}
                        </td>

                        <td className="table-text  text-start">
                          {new Date(data?.createdAt)?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MarketAnalysisBetsModal;
