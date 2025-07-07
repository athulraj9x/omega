import React, { useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import { useSelector, useDispatch } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import VoidInvalidModal from "../modal/VoidInvalidModal";
import { getLiveExposureData } from "../../../../redux/action";
import { socket } from "../../../../context/socketContext";
import { convertToINR } from "../../../../utils/helper";

const LiveExposure = memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state?.GetDashboardData?.dashboardData?.data?.activeBetsData);
  const adminData = useSelector((state) => state.Login.userData);
  const [voidInvalidModal, setVoidInvalidModal] = useState(false);
  const [typeOfBetDelete, setTypeOfBetDelete] = useState("");
  const [modalData, setModalData] = useState([]);
  const [betIds, setBetIds] = useState([]);
  const [betData, setBetData] = useState();
  const [liveExposureAmount, setLiveExposureAmount] = useState(0);
  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [filterDashBoardData, setFilterDashBoardData] = useState(dashboardData);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newBetId, setNewBetId] = useState(null);
  const [rowCount, setRowCount] = useState(50);

  function handleDelete(bet, status) {
    return;
  }

  function getDataFromServer(currentPage, rowCount) {
    setPaginationDisabled(true);
    dispatch(
      getLiveExposureData({
        currentPage,
        rowCount,
        callback: (datas) => {
          if (datas?.meta?.code == 200) {
            setLiveExposureAmount(datas?.data?.exposure);
            setFilterDashBoardData(datas?.data?.activeBets);
            setTotalPages(datas?.data?.totalPages);
            setPaginationDisabled(false);
          }
        },
      })
    );
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [rowCount]);

  useEffect(() => {
    let newBetId = 0;
    // Always fetch data whenever the page changes
    getDataFromServer(currentPage, rowCount);

    if (currentPage === 1) {
      // Only listen to the socket when the currentPage is 1
      const handleNewBet = (datas) => {
        getDataFromServer(currentPage, rowCount);

        // Set the new bet ID to highlight it
        if (datas?.bet === true) {
        } else {
          const newBet = datas?.data?.data?.allBets[0]; // Assuming the new bet comes in as the first bet
          setNewBetId(newBet?._id);

          newBetId = setTimeout(() => {
            setNewBetId(null);
          }, 1000);
        }
      };

      socket.on("new-bet", handleNewBet);

      // Cleanup listener when component unmounts or page changes
      return () => {
        socket.off("new-bet", handleNewBet);
        clearTimeout(newBetId);
      };
    }

    // If on any other page, just fetch data without adding the socket listener
  }, [socket, currentPage, rowCount]);

  return (
    <div className="live-exposure-container m-2 p-2 overflow-auto ">
      <div className="d-flex header m-2 p-3  bg-white rounded shadow-sm">
        <h2 className="m-0 ">Live Exposure : </h2>
        <h2 className="ms-4 ">{liveExposureAmount}</h2>
      </div>
      <div className="body">
        <div className="table-responsive" style={{ height: "75vh" }}>
          <table className="table table-bordered table-hover">
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
                  {t("EVENT")}
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
                  {t("DATE")}
                </th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {filterDashBoardData?.length &&
                filterDashBoardData?.map((data, index) => {
                  if (data.status == "7" || data.status == "6") {
                    if (
                      Object.values(ManagerRoles).includes(adminData?.role) ||
                      adminData.role === layerRoles.DIRECTOR
                    ) {
                      return (
                        <>
                          <tr
                            key={index}
                            className={` align-middle ${
                              data?._id === newBetId
                                ? "table-success border-2 border-warning"
                                : data?.bettingType === "LINE"
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
                              ...(data?.status == "7"
                                ? {
                                    opacity: 0.5,
                                  }
                                : {}),
                            }}
                          >
                            <td className="fw-semibold text-dark">
                              {data?.status == "6" &&
                              (adminData.role === ManagerRoles.MANAGER || adminData.role === layerRoles.DIRECTOR) ? (
                                <MdDelete
                                  className="delete-icon fs-6"
                                  onClick={() => handleDelete(data, data?.status)}
                                />
                              ) : null}
                              {data?.userId?.username}
                              {`(${data?.userId?.directParent?.parent_id?.username})`}
                            </td>
                            <td className="fw-semibold text-dark">{data?.eventId?.name}</td>
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
                            <td className="fw-semibold text-dark">
                              {adminData?.role === layerRoles?.WHITE_LABEL
                                ? convertToINR(data?.stake?.toFixed(), data?.userId?.currencyId?.value)
                                : data?.stake?.toFixed(2)}
                              {data?.userId?.currencyId?.value !== "1" ? ` (${data?.actualStake})` : null}
                            </td>
                            <td className="fw-semibold text-dark">{new Date(data?.createdAt)?.toLocaleString()}</td>
                          </tr>
                        </>
                      );
                    } else {
                      return null;
                    }
                  } else {
                    return (
                      <>
                        <tr
                          key={index}
                          className={` align-middle ${
                            data?._id === newBetId
                              ? "table-success border-2 border-warning"
                              : data?.bettingType === "LINE"
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
                            {data?.status == "6" &&
                            (adminData.role === ManagerRoles.MANAGER || adminData.role === layerRoles.DIRECTOR) ? (
                              <MdDelete className="delete-icon fs-6" onClick={() => handleDelete(data, data?.status)} />
                            ) : null}
                            {data?.userId?.username}
                            {`(${data?.userId?.directParent?.parent_id?.username})`}
                          </td>
                          <td className="fw-semibold text-dark">{data?.eventId?.name}</td>
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
                            {/* {/line/i.test(data?.selection)
                            ? Math.round(data?.odds)
                            : data?.odds}{" "} */}
                            {data?.odds}{" "}
                            {data?.oddsSize != null && !/line/i.test(data?.selection) ? `[${data?.oddsSize}]` : ""}
                          </td>
                          <td className="fw-semibold text-dark">
                            {adminData?.role === layerRoles?.WHITE_LABEL
                              ? convertToINR(data?.stake?.toFixed(), data?.userId?.currencyId?.value)
                              : data?.stake?.toFixed(2)}
                            {data?.userId?.currencyId?.value !== "1" ? ` (${data?.actualStake})` : null}
                          </td>

                          <td className="fw-semibold text-dark">{new Date(data?.createdAt)?.toLocaleString()}</td>
                        </tr>
                      </>
                    );
                  }
                })}
            </tbody>
          </table>
        </div>
        <div className={`pagination-bdy mt-2 ${paginationDisabled ? "pe-none opacity-50" : ""}`}>
          <PaginationRow rowCount={rowCount} setRowCount={setRowCount} setCurrPage={setCurrentPage} />
          <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        </div>
        {voidInvalidModal && (
          <VoidInvalidModal
            isOpen={voidInvalidModal}
            title={t("DELETE_BET_?")}
            toggler={setVoidInvalidModal}
            modalData={modalData}
            setBetIds={setBetIds}
            size="md"
            fieldTitle={t("NEW_PASSWORD")}
            typeofBet={typeOfBetDelete}
            betdata={betData}
            fn={getDataFromServer}
          />
        )}
      </div>
    </div>
  );
});

export default LiveExposure;
