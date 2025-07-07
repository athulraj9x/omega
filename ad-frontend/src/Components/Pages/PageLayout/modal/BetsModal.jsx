import React from "react";
import { Modal, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BetStatus, layerRoles } from "../../../../Constant";
import { convertINRToCurrency, findBetPl } from "../../../../utils/helper";
import { useSelector } from "react-redux";
const BetsModal = (props) => {
  const { t } = useTranslation();

  const adminData = useSelector((state) => state.Login.userData);

  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${props.title}  ${props?.modalData?.username}`}</Modal.Title>
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
                  {t("Transaction ID")}
                </th>
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
                  {t("odds")} ({t("ODD_SIZE")})
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("stake")}
                </th>
                {/* <th scope="col" className="text-uppercase text-dark">
                  {"Profit"}
                </th>
                <th scope="col" className="text-uppercase text-dark">
                  {"Loss"}
                </th> */}
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
                    // let pl = findBetPl(
                    //   data?.marketType,
                    //   data?.selectionType,
                    //   data?.odds,
                    //   data?.stake,
                    //   data?.oddsSize
                    // );

                    return (
                      <tr
                        className={`${
                          // data?.selectionType === "back"
                          //   ? "table-primary"
                          //   : "table-danger"
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
                        style={{
                          ...(data?.status !== BetStatus.OPEN
                            ? {
                                opacity: 0.5,
                              }
                            : ""),
                        }}
                        key={index}
                      >
                        <td className="table-text  text-start">
                        {data.betFairId? data?.betFairId : "NA"}
                        </td>
                        <td className="table-text  text-start">
                          {`${data?.userId?.username}${
                            props?.modalData?.parent
                              ? ` (${props?.modalData?.parent})`
                              : ""
                          }`}
                        </td>
                        <td className="table-text  text-start">
                          {data?.selection}
                        </td>
                        <td className="table-text-blue  text-start">{`${
                          data?.odds
                        }${data?.oddsSize ? `(${data?.oddsSize})` : ""}`}</td>
                        {adminData?.role === layerRoles?.WHITE_LABEL ? 

                        <td className="table-text  text-start">
                          {data?.stake}
                          {` (${convertINRToCurrency(data?.stake,parseFloat(data?.currency?.value))})`}
                        </td> : 

                        <td className="table-text  text-start">
                        {props?.currency
                          ? convertINRToCurrency(
                              data?.stake,
                              parseFloat(props?.currency?.value?.value)
                            )
                        : data?.stake 
                        }
                      </td>}

                        <td className="table-text-blue  text-start">
                          {data?.userId?.ip_address?.system_ip
                            ? data?.userId?.ip_address?.system_ip
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
                              : data?.status === BetStatus.UNMATCH
                              ? "Unmatch"
                              : "void"
                            : "-"}
                        </td>
                        <td className="table-text  text-start">
                          {new Date(data?.createdAt).toLocaleString()}
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

export default BetsModal;
