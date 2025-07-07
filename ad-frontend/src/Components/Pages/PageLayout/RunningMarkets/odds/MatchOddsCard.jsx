import React, { memo } from "react";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { convertINRToCurrency, findRunnerOdds } from "../../../../../utils/helper";
import EmptyRunners from "./EmptyRunners";

import { layerRoles, ManagerRoles } from "../../../../../Constant";
import { HorseRelatedSportsCode } from "../../../../../utils/constants";

const MatchOddsCard = ({ market, marketId, odds, sharedBooks, currency, betFairBooks, line, runners, sportsCode }) => {
  const adminData = useSelector((state) => state.Login.userData);
  const marketBooksData = useSelector((state) => state.GetBetsAndBooks?.allData?.books[marketId]);

  const calculateTotalPLByBetshare_shareBook_Column = () => {
    const totalPLByColumn = [];
    const totalPLByColumnResult = [];

    if (marketBooksData?.books?.[0]?.booksData) {
      marketBooksData.books[0].booksData.forEach(() => {
        totalPLByColumn.push({
          total_pl: 0,
          clientShare: 0,
          role: 0,
          individual_pl: 0,
          actual_pl: 0,
          clientShareVisibility: false,
        });
        totalPLByColumnResult.push({
          total_pl: 0,
          clientShare: 0,
          role: 0,
          individual_pl: 0,
          actual_pl: 0,
          clientShareVisibility: false,
          directParent: false,
        });
      });
    }

    const allRolesAreSeven = marketBooksData?.books?.some((item) => item.userId.role !== 7);
    marketBooksData?.books?.forEach((book) => {
      book?.booksData?.forEach((bookData, subIndex) => {
        let valueToAdd = 0;
        let percentage = 0;
        let bfShare = 0;
        let total_pll = 0;
        let isClientShare = false;

        if (book?.userId?.sportShares) {
          isClientShare = book?.userId?.sportShares !== 0;
        } else {
          isClientShare =
            book?.userId?.parents?.[0]?.parent_id?.sportShares !== 0 &&
            book?.userId?.parents?.[0]?.parent_id?.sportShares !== undefined;
        }

        if (bookData?.pl > 0) {
          total_pll = bookData?.pl;
        } else {
          total_pll = -1 * bookData?.pl;
        }

        if (sharedBooks) {
          const sumOfShares = book.userId?.sportShares;
          if (isNaN(sumOfShares)) {
            percentage = total_pll;
          } else {
            percentage = (total_pll * (100 - sumOfShares)) / 100;
          }
          valueToAdd = percentage;
        }

        let client_shares = 0;

        if (isClientShare) {
          if (book?.userId?.sportShares) {
            if (
              adminData?.currencyId?.value &&
              [
                layerRoles.DIRECTOR,
                ManagerRoles.ACCOUNTS_MANAGER,
                ManagerRoles.MANAGER,
                ManagerRoles.MONITORING_MANAGER,
                ManagerRoles.FANCY_MANAGER,
                ManagerRoles.OPERATIONAL_MANAGER,
              ].includes(adminData?.role)
            ) {
              client_shares = convertINRToCurrency(
                (bookData?.pl / 100) * book?.userId?.sportShares,
                adminData?.currencyId?.value,
                true
              );
            } else {
              client_shares = (bookData?.pl / 100) * book?.userId?.sportShares;
            }
          } else {
            if (
              adminData?.currencyId?.value &&
              [
                layerRoles.DIRECTOR,
                ManagerRoles.ACCOUNTS_MANAGER,
                ManagerRoles.MANAGER,
                ManagerRoles.MONITORING_MANAGER,
                ManagerRoles.FANCY_MANAGER,
                ManagerRoles.OPERATIONAL_MANAGER,
              ].includes(adminData?.role)
            ) {
              client_shares = convertINRToCurrency(
                (bookData?.pl / 100) * book?.userId?.parents?.[0]?.parent_id?.sportShares,
                parseInt(adminData?.currencyId?.value),
                true
              );
            } else {
              client_shares = (bookData?.pl / 100) * book?.userId?.parents?.[0]?.parent_id?.sportShares;
            }
          }
        }

        // bfShare = bookData?.betFairShare;
        if (book?.userId?.role !== 7) {
          totalPLByColumn[subIndex].clientShare += parseFloat(client_shares);
          totalPLByColumnResult[subIndex].clientShare += parseFloat(client_shares);
        } else {
          totalPLByColumn[subIndex].clientShare += 0;
          totalPLByColumnResult[subIndex].clientShare += 0;
        }
        totalPLByColumnResult[subIndex].directParent = !allRolesAreSeven;

        if (valueToAdd < 0) {
          valueToAdd = -1 * valueToAdd;
        }

        if (bookData?.pl > 0) {
          totalPLByColumnResult[subIndex].actual_pl += -Math.abs(bookData?.pl);
          totalPLByColumnResult[subIndex].total_pl += -parseFloat(valueToAdd);
        } else {
          totalPLByColumnResult[subIndex].actual_pl += Math.abs(bookData?.pl);
          totalPLByColumnResult[subIndex].total_pl += parseFloat(valueToAdd);
        }

        totalPLByColumnResult[subIndex].clientShareVisibility = allRolesAreSeven;
        totalPLByColumnResult[subIndex].name = bookData?.runnerName;
        totalPLByColumnResult[subIndex].originalName = bookData?.originalName;
        // totalPLByColumnResult[subIndex].betFairShare += bfShare;
        totalPLByColumnResult[subIndex].role = book?.userId?.role;
        totalPLByColumnResult[subIndex].individual_pl = bookData?.pl;

        totalPLByColumn[subIndex].clientShareVisibility = allRolesAreSeven;

        totalPLByColumn[subIndex].individual_pl = bookData?.pl;
        totalPLByColumn[subIndex].role = book?.userId?.role;
        totalPLByColumn[subIndex].name = bookData?.runnerName;
        totalPLByColumn[subIndex].originalName = bookData?.originalName;
        totalPLByColumn[subIndex].betFairShare += bfShare;
        totalPLByColumn[subIndex].selectionId = bookData?.selectionId;

        if (bookData?.pl > 0) {
          totalPLByColumn[subIndex].actual_pl += -Math.abs(bookData?.pl);
          totalPLByColumn[subIndex].total_pl += -parseFloat(valueToAdd);
        } else {
          totalPLByColumn[subIndex].actual_pl += Math.abs(bookData?.pl);
          totalPLByColumn[subIndex].total_pl += parseFloat(valueToAdd);
        }
      });
    });
    // setBooks(totalPLByColumn);
    return totalPLByColumn;
  };

  const Runnerpl = () => {
    return (
      <Row>
        {calculateTotalPLByBetshare_shareBook_Column().map((total, subIndex) => {
          let cs = currency
            ? convertINRToCurrency(total?.clientShare, parseFloat(currency?.value?.value), true)
            : total?.clientShare;

          cs = parseFloat(cs);

          let csCal = cs < 0 ? -1 * cs : -cs;

          let finalPl = [
            layerRoles.DIRECTOR,
            ManagerRoles.ACCOUNTS_MANAGER,
            ManagerRoles.MANAGER,
            ManagerRoles.FANCY_MANAGER,
            ManagerRoles.OPERATIONAL_MANAGER,
          ].includes(adminData?.role)
            ? total?.actual_pl - csCal
            : total?.actual_pl - csCal;

          return (
            <Row key={subIndex} className="mb-2">
              {" "}
              {/* This ensures each column is in a new row */}
              <Col>
                <p className="runner-name">{total?.name}</p>
                <span>
                  <p className={`mr-2 mb-1 bg-amber-300 p-1 ${finalPl < 0 ? "runner-l" : "runner-p"}`}>
                    {finalPl < 0 ? "-" : ""}
                    {isNaN(finalPl) ? "loading" : Math.abs(finalPl)?.toFixed(2)}
                  </p>
                  <span className={`m-0 ${total?.actual_pl < 0 ? "runner-l" : "runner-p"}`}>
                    [PL:
                    {total?.actual_pl < 0 ? "-" : ""}
                    {isNaN(total?.actual_pl) ? "loading" : Math.abs(total?.actual_pl)?.toFixed(2)}]
                  </span>

                  {total?.clientShareVisibility && (
                    <p className={`m-0 ${cs <= 0 ? "runner-p" : "runner-l"}`}>
                      [
                      {
                        <>
                          {adminData?.monitoring_manager_accessibility === "2" ? "MY SHARE" : "CS"}:{cs <= 0 ? "" : "-"}
                          {isNaN(cs) ? "loading" : Math.abs(cs?.toFixed(2))}
                        </>
                      }
                      ]
                    </p>
                  )}
                </span>
              </Col>
            </Row>
          );
        })}
      </Row>
    );
  };

  const RunnerplOdds = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "60px",
        }}
      >
        {runners?.map((total, subIndex) => {
          let currentMarket = findRunnerOdds(odds, total?.selectionId);
          console.log(currentMarket?.ex, "currentMarket?.ex");

          let backArray = Array.from({ length: 3 }).map(
            (_, index) => currentMarket?.ex?.availableToBack[index] || null
          );

          let layArray = Array.from({ length: 3 }).map(
            (_, index) =>
              currentMarket?.ex?.availableToLay[currentMarket?.ex?.availableToLay?.length - index + 1] || null
          );

          // Explicitly return JSX inside .map()
          console.log(layArray, "layArray");
          console.log(backArray, "backArray");

          return (
            <React.Fragment key={subIndex}>
              {currentMarket ? (
                <>
                  {sportsCode && HorseRelatedSportsCode.some((item) => item.sportsCode === sportsCode) ? (
                    <>
                      {currentMarket?.ex?.availableToBack?.length > 0 ? (
                        <div className="d-flex">
                          {/* Lay Array */}
                          {[...Array(3)].map((_, index) => {
                            const current = currentMarket?.ex?.availableToBack?.[index] || {
                              price: "-",
                              size: "-",
                            };
                            return (
                              <Col
                                key={`back-${index}`}
                                className={`px-1 flex-grow-1 text-black ${
                                  current?.price ? "block" : "hidden xl:block"
                                }`}
                              >
                                <div className="rounded flex-grow-1 my-1 runner-back">
                                  <p className="runner-price">
                                    {current.price ? (line ? Math.round(current.price) : current.price) : "-"}
                                  </p>
                                  <p className="runner-size text-nowrap">{current.size ? current.size : "-"}</p>
                                </div>
                              </Col>
                            );
                          })}

                          {/* Back Array */}
                          {[...Array(3)].map((_, index) => {
                            const current = currentMarket?.ex?.availableToLay?.[index] || {
                              price: "-",
                              size: "-",
                            };
                            return (
                              <Col
                                key={`lay-${index}`}
                                className={`px-1 flex-grow-1 text-black ${current.price ? "block" : "hidden xl:block"}`}
                              >
                                <div className="rounded flex-grow-1 my-1 runner-lay">
                                  <div>
                                    <p className="runner-price">
                                      {current.price ? (line ? Math.round(current.price) : current.price) : "-"}
                                    </p>
                                    <p className="runner-size text-nowrap">{current.size ? current.size : "-"}</p>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyRunners oddCount={6} empty={true} />
                      )}
                    </>
                  ) : (
                    <>
                      {currentMarket?.ex?.availableToBack?.length > 0 ? (
                        <div className="d-flex" style={{ marginBottom: "58px" }}>
                          {/* Lay Array */}
                          {layArray?.map((odd, index) => {
                            return (
                              <Col
                                key={index}
                                className={`px-1 flex-grow-1 text-black ${odd?.price ? "block" : "sm:hidden xl:block"}`}
                              >
                                <div className="rounded flex-grow-1 my-1 runner-back">
                                  <p className="runner-price">{odd?.price ? odd?.price : "-"}</p>
                                  <p className="runner-size text-nowrap">{odd?.size ? odd?.size : "-"}</p>
                                </div>
                              </Col>
                            );
                          })}
                          {/* Back Array */}
                          {backArray?.map((odd, index) => {
                            return (
                              <Col
                                key={index}
                                className={`px-1 flex-grow-1 text-black ${odd?.price ? "block" : "sm:hidden xl:block"}`}
                              >
                                <div className="rounded flex-grow-1 my-1 runner-lay">
                                  <div>
                                    <p className="runner-price">{odd?.price ? odd.price : "-"}</p>
                                    <p className="runner-size text-nowrap">{odd?.size ? odd?.size : "-"}</p>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyRunners oddCount={6} empty={true} />
                      )}
                    </>
                  )}
                </>
              ) : (
                <EmptyRunners oddCount={6} empty={true} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Runnerpl />
        <RunnerplOdds />
      </div>
    </>
  );
};

export default memo(MatchOddsCard);
