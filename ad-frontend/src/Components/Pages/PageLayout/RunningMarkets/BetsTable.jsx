import React, { Fragment, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Card, CardHeader, Table } from "reactstrap";
import { BetStatus, ManagerRoles, PAGINATION, layerRoles } from "../../../../Constant";
import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import MarketsModal from "../modal/MarketsModal";
import { socket } from "../../../../context/socketContext";
import { getBetsOfRunningMarket } from "../../../../redux/action";
import { default as VoidInvalidModal } from "../modal/VoidInvalidModal";
import { convertINRToCurrency, finduserParent, getLocalStorageItem } from "../../../../utils/helper";
import { useLocation } from "react-router";

const BetsTable = memo(
  ({
    market,
    bets,
    setCurrentPage,
    setActionTable,
    setBetIds,
    currency,
    eventId,
    viewDeleted,
    socketData,
    matchType,
    marketType,
    betFairBooks,
    triggerRefresh,
    filterBetAmount,
  }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [role, setRole] = useState(1);
    const location = useLocation();
    const [voidInvalidModal, setvoidInvalidModal] = useState(false);
    const [modalData, setModaldata] = useState({});
    const [marketBets, setMarketBets] = useState([]);
    const [typeOfBetDelete, setTypeofBetDelete] = useState("");
    const [profit, setProfit] = useState(0);
    const [lineProfit, setProfitLine] = useState(0);
    const [fancyProfit, setFancyProfit] = useState(0);
    const [bookMakerProfit, setBookMakerProfit] = useState(0);
    const [currPage, setCurrPage] = useState(PAGINATION?.currentPage);
    const [limit, setLimit] = useState(PAGINATION?.perPage);
    const [hasMore, setHasMore] = useState(true);
    const [prevPage, setPrevPage] = useState(0);
    const [totalDataCount, setTotalDataCount] = useState(1);
    const [scrollControl, setScrollControl] = useState(true);
    const [totalPagesMarketBets, setTotalPagesMarketBets] = useState(1);
    const adminData = useSelector((state) => state.Login.userData);

    useEffect(() => {
      let roles = JSON.parse(getLocalStorageItem("userData"));
      setRole(roles?.role);
    }, [market]);

    useEffect(() => {
      init();
    }, [currPage, limit, triggerRefresh, currency, viewDeleted]);

    const init = () => {
      const currencyId = currency?.value?._id;
      let type = market;

      dispatch(
        getBetsOfRunningMarket({
          eventId: eventId,
          currencyId,
          deleted: viewDeleted?.value === "ACTIVE" ? false : true,
          type,
          perPage: limit,
          currentPage: currPage,
          filterBetAmount,
          callback: (data) => {
            if (data) {
              profitAndLoss(data?.data);
              setScrollControl(true);
              // console.log("data,,,,,,,,,,,,,", data);
              setTotalDataCount(data?.meta?.count);
              setHasMore(data?.meta?.hasMore);

              setMarketBets(data?.data);
              setTotalPagesMarketBets(Math.ceil(data?.meta?.count / data?.meta?.per_page));
            }
          },
        })
      );
    };

    const handleModal = () => {
      setOpenModal(!openModal);
    };

    const profitAndLoss = (data) => {
      let newLineProfit = 0;
      let newProfit = 0;
      let newFancyProfit = 0;
      let newBookmakerProfit = 0;
      data?.forEach((bet) => {
        if (bet.marketType === market && bet?.status !== "4" && bet?.status !== "7") {
          if (betFairBooks) {
            if (bet?.bettingType === "LINE" && bet?.marketType === "exchange") {
              newLineProfit += (bet?.stake * bet?.betFairPercentage) / 100;
            }
          }

          if (bet?.marketType === "fancy") {
            newFancyProfit += bet?.stake;
          }
          if (bet?.marketType === "bookmaker") {
            newBookmakerProfit += bet?.stake;
          }
        }
        setProfitLine(newLineProfit);
        setProfit(newProfit);
        setFancyProfit(newFancyProfit);
        setBookMakerProfit(newBookmakerProfit);
      });
    };

    const showUserBets = (userId, parent) => {
      setOpenModal(true);
      setModaldata({ username: userId?.username, parent });
    };

    const handleDelete = (bet, status) => {
      setvoidInvalidModal(true);
      setModaldata(bet);
      setTypeofBetDelete(status);
    };

    const handlePageChangeMarketBets = (newPage) => {
      setCurrPage(newPage);
    };
    // useEffect(() => {
    //   profitAndLoss();
    // }, [bets]);
    if (marketBets?.length) {
      return (
        <Fragment>
          <Card className="p-0  my-2">
            <CardHeader className="bg-darkGreen py-2 p-3">
              <div className="">
                <div className="d-flex align-items-center w-full justify-content-between">
                  <span className="d-flex ">
                    <p className="manageEve-card-text text-capitalize">{market}</p>
                    <p className="show-count px-3 rounded-pill ms-1 text-dark bg-light">
                      {marketBets ? totalDataCount : 0}
                    </p>
                  </span>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-scroll " style={{ height: "540px", overflowY: "auto" }}>
              <Table bordered className="table table-hover px-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("USER_PARENT")}
                    </th>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("SELECTION")}
                    </th>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("ODDS")}
                    </th>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("STAKE")}
                    </th>

                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("DATE")}
                    </th>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("SYSTEM_IP_ADDRESS")}
                    </th>
                    <th scope="col" className="text-uppercase text-nowrap">
                      {t("BROWSER_IP_ADDRESS")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketBets?.map((bet, index) => {
                    let parent = finduserParent(bet?.userId?.parents);

                    if (bet?.status !== "4")
                      return (
                        <tr
                          style={{
                            ...(bet?.status !== BetStatus.OPEN
                              ? {
                                  opacity: 0.5,
                                }
                              : ""),
                          }}
                          className={`${
                            bet?.bettingType === "LINE"
                              ? bet?.selectionType === "back"
                                ? "table-danger"
                                : bet?.selectionType === "lay"
                                ? "table-primary"
                                : "table-danger"
                              : bet?.selectionType === "back"
                              ? "table-primary"
                              : "table-danger"
                          }`}
                          key={index}
                        >
                          {
                            <td className="table-txt-blue link">
                              {bet?.status === "6" ? (
                                <div className="d-flex align-items-center">
                                  {role < 1.9 &&
                                    role !== ManagerRoles.MONITORING_MANAGER &&
                                    bet?.status === "6" &&
                                    bet?.marketType === "exchange" && (
                                      <MdDelete
                                        className="delete-icon fs-6"
                                        onClick={() => handleDelete(bet, bet?.status)}
                                      />
                                    )}
                                  <span onClick={() => showUserBets(bet?.userId, parent?.parent_id?.username)}>
                                    &nbsp; {bet?.userId?.username}&nbsp;[
                                    {parent?.parent_id?.username}]
                                  </span>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center">
                                  {role < 1.9 &&
                                    role !== ManagerRoles.MONITORING_MANAGER &&
                                    bet?.status === "1" &&
                                    bet?.marketType !== "exchange" && (
                                      <MdDelete
                                        className="delete-icon fs-6"
                                        onClick={() => handleDelete(bet?._id, bet?.status)}
                                      />
                                    )}
                                  <span onClick={() => showUserBets(bet?.userId, parent?.parent_id?.username)}>
                                    {bet?.userId?.username}&nbsp;[
                                    {parent?.parent_id?.username}]
                                  </span>
                                </div>
                              )}
                            </td>
                          }
                          <td className="table-text">{bet?.selection}</td>
                          <td className="table-txt-blue">
                            {/* {line ? Math.round(bet?.odds) : bet?.odds} */}
                            {bet?.odds}
                          </td>
                          <td className="table-text">
                            {adminData?.role === layerRoles?.WHITE_LABEL
                              ? bet?.stake?.toFixed()
                              : bet?.stake?.toFixed(2)}
                          </td>
                          <td className="table-text">{new Date(bet?.createdAt)?.toLocaleString()}</td>
                          <td className="table-txt-blue">
                            {bet?.userId?.ip_address?.system_ip ? bet?.userId?.ip_address?.system_ip : "-"}
                          </td>
                          <td className="table-txt-blue">
                            {bet?.userId?.ip_address?.browser_ip ? bet?.userId?.ip_address?.browser_ip : "-"}
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </Table>
            </div>
            <div className="p-3 d-flex justify-content-end gap-3 ">
              <PaginationRow rowCount={limit} setRowCount={setLimit} setCurrPage={setCurrPage} />
              <PaginationButtons
                currentPage={currPage}
                totalPages={totalPagesMarketBets}
                handlePageChange={handlePageChangeMarketBets}
              />
            </div>

            {openModal && (
              <MarketsModal
                isOpen={openModal}
                title={modalData?.username}
                username={modalData?.username}
                parent={modalData?.parent}
                toggler={handleModal}
                size="lg"
                pagination={true}
                role={role}
                matchType={matchType}
                marketType={marketType}
                isMultiple={true}
                eventId={eventId}
                viewDeleted={viewDeleted}
                socketData={socketData}
                currency={currency}
                filterBetAmount={filterBetAmount}
              />
            )}
          </Card>
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
            />
          )}
        </Fragment>
      );
    } else {
      return null;
    }
  }
);

export default BetsTable;
