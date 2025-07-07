import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Col, CardFooter } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi";
import { AiFillLock } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles, PAGINATION } from "../../../../Constant";
import { Row } from "reactstrap";
import { getDashboardDataDetails } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";

const TotalPlModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState([])
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  

  useEffect(()=>{
    dispatch(getDashboardDataDetails({
      type:"totalPlData",
      page:currentPage, 
      perPage:rowCount,
      callback: (data) => {
        setDashboardData(data?.data?.totalPlData)
        setTotalPages(data?.data?.totalPagesTotalPlData)
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
        <Modal.Title className="p-1 pb-0">{`${t("TOTAL PL")}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={props.bodyClass} style={{ padding: "5px" }}>
        <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
          <div
            className="d-flex flex-row justify-content-between position-sticky top-0 p-3"
            style={{ backgroundColor: "rgba(1,1,1,1)" }}
          >
            <div className="mb-1">
              <span className="rounded p-3 bolder text-white ">
                My Balance :{" "}
                <strong>
                  {dashboardData[dashboardData?.length - 1]?.myBalance}
                </strong>
              </span>
            </div>
            <div className="mb-1">
              <span className="rounded p-3 text-white">
                Credit Reference :{" "}
                <strong>
                  {dashboardData[dashboardData?.length - 1]?.myCreditReference}
                </strong>
              </span>
            </div>
          </div>

          <div className="table-responsive  ">
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-light border">
                <tr>
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("USERNAME")}
                  </th>
                  <th scope="col" className="text-uppercase text-nowrap">
                    {t("USER PL")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.map((data, index) => (
                  <tr key={index}>
                    <td className="fw-semibold text-dark">{data?.username}</td>
                    <td className="fw-semibold text-dark">{data?.clientPl}</td>
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

export default TotalPlModal;
