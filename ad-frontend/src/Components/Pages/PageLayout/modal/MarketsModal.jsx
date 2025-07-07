import React, { useState, memo } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import VoidInvalidModal from "./VoidInvalidModal";
import { convertINRToCurrency, convertToINR, findAdminParent } from "../../../../utils/helper";
import { useEffect } from "react";
import { BetStatus, ManagerRoles, PAGINATION, layerRoles } from "../../../../Constant";
import { getViewBetsOfRunningMarket } from "../../../../redux/action";
import { socket } from "../../../../context/socketContext";

const MarketsModal = memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.Login.userData);
  const [voidInvalidModal, setvoidInvalidModal] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [action, setAction] = useState("");
  const [filteredBets, setFilteredBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(PAGINATION?.currentPage);
  const [limit, setLimit] = useState(PAGINATION?.perPage);
  const [totalDataCount, setTotalDataCount] = useState(1);
  const [totalPages, setTotalPages] = useState(PAGINATION?.totalPage);
  const [isFancyOrBookmakerExist, setIsFancyOrBookmakerExist] = useState(false);

  useEffect(() => {
    if (Array.isArray(props.marketType)) {
      if (props?.marketType?.length > 0) {
        let isExist = props?.marketType?.some((exist) => exist === "bookmaker" || exist === "fancy");
        setIsFancyOrBookmakerExist(isExist);
      }
    } else {
      if (props?.marketTypes?.length > 0) {
        let isExist = props?.marketTypes?.some((exist) => exist === "bookmaker" || exist === "fancy");
        setIsFancyOrBookmakerExist(isExist);
      }
    }
  }, [props]);

  useEffect(() => {
    let isMounted = true;
    if (props?.socketData !== undefined && props?.socketData?.data?.data?.length > 0) {
      if (props?.socketData?.data?.data.allBets[0]?.eventId === props?.eventId) {
        init();
      }
    } else {
      init();
    }
    return () => {
      isMounted = false; // Cancel the operation on unmount
    };
  }, [props?.currency, props?.socketData, props.isOpen, currentPage]);

  useEffect(() => {
    const handleBetStatusChange = (data) => {
      if (data && data?.length > 0) {
        init();
      }
    };
    socket.on("betStatusChange", handleBetStatusChange);
    return () => {
      socket.off("betStatusChange", handleBetStatusChange);
    };
  }, [socket]);

  const init = () => {
    const currencyId = props?.currency?.value?._id;
    let type = props?.marketType;

    dispatch(
      getViewBetsOfRunningMarket({
        eventId: props?.eventId,
        marketId: props?.marketId,
        isMultiple: props?.isMultiple,
        username: props?.username,
        currencyId,
        deleted: props?.viewDeleted?.value === "ACTIVE" ? false : true,
        type,
        perPage: limit,
        currentPage: currentPage,
        filterBetAmount: props?.filterBetAmount,
        callback: (data) => {
          if (data) {
            setTotalDataCount(data?.meta?.count);
            let totalPage = Math.ceil(data?.meta?.count / limit);
            setTotalPages(totalPage);
            setFilteredBets(data?.data);
          }
        },
      })
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = (betId) => {
    setvoidInvalidModal(true);
    setModaldata(betId);
  };

  return (
    <>
      <Modal show={props.isOpen} onHide={props.toggler} centered size={props.size}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.2rem" }}>{`${props?.title || ""} view bets`}</Modal.Title>
          {/* <input
          type="search"
          className="search-field"
          placeholder="search user"
        /> */}
        </Modal.Header>
        <Modal.Body className={props.bodyClass} style={{ padding: 0 + "px" }}>
          <div className="overflow-auto" style={{ height: "75vh" }}>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-uppercase">
                    {t("USER_PARENT")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("SELECTION")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("ODDS")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("STAKE")}
                  </th>

                  <th scope="col" className="text-uppercase">
                    {t("DATE")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("BROWSER_IP_ADDRESS")}
                  </th>
                  <th scope="col" className="text-uppercase">
                    {t("SYSTEM_IP_ADDRESS")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBets?.map((data, index) => {
                  let parent = findAdminParent(data?.userId?.parents, adminData?.role);
                  return (
                    <tr
                      style={{
                        ...(data?.status !== BetStatus.OPEN
                          ? {
                              opacity: 0.5,
                            }
                          : ""),
                      }}
                      className={`text-nowrap ${
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
                      key={index}
                    >
                      <td className="table-text-blue text-nowrap">
                        <div className="d-flex align-items-center">
                          {props?.role == 1 && data?.status === "6" && data?.marketType === "exchange" && (
                            <MdDelete className="delete-icon fs-6" onClick={() => handleDelete(data?._id)} />
                          )}
                          <span>
                            {data?.userId?.username}
                            {`[${parent?.parent_id?.username}]`}
                          </span>
                        </div>
                      </td>
                      <td className="fw-bold">{data?.selection}</td>
                      <td className="table-text-blue">
                        {/line/i.test(data?.selection) ? Math.round(data?.odds) : data?.odds}
                      </td>
                      <td className="fw-bold">
                        {adminData?.role === layerRoles?.WHITE_LABEL ? data?.stake?.toFixed() : data?.stake?.toFixed(2)}
                      </td>

                      <td className="fw-bold">{new Date(data?.createdAt)?.toLocaleString()}</td>
                      <td className="table-text-blue">
                        {data?.userId?.ip_address?.browser_ip ? data?.userId?.ip_address?.browser_ip : "-"}
                      </td>
                      <td className="table-txt-blue">
                        {data?.userId?.ip_address?.system_ip ? data?.userId?.ip_address?.system_ip : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {props?.pagination ? (
            <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
          ) : (
            <>
              <Button variant="secondary" onClick={props.toggler}>
                Close
              </Button>
              <Button variant="primary" onClick={props.toggler}>
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      {voidInvalidModal && (
        <VoidInvalidModal
          isOpen={voidInvalidModal}
          title={t("DELETE_BET_?")}
          toggler={setvoidInvalidModal}
          modalData={modalData}
          setBetIds={props.setBetIds}
          action={setAction}
          size="md"
          fieldTitle={t("NEW_PASSWORD")}
        />
      )}
    </>
  );
});

export default MarketsModal;
