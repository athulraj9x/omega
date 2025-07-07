import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import { CardFooter } from "reactstrap";
import { layerRoles, ManagerRoles, PAGINATION } from "../../../../Constant";
import { getCasinoTransation } from "../../../../redux/action";
import { convertINRToCurrency } from "../../../../utils/helper";
import { useSelector } from "react-redux";

const ProfitLossCasinoModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowCount, setRowCount] = useState(PAGINATION?.perPage);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  const [totalCount, setTotalCount] = useState(0);
  const [casinoBets, setCasinoBets] = useState([]);
  const adminData = useSelector((state) => state?.Login.userData);
  useEffect(() => {
    init();
  }, [currentPage, rowCount]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const init = () => {
    dispatch(
      getCasinoTransation({
        userId: props?.modalData?.userId,
        description: props?.modalData?.desc,
        casino_type: props?.modalData?.casino_type,
        page: currentPage,
        perPage: rowCount,
        callback: (data) => {
          setTotalPages(data?.meta?.totalPage);
          setTotalCount(data?.meta?.count);
          setCasinoBets(data?.data);
        },
      })
    );
  }

  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      centered
      size={props.size}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${props.title}  ${props?.modalData?.username}(${totalCount})`}</Modal.Title>
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
                  RoundId
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  Selection
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("stake")}
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
                  {"Loss"}
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("date")}
                </th>
                <th
                  scope="col"
                  className="text-nowrap text-uppercase text-dark"
                >
                  {t("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {casinoBets?.length <= 0 ? (
                <>
                  <tr className="text-center">
                    <td colSpan={7} className="py-4">
                      {t("NO_DATA_AVAILABLE")}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {casinoBets?.map((data, index) => {
                    let roleAccess = props?.selectedCurrency === 'user' && adminData?.role === layerRoles.DIRECTOR ||
                      Object.values(ManagerRoles).includes(adminData?.role);
                    return (
                      <tr
                        className={`${data?.selectionType === "back"
                          ? "table-primary"
                          : "table-danger"
                          } `}
                        key={index}
                      >
                        <td className="table-text  text-start">
                          {data?.roundId}
                        </td>
                        <td className="table-text-blue  text-start">
                          {data?.gameCode}
                        </td>
                        <td className="table-text  text-start">
                          {roleAccess ? convertINRToCurrency(data?.stake, props?.currency?.value) : data?.stake?.toFixed(2)}
                          {/* {data?.stake} */}
                        </td>
                        <td className="table-text  text-start">
                          {" "}
                          {parseInt(data?.pl) === parseInt(data?.stake) ? roleAccess ? convertINRToCurrency(data?.pl, props?.currency?.value) : data?.pl : data?.pl > data?.stake ? data?.pl > 0 ? roleAccess ?
                            convertINRToCurrency(data?.pl - data?.stake, props?.currency?.value) :
                            data?.pl - data?.stake : "_" : data?.pl > 0 ? "_" : "_"}
                          {/* {data?.pl > data?.stake ? data?.pl > 0 ? roleAccess ?
                            convertINRToCurrency(data?.pl - data?.stake, props?.currency?.value) :
                            data?.pl - data?.stake : "_" : data?.pl > 0 ? "_" : "_"} */}
                          {/* {data?.pl > data?.stake ? data?.pl > 0 ? data?.pl - data?.stake : "_" : data?.pl > 0 ? data?.stake - data?.pl : "_"} */}
                          {/* {data?.pl > data?.stake ? data?.pl > 0 ? data?.pl - data?.stake : "_" : data?.pl > 0 ? "_" : "_"} */}
                          {/* {data?.pl > 0 ? data?.pl - data?.stake : "_"} */}
                        </td>
                        <td className="table-text  text-start">
                          {" "}
                          {data?.pl <= 0 ? roleAccess ?
                            convertINRToCurrency(data?.stake, props?.currency?.value) :
                            data?.stake : data?.pl < data?.stake ? roleAccess ?
                              convertINRToCurrency(((data?.stake - data?.pl)), props?.currency?.value) :
                              ((data?.stake - data?.pl)) : "_"}
                          {/* {data?.pl < 0 ? data?.stake : data?.pl < data?.stake ? ((data?.stake - data?.pl)) : "_"} */}
                          {/* {data?.pl < 0 ? data?.stake : "_"} */}
                        </td>
                        <td className="table-text  text-start">
                          {new Date(data?.updatedAt)?.toLocaleString()}
                        </td>
                        <td className="table-text-blue text-center">
                          {"settled"}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
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

export default ProfitLossCasinoModal;
