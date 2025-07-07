import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const ExcelPreview = ({
  data,
  onBack,
  groupName,
  convertToExcel,
  groupPreview,
}) => {
  const { t } = useTranslation();
  const headerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const randomNumber = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

  const totalSettlementPoints = data
    ?.reduce((sum, row) => sum + (row.settlement_point || 0), 0)
    .toFixed(2);
  const totalSettlementAmount = data
    ?.reduce((sum, row) => sum + (row.settlement_amount || 0), 0)
    .toFixed(2);

  setTimeout(() => {
    setLoading(false);
  }, randomNumber);

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      if (header) {
        if (window.scrollY > header.offsetTop) {
          header.classList.add("fixed-top");
        } else {
          header.classList.remove("fixed-top");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="container mt-5">
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)", // Apply blur effect
          zIndex: 1040,
        }}
        className="modal fade show d-block"
      >
        {loading ? (
          <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="spinner-grow text-primary" role="status">
              <span class="visually-hidden">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div className="modal-content navbar-header" ref={headerRef}>
                <>
                <div className="modal-header ">
                  <h5 className="modal-title">
                    {groupPreview
                      ? `Group - ${groupName}`
                      : "Selected Users Preview"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onBack}
                  ></button>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    onClick={onBack}
                    className="btn btn-outline-danger m-3 mt-0"
                  >
                    {groupPreview ? "Back to Preview" : "Back to Home"}
                  </button>

                  <button
                    onClick={() => convertToExcel(groupName, data)}
                    className="btn btn-outline-success m-3 mt-0"
                  >
                    Excel
                  </button>
                </div>
              </>

              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Exchange</th>
                      <th>Name</th>
                      {/* <th>Date</th> */}
                      <th>Credit Points</th>
                      <th>Available Points</th>
                      <th>Settlement Points</th>
                      <th>INR Settlement Points</th>
                      <th>Rate</th>
                      <th>Settlement Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((row, index) => (
                      <tr key={index}>
                        <td>{row?.sl_no}</td>
                        <td>{row?.exchange}</td>
                        <td>{row?.name}</td>
                        {/* <td>{new Date(row?.date).toLocaleString()}</td> */}
                        <td>{row?.credit_point.toLocaleString()}</td>
                        <td>{row?.available_point.toLocaleString()}</td>
                        {/* <td>{row?.settlement_point?.toFixed(2)}</td> */}
                        <td>{row?.pl_on_currency?.toFixed(2)}</td>
                        <td>{row?.inr_settlement_point?.toFixed(2)}</td>
                        <td>{row?.rate?.toFixed(2)}</td>
                        <td>{row?.settlement_amount?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td colSpan="6" className="text-end">
                        <strong>Totals:</strong>
                      </td>
                      <td>
                        <strong>{totalSettlementPoints}</strong>
                      </td>
                      {/* <td></td> */}
                      {/* <td></td> */}
                      <td>
                        <strong>{totalSettlementAmount}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
