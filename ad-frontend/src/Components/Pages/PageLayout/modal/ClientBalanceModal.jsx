import React, { useEffect, useState } from "react";
import { Modal, Button, Table, CardFooter } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi";
import { AiFillLock } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import { useSelector } from "react-redux";
import { layerRoles , ManagerRoles, PAGINATION } from "../../../../Constant";
import { getDashboardDataDetails } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";


const ClientBalanceModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState([])
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  

  useEffect(()=>{
    dispatch(getDashboardDataDetails({
      type:"clientWithBalance",
      page:currentPage, 
      perPage:rowCount,
      callback: (data) => {
        setDashboardData(data?.data?.clientWithBalance)
        setTotalPages(data?.data?.totalPagesClientWithBalance)
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
        <Modal.Title>{`${t("Client Balance")}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={props.bodyClass} style={{ padding: "10px" }}>
        <div className="overflow-auto" style={{ height: "50vh" }}>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                {/* <th scope="col" className="text-uppercase text-nowrap">
                  {t("CREATED AT")}
                </th> */}
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("USERNAME")}
                </th>
                <th scope="col" className="text-uppercase text-nowrap">
                  {t("BALANCE")}
                </th>
               
              </tr>
            </thead>
            <tbody>
              {dashboardData?.map((data, index) => {
                return (
                  <>
                    <tr
                      key={index}
                    >
                      {/* <td className="fw-semibold text-dark">
                        {new Date(data?.createdAt)?.toLocaleString()}
                      </td> */}
                      <td className="fw-semibold text-dark">
                        {data?.name}
                      </td>
                      <td className="fw-semibold text-dark">
                        {data?.balance} {data?.inrAmount ? `(${data.inrAmount})` : ""}
                      </td>

                     
                      
                    </tr>
                  </>
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

export default ClientBalanceModal;
