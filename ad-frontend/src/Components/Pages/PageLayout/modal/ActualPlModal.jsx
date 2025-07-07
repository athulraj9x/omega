import React, { useEffect, useState } from "react";
import { CardFooter, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getDashboardDataDetails } from "../../../../redux/action";
import { PAGINATION } from "../../../../Constant";
import { useDispatch } from "react-redux";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";

const ActualPlModal = (props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState([])
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  

  useEffect(()=>{
    dispatch(getDashboardDataDetails({
      type:"totalActualPlData",
      page:currentPage, 
      perPage:rowCount,
      callback: (data) => {
        setDashboardData(data?.data?.totalActualPlData)
        
        setTotalPages(data?.data?.totalPagesTotalActualPlData)
      }
    }));
  },[dispatch,currentPage,rowCount])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Modal
      className=""
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title className="p-1 pb-0">{`${t("ACTUAL_PL")}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={props.bodyClass} style={{ padding: "5px" }}>
        <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
          <div className="table-responsive  ">
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-light border">
                <tr>
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("SELECTION")}
                  </th>
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("USER PL")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.map((data, index) => (
                  <tr
                    key={index}
                    // className={`${
                    //   data?.selectionType === "back"
                    //     ? "table-primary"
                    //     : "table-danger"
                    // }`}

                    className={`${
                      data?.bettingType === "LINE"
                        ? data?.selectionType === "back"
                          ? "table-danger"
                          : "table-primary"
                        : data?.selectionType === "back"
                        ? "table-primary"
                        : "table-danger"
                    }`}
                  >
                    <td className="fw-semibold text-dark">{data?.selection}</td>
                    <td className="fw-semibold text-dark">
                      {data?.convertedStake !== undefined ? (
                        <>
                          {Math.round(-data?.convertedStake)?.toFixed(2)} {" "} 
                          ({Math.round(-data?.pl)?.toFixed(2)}) 
                        </>
                      ) : (
                        Math.round(-data?.pl)?.toFixed(2)
                      )}
                    </td>
                  </tr>
                ))}
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ActualPlModal;
