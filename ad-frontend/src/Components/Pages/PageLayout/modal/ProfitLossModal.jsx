import React from "react";
import { Modal, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BetStatus } from "../../../../Constant";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import { convertINRToCurrency } from "../../../../utils/helper";
const ProfitLossModal = (props) => {
  const { t } = useTranslation();
  const adminData = useSelector((state) => state?.Login.userData);
  const getFormattedDate = (date) => (date ? new Date(date).toLocaleString().split(",")[0] : "");
  const pdfGenerator = () => {
    try {
      const isAdmin = adminData?.role === layerRoles.DIRECTOR || Object.values(ManagerRoles).includes(adminData?.role);
      const doc = new jsPDF();
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(12);
      doc.text(
        decodeURIComponent(`${props.title}  ${props?.modalData?.username}`).toUpperCase(),
        doc.internal.pageSize.width / 2,
        10,
        null,
        null,
        "center"
      );
      const head = [
        "User",
        "Selection",
        "ODDS",
        "Stake",
        "Profit",
        "Loss",
        // "Commission",
        "Status",
        "Date",
      ];

      const body = props?.modalData?.bets?.map((row) => {
        const status = row?.status
          ? row?.status === BetStatus.OPEN
            ? "open"
            : row?.status === BetStatus.SETTETLED
            ? "settled"
            : row?.status === BetStatus.DELETE
            ? "deleted"
            : row?.status === BetStatus.INVALID
            ? "invalid"
            : "void"
          : "-";
        const data = [
          `${props?.modalData?.username} (${props?.modalData?.parent})`,
          row?.selection,
          row?.odds?.toFixed(2),
          row?.stake?.toFixed(2),
          row?.pl > 0 ? row?.pl?.toFixed(2) : "0",
          row?.pl < 0 ? row?.pl?.toFixed(2) : "0",
          row?.commission ? row.commission?.toFixed(2) : "0",
          status,
          getFormattedDate(row?.createdAt),
        ];

        return [...data];
      });
      doc.autoTable({
        head: [head],
        body: body,
        didDrawCell: function (data) {
          const cell = data.cell;
          const row = data.row.index;
          if (row % 2 === 0) {
            cell.styles.fillColor = "#f2f2f2";
          } else {
            cell.styles.fillColor = "#ffffff";
          }
          if (row === 0) {
            cell.styles.textColor = [255, 255, 255];
          }
          cell.styles.lineWidth = 0.1;
          cell.styles.lineColor = [0, 0, 0];
        },
      });

      doc.save("modal");
    } catch (err) {}
  };
  const excelGenerator = () => {
    try {
      const data = props?.modalData?.bets.map((row) => {
        const status = row?.status
          ? row?.status === BetStatus.OPEN
            ? "open"
            : row?.status === BetStatus.SETTETLED
            ? "settled"
            : row?.status === BetStatus.DELETE
            ? "deleted"
            : row?.status === BetStatus.INVALID
            ? "invalid"
            : "void"
          : "-";
        return {
          username:
            props?.modalData?.username !== undefined
              ? `${props?.modalData?.username} (${props?.modalData?.parent})`
              : null,
          selection: row?.selection,
          odds: row?.odds?.toFixed(2),
          stake: row?.stake?.toFixed(2),
          profit: row?.pl > 0 ? row?.pl?.toFixed(2) : "0",
          loss: row?.pl < 0 ? row?.pl?.toFixed(2) : "0",
          commission: row?.commission?.toFixed(2) ? row.commission : "0",
          status,
          Date: getFormattedDate(row?.createdAt),
        };
      });

      if (data && data?.length > 0) {
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, `${props.title}  ${props?.modalData?.username}`);
        writeFile(wb, decodeURIComponent(`${props.title}  ${props?.modalData?.username}`).replace(/\+/g) + ".xlsx");
      }
    } catch (err) {
      //console.error(err);
    }
  };

  return (
    <Modal show={props.isOpen} onHide={props.toggler} centered size={props.size}>
      <Modal.Header closeButton>
        <Modal.Title>{`${props.title}  ${props?.modalData?.username}`}</Modal.Title>
        <div className="d-flex">
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
            onClick={pdfGenerator}
          >
            PDF
          </button>
          <button
            className="btn btn-outline-success d-flex align-items-center gap-1 justify-content-center mx-2 relative"
            onClick={excelGenerator}
          >
            Excel
          </button>
        </div>
      </Modal.Header>
      <Modal.Body className={`p-0 ${props.bodyClass}`}>
        <div className="overflow-scroll">
          <table className="table table-bordered">
            <thead>
              <tr className="">
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("User")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("selection")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("ODD_SIZE")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("stake")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {"Profit"}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {"Loss"}
                </th>

                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("ip")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
                  {t("status")}
                </th>
                <th scope="col" className="text-nowrap text-uppercase text-dark">
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
                        className={`${
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
                        key={index}
                      >
                        <td className="table-text  text-start">
                          {`${data?.userId?.username}${
                            props?.modalData?.parent ? ` (${props?.modalData?.parent})` : ""
                          }`}
                        </td>
                        <td className="table-text  text-start">{data?.selection}</td>

                        <td className="table-text-blue text-start">
                          {`${/Line$/.test(data?.selection) ? Math.ceil(data?.odds) : data?.odds}${
                            data?.oddsSize ? `(${data?.oddsSize})` : ""
                          }`}
                        </td>

                        <td className="table-text  text-start">
                          {(props?.selectedCurrency === "user" && adminData?.role === layerRoles.DIRECTOR) ||
                          Object.values(ManagerRoles).includes(adminData?.role)
                            ? convertINRToCurrency(data?.stake, props?.currency?.value)
                            : data?.stake?.toFixed(2)}
                        </td>
                        <td className="table-text  text-start">
                          {data?.pl > 0
                            ? props?.selectedCurrency === "user" &&
                              (adminData?.role === layerRoles.DIRECTOR ||
                                Object.values(ManagerRoles).includes(adminData?.role))
                              ? convertINRToCurrency(data?.pl, props?.currency?.value)
                              : data?.pl?.toFixed(2)
                            : 0}
                        </td>
                        <td className="table-text  text-start">
                          {/* {data?.pl < 0 ? data?.pl.toFixed(2) : 0} */}
                          {data?.pl < 0
                            ? props?.selectedCurrency === "user" &&
                              (adminData?.role === layerRoles.DIRECTOR ||
                                Object.values(ManagerRoles).includes(adminData?.role))
                              ? convertINRToCurrency(data?.pl, props?.currency?.value)
                              : data?.pl?.toFixed(2)
                            : 0}
                        </td>

                        <td className="table-text-blue  text-start">
                          {data?.userId?.ip_address?.system_ip ? data?.userId?.ip_address?.system_ip : "-"}
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
                        <td className="table-text  text-start">{new Date(data?.createdAt)?.toLocaleString()}</td>
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

export default ProfitLossModal;
