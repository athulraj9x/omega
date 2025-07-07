import React, { useEffect, useState } from "react";
import { getLiveExposureData } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import { socket } from "../../../../context/socketContext";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import Select from "react-select";

const NewExposure = () => {
  const dispatch = useDispatch();
  const [liveExposureAmount, setLiveExposureAmount] = useState(0);
  const [activeBets, setActiveBets] = useState([]);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const adminData = useSelector((state) => state.Login.userData);
  const [paginationDisabled, setPaginationDisabled] = useState(false);
  const [newBetId, setNewBetId] = useState([]);
  const [rowCount, setRowCount] = useState(50);
  const [currentFilterOption, setCurrentFilterOption] = useState({ label: "All Bets", value: 0 });
  const filterOptions = [
    { label: "All Bets", value: 0 },
    { label: "Match Bets", value: 1 },
    { label: "Deleted Bets", value: 7 },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    const fetchData = () => {
      setPaginationDisabled(true);
      dispatch(
        getLiveExposureData({
          status: currentFilterOption?.value,
          page: currentPage,
          perPage: rowCount,
          onlyExposure: false,
          callback: (datas) => {
            if (datas?.meta?.code === 200) {
              setLiveExposureAmount(datas?.data?.exposure);
              setActiveBets(datas?.data?.activeBets);
              setTotalPages(datas?.data?.totalPages);
            }
            setPaginationDisabled(false);
          },
        })
      );
    };

    fetchData();
  }, [currentPage, rowCount, currentFilterOption, dispatch]);

  const getExposureAmount = () => {
    dispatch(
      getLiveExposureData({
        status: currentFilterOption?.value,
        page: currentPage,
        perPage: rowCount,
        onlyExposure: true,
        callback: (datas) => {
          if (datas?.meta?.code === 200) {
            setLiveExposureAmount(datas?.data?.exposure);
          }
        },
      })
    );
  };

  const getExposure = () => {
    dispatch(
      getLiveExposureData({
        status: currentFilterOption?.value,
        page: currentPage,
        perPage: rowCount,
        onlyExposure: false,
        callback: (datas) => {
          if (datas?.meta?.code === 200) {
            setLiveExposureAmount(datas?.data?.exposure);
            setActiveBets(datas?.data?.activeBets);
            setTotalPages(datas?.data?.totalPages);
          }
        },
      })
    );
  };

  useEffect(() => {
    let timeoutId = null;

    const handleNewBet = (datas) => {
      let filteredData = datas;
      if (currentFilterOption?.value !== 0) {
        filteredData = filteredData?.filter((item) => item.status === String(currentFilterOption.value));
      }

      if (!filteredData?.length) return;

      if (adminData?.role === ManagerRoles?.MONITORING_MANAGER) {
        getExposure();
        return;
      }

      setActiveBets((prevBets) => {
        const updatedBets = [...prevBets];
        const newBetIds = new Set();

        filteredData.forEach((newBet) => {
          const existingIndex = updatedBets.findIndex((bet) => bet._id === newBet._id);

          if (existingIndex !== -1) {
            updatedBets[existingIndex] = newBet;
          } else {
            updatedBets.unshift(newBet);
          }

          newBetIds.add(newBet._id);
        });

        if (updatedBets.length > rowCount) {
          updatedBets.splice(rowCount);
        }

        setNewBetId((prevIds) => [...new Set([...prevIds, ...newBetIds])]);

        return updatedBets;
      });

      getExposureAmount();

      timeoutId = setTimeout(() => {
        setNewBetId([]);
      }, 1000);
    };

    const handleCancelBet = (successIds) => {
      setActiveBets((prevActiveBets) => prevActiveBets.filter((bet) => !successIds.includes(bet._id)));
    };

    socket.on("liveExposureNewBet", handleNewBet);
    socket.on("statusChangeBets", handleNewBet);
    socket.on("cancel-bet", handleCancelBet);

    return () => {
      socket.off("liveExposureNewBet", handleNewBet);
      socket.off("statusChangeBets", handleNewBet);
      socket.off("cancel-bet", handleCancelBet);
      clearTimeout(timeoutId);
    };
  }, [currentFilterOption]);

  return (
    <div className="live-exposure-container m-2 p-2 overflow-auto ">
      <div className="d-flex justify-content-between header m-2 p-3  bg-white rounded shadow-sm">
        <div className="d-flex">
          <h2 className="m-0 ">Live Exposure : </h2>
          <h2 className="ms-4 ">{liveExposureAmount}</h2>
        </div>
        <Select
          styles={{
            control: (provided) => ({
              ...provided,
              width: "150px",
              zIndex: 1,
              fontSize: "13px",
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          menuPortalTarget={document.body}
          options={filterOptions}
          className="mySelect"
          value={currentFilterOption}
          placeholder={t("FILTER_BETS")}
          onChange={(option) => setCurrentFilterOption(option)}
        />
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
              {activeBets?.length > 0 &&
                activeBets.map((data, index) => (
                  <tr
                    key={index}
                    className={`align-middle ${
                      newBetId.includes(data?._id)
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
                    }`}
                    style={{
                      ...(data?.status === "7"
                        ? {
                            opacity: 0.5,
                            textDecoration: "line-through",
                          }
                        : {}),
                    }}
                  >
                    <td className="fw-semibold text-dark">
                      {data?.status == "6" &&
                      (adminData.role === ManagerRoles.MONITORING_MANAGER || adminData.role === layerRoles.DIRECTOR) ? (
                        <MdDelete className="delete-icon fs-6" />
                      ) : null}
                      {data?.username}
                      {` (${data?.parentUsername})`}
                    </td>
                    <td className="fw-semibold text-dark">{data?.eventName}</td>
                    <td className="fw-semibold text-dark">{data?.selection}</td>
                    <td className="fw-semibold text-dark">
                      {data.bettingType == "LINE"
                        ? data.selectionType === "back"
                          ? "lay"
                          : "back"
                        : data.selectionType}
                    </td>
                    <td className="fw-semibold text-dark">
                      {data?.odds}{" "}
                      {data?.oddsSize != null && !/line/i.test(data?.selection) ? `[${data?.oddsSize}]` : ""}
                    </td>
                    <td className="fw-semibold text-dark">
                      {data?.stake} {data?.actualStake && `(${data?.actualStake})`}
                    </td>

                    <td className="fw-semibold text-dark">{new Date(data?.createdAt)?.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`pagination-bdy mt-2 ${paginationDisabled ? "pe-none opacity-50" : ""}`}>
        <PaginationRow rowCount={rowCount} setRowCount={setRowCount} setCurrPage={setCurrentPage} />
        <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </div>
    </div>
  );
};
export default NewExposure;
