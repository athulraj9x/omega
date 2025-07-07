import React, { useEffect, useState, memo } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";
import VoidInvalidModal from "../modal/VoidInvalidModal";
import { useDispatch } from "react-redux";
import { getBetsAndBooks, getLiveExposureData } from "../../../../redux/action";
import { socket } from "../../../../context/socketContext";

const LiveExposureModal = memo((props) => {
  const { t } = useTranslation();
  const dashboardData = useSelector((state) => state?.GetDashboardData?.dashboardData?.data?.activeBetsData);
  const adminData = useSelector((state) => state.Login.userData);
  const [voidInvalidModal, setvoidInvalidModal] = useState(false);
  const [typeOfBetDelete, setTypeofBetDelete] = useState("");
  const [modalData, setModaldata] = useState([]);
  const [betIfds, setBetIds] = useState([]);
  const [betData, setBetsData] = useState();
  const dispatch = useDispatch();
  const [filterDashBoardData, setFilterDashBoardData] = useState(dashboardData);

  function handleDelete(bet, status) {
    setBetsData(bet);
    dispatch(
      getBetsAndBooks({
        eventId: bet?.eventId?._id,
        callback: (data) => {
          if (data?.meta?.code == 200) {
            setvoidInvalidModal(true);
            const matchedBetData = data?.data?.bets?.filter((value) => value?._id === bet?._id);
            setModaldata(matchedBetData);
            setTypeofBetDelete(status);
          }
        },
      })
    );
  }

  useEffect(() => {
    const fetchData = () => {
      getDataFromServer();
    };

    fetchData();

    const handleNewBet = (datas) => {
      fetchData();
    };

    socket.on("new-bet", handleNewBet);

    return () => {
      socket.off("new-bet", handleNewBet);
    };
  }, [socket]);

  function getDataFromServer() {
    dispatch(
      getLiveExposureData({
        callback: (datas) => {
          if (datas?.meta?.code == 200) {
            setFilterDashBoardData(datas?.data?.activeBets);
          }
        },
      })
    );
  }

  return (
    <Modal className="" show={props.isOpen} onHide={props.toggler} centered size={props.size}>
      <Modal.Header closeButton>
        <Modal.Title>{`${t("ACTIVE_BETS")}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={props.bodyClass} style={{ padding: "0px" }}>
        <div className="overflow-auto" style={{ height: "80vh" }}>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
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
            <tbody>
              {filterDashBoardData?.length &&
                filterDashBoardData?.map((data, index) => {
                  return (
                    <>
                      <tr
                        key={index}
                        className={`align-middle ${
                          data?.bettingType === "LINE"
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
                          ...(data?.status == "7"
                            ? {
                                opacity: 0.5,
                              }
                            : ""),
                        }}
                      >
                        <td className="fw-semibold text-dark">
                          {data?.status == "6" &&
                          (adminData.role === ManagerRoles.MANAGER || adminData.role === layerRoles.DIRECTOR) ? (
                            <MdDelete className="delete-icon fs-6" onClick={() => handleDelete(data, data?.status)} />
                          ) : null}
                          {data?.userId?.username}
                        </td>
                        <td className="fw-semibold text-dark">{data?.eventId?.name}</td>
                        <td className="fw-semibold text-dark">{data?.selection}</td>
                        <td className="fw-semibold text-dark">{data?.selectionType}</td>
                        <td className="fw-semibold text-dark">
                          {/line/i.test(data?.selection) ? Math.round(data?.odds) : data?.odds}{" "}
                          {data?.oddsSize != null && !/line/i.test(data?.selection) ? `[${data?.oddsSize}]` : ""}
                        </td>
                        <td className="fw-semibold text-dark">{data?.stake?.toFixed(2)}</td>

                        <td className="fw-semibold text-dark">{new Date(data?.createdAt)?.toLocaleString()}</td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
        {voidInvalidModal && (
          <VoidInvalidModal
            isOpen={voidInvalidModal}
            title={t("DELETE_BET_?")}
            toggler={setvoidInvalidModal}
            modalData={modalData}
            setBetIds={setBetIds}
            size="md"
            fieldTitle={t("NEW_PASSWORD")}
            typeofBet={typeOfBetDelete}
            betdata={betData}
            fn={getDataFromServer}
          />
        )}
      </Modal.Body>
    </Modal>
  );
});

export default LiveExposureModal;
