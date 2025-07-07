import React, { Fragment, useEffect, useState, memo } from "react";
import { Card, CardBody, CardHeader, Col, Collapse } from "reactstrap";
import { Btn } from "../../../../AbstractElements";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { ManagerRoles, layerRoles } from "../../../../Constant";
import { convertINRToCurrency } from "../../../../utils/helper";
import { useSelector } from "react-redux";

const BookView = memo(
  ({ marketId, sharedBooks, setSharedBooks, setBetFairBooks, betFairBooks, currency, setTotalPLByColumnResult }) => {
    const adminData = useSelector((state) => state.Login.userData);
    const marketBooksData = useSelector((state) => state.GetBetsAndBooks?.allData?.books[marketId]);
    const { t } = useTranslation();
    const [openLive, setOpenLive] = useState(true);
    const [isBookViewOpen, setIsBookViewOpen] = useState(false);

    const toggleLiveAccordion = () => {
      setIsBookViewOpen((prev) => !prev);
      if (adminData?.role === 1) {
        setSharedBooks(sharedBooks);
        setBetFairBooks(betFairBooks);
        setOpenLive(!openLive);
      } else {
        setOpenLive(!openLive);
      }
    };

    if (!openLive) {
      if (sharedBooks || betFairBooks) {
        setOpenLive(!openLive);
        setOpenLive(true);
      }
    }

    // // Calculate the sum of PL for each column
    const calculateTotalPLByColumn = () => {
      const totalPLByColumnResult = [];
      const totalPLByColumn = [];

      marketBooksData?.books?.[0]?.booksData?.forEach(() => {
        totalPLByColumn.push({
          total_pl: 0,
          clientShare: 0,
          role: 0,
          pl: 0,
          individual_pl: 0,
          actual_pl: 0,
          clientShareVisibility: false,
          directParent: false,
        });
        totalPLByColumnResult.push({
          total_pl: 0,
          clientShare: 0,
          role: 0,
          actual_pl: 0,
          individual_pl: 0,
          clientShareVisibility: false,
          directParent: false,
        });
      });

      const allRolesAreSeven = marketBooksData?.books?.some((item) => item.userId.role !== 7);
      marketBooksData?.books?.forEach((book) => {
        book?.booksData?.forEach((bookData, subIndex) => {
          let client_shares = 0;
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

          if (book?.userId?.role !== 7) {
            totalPLByColumn[subIndex].clientShare += parseFloat(client_shares);
          } else {
            totalPLByColumn[subIndex].clientShare += 0;
          }
          totalPLByColumnResult[subIndex].directParent = !allRolesAreSeven;
          totalPLByColumn[subIndex].directParent = !allRolesAreSeven;

          total_pll = bookData?.pl;

          totalPLByColumn[subIndex].clientShareVisibility = allRolesAreSeven;
          totalPLByColumn[subIndex].individual_pl = bookData?.pl;
          totalPLByColumn[subIndex].role = book?.userId?.role;
          totalPLByColumn[subIndex].name = bookData?.name;
          totalPLByColumn[subIndex].originalName = bookData?.originalName;
          totalPLByColumn[subIndex].total_pl += !betFairBooks
            ? sharedBooks && bookData?.p_r
              ? bookData?.p_r || 0
              : total_pll || 0
            : bfShare
            ? bfShare
            : 0;
          if (bookData?.pl > 0) {
            totalPLByColumn[subIndex].actual_pl += -Math.abs(bookData?.pl);
          } else {
            totalPLByColumn[subIndex].actual_pl += Math.abs(bookData?.pl);
          }

          totalPLByColumnResult[subIndex].total_pl +=
            sharedBooks && bookData?.p_r ? bookData?.p_r || 0 : total_pll || 0;

          if (bookData?.pl > 0) {
            totalPLByColumnResult[subIndex].actual_pl += -Math.abs(bookData?.pl);
          } else {
            totalPLByColumnResult[subIndex].actual_pl += Math.abs(bookData?.pl);
          }
        });
      });

      setTotalPLByColumnResult((prevData) => {
        // Create a Set of existing names to check for duplicates
        const existingNames = new Set(prevData.map((item) => item.originalName));

        // Filter out duplicates by name
        const uniqueResults = totalPLByColumnResult.filter((item) => !existingNames.has(item.originalName));

        // Only update if there are new unique results
        if (uniqueResults?.length > 0) {
          return [...prevData, ...uniqueResults];
        } else {
          return prevData; // No change needed
        }
      });

      return totalPLByColumn;
    };

    return (
      <>
        {marketBooksData !== undefined && (
          <Card className="m-0 rounded-0" style={{ boxShadow: "none" }}>
            <CardHeader className="rounded-0 p-0" style={{ backgroundColor: "#EEE" }}>
              <Btn
                attrBtn={{
                  as: Card.Header,
                  className: "btn accordian-btn accordian-tab",
                  color: "default",
                  onClick: () => {
                    toggleLiveAccordion();
                  },
                }}
              >
                <div className="d-flex py-1  align-items-center  w-100 m-0">
                  <Col className="manageEve-card-text text-black live-tv-txt-left">{t(`BOOK_VIEW`)}</Col>
                  <Col className="dropDown-icon d-flex align-items-center justify-content-end live-tv-txt-right">
                    <RiArrowDropDownLine className="" />
                  </Col>
                </div>
              </Btn>
            </CardHeader>
            <Collapse isOpen={isBookViewOpen}>
              <div className="overflow-auto">
                <CardBody className="p-0 ">
                  <table className="table table-bordered table-responsive table-strip">
                    <thead className="table-light">
                      <tr>
                        {marketBooksData?.books?.map((bookData, index) => {
                          console.log(bookData, "kl");

                          if (bookData !== undefined && index === 0) {
                            return (
                              <Fragment key={index}>
                                <th>Username</th>
                                {bookData?.booksData?.map((data, subIndex) => (
                                  <th className="text-uppercase w-25 text-uppercase py-2" key={subIndex}>
                                    <span>{data?.name}</span>
                                  </th>
                                ))}
                              </Fragment>
                            );
                          }
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {marketBooksData?.books?.map((book, index) => (
                        <tr key={index}>
                          <td className="d-flex gap-1">
                            <badges
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f4f4f4",
                                width: "30px",
                                height: "18px",
                                borderRadius: "5px",
                                color: "#2f2f3b",
                                padding: "0.25rem 0.4rem",
                                fontSize: "12px",
                                fontWeight: "700",
                                textAlign: "center",
                              }}
                            >
                              {` ${
                                book?.userId?.role === ManagerRoles.ACCOUNTS_MANAGER
                                  ? "AC_M"
                                  : book?.userId?.role === layerRoles?.USER
                                  ? "U"
                                  : book?.userId?.role === layerRoles?.AGENT
                                  ? "AG"
                                  : book?.userId?.role === layerRoles?.MASTER
                                  ? "MS"
                                  : book?.userId?.role === layerRoles?.SUPER_MASTER
                                  ? "SM"
                                  : book?.userId?.role === layerRoles?.ADMIN
                                  ? "AD"
                                  : "SA"
                              }`}
                            </badges>
                            {sharedBooks === true ? (
                              <>
                                {book?.userId?.username}

                                {7 !== book?.userId?.role && (
                                  <>
                                    <br />
                                    {adminData?.monitoring_manager_accessibility === "2" ? "MY SHARE" : "CS"} (
                                    {book?.userId?.parents?.length >= 0
                                      ? book?.userId?.parents?.[0]?.parent_id?.sportShares !== 0
                                        ? adminData?.currencyId?.value
                                          ? convertINRToCurrency(
                                              book?.userId?.parents?.[0]?.parent_id?.sportShares,
                                              parseFloat(adminData?.currencyId?.value),
                                              true
                                            )
                                          : book?.userId?.parents?.[0]?.parent_id?.sportShares
                                        : 0
                                      : book?.userId?.sportShares !== 0
                                      ? book?.userId?.sportShares
                                      : 0}
                                    %)
                                  </>
                                )}
                              </>
                            ) : (
                              book?.userId?.username
                            )}
                          </td>
                          {book?.booksData?.map((bookData, subIndex) => {
                            let cs = 0;
                            if (book?.userId?.sportShares && book?.userId?.sportShares !== 0) {
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
                                cs = parseFloat(
                                  convertINRToCurrency(
                                    (bookData?.pl / 100) * book?.userId?.sportShares,
                                    parseFloat(adminData?.currencyId?.value),
                                    true
                                  )
                                )?.toFixed(2);
                              } else {
                                cs = ((bookData?.pl / 100) * book?.userId?.sportShares)?.toFixed(2);
                              }
                            } else {
                              if (book?.userId?.parents?.[0]?.parent_id?.sportShares !== 0) {
                                if (adminData?.currencyId?.value) {
                                  cs = parseFloat(
                                    convertINRToCurrency(
                                      (bookData?.pl / 100) * book?.userId?.parents?.[0]?.parent_id?.sportShares,
                                      parseFloat(adminData?.currencyId?.value),
                                      true
                                    )
                                  )?.toFixed(2);
                                } else {
                                  cs = parseFloat(
                                    (bookData?.pl / 100) * book?.userId?.parents?.[0]?.parent_id?.sportShares
                                  )?.toFixed(2);
                                }
                              }
                            }
                            cs = isNaN(cs) ? 0 : cs;

                            // console.log("cs", cs);
                            return (
                              <td key={subIndex}>
                                <div>
                                  {sharedBooks ? (
                                    <>
                                      <p style={{ margin: 0, marginLeft: "5px" }}>
                                        {(adminData?.role < layerRoles.ADMIN ||
                                          Object.values(ManagerRoles).includes(adminData?.role)) && (
                                          <>
                                            <span className={`${bookData?.pl < 0 ? "runner-p" : "runner-l"}`}>
                                              PL : {bookData?.pl < 0 ? "" : "-"}
                                              {adminData?.currencyId?.value &&
                                              [
                                                layerRoles.DIRECTOR,
                                                ManagerRoles.ACCOUNTS_MANAGER,
                                                ManagerRoles.MANAGER,
                                                ManagerRoles.MONITORING_MANAGER,
                                                ManagerRoles.FANCY_MANAGER,
                                                ManagerRoles.OPERATIONAL_MANAGER,
                                              ].includes(adminData?.role)
                                                ? convertINRToCurrency(
                                                    bookData.pl?.toFixed(2),
                                                    parseInt(adminData?.currencyId?.value),
                                                    true
                                                  )
                                                : currency
                                                ? convertINRToCurrency(
                                                    Math.abs(bookData?.pl),
                                                    parseFloat(currency?.value?.value),
                                                    true
                                                  )
                                                : Math.abs(bookData?.pl).toFixed(2)}
                                            </span>
                                            <br />
                                          </>
                                        )}

                                        {7 !== book?.userId?.role && book?.userId?.sportShares !== 0 && (
                                          <>
                                            <span className={`${cs <= 0 ? "runner-p" : "runner-l"}`}>
                                              {adminData?.monitoring_manager_accessibility === "2" ? "MY SHARE" : "CS"}{" "}
                                              :{cs <= 0 ? "" : "-"}
                                              {Math.abs(cs)}
                                            </span>
                                          </>
                                        )}
                                      </p>
                                    </>
                                  ) : null}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      <tr>
                        <td>Total PL</td>
                        {sharedBooks
                          ? calculateTotalPLByColumn()?.map((total, subIndex) => {
                              let cs = currency
                                ? convertINRToCurrency(total?.clientShare, parseFloat(currency?.value?.value), true)
                                : total?.clientShare;
                              cs = parseFloat(cs);

                              let csCal = 0;
                              let finalPl = 0;

                              if (cs < 0) {
                                csCal = -1 * cs;
                              } else {
                                csCal = -cs;
                              }

                              finalPl = total?.actual_pl - csCal;

                              return (
                                <td key={subIndex}>
                                  <span className={`${finalPl > 0 ? "runner-p" : "runner-l"}`}>
                                    {finalPl > 0 ? "" : "-"}
                                    {Math.abs(finalPl)?.toFixed(2)}
                                  </span>

                                  {sharedBooks && total?.clientShareVisibility && !isNaN(total?.clientShare) && (
                                    <div className={`${cs <= 0 ? "runner-p" : "runner-l"}`}>
                                      [
                                      <>
                                        {adminData?.monitoring_manager_accessibility === "2" ? "MY SHARE" : "CS"}:
                                        <span>
                                          {cs <= 0 ? "" : "-"}
                                          {Math.abs(cs?.toFixed(2))}
                                        </span>
                                      </>
                                      ]
                                    </div>
                                  )}
                                </td>
                              );
                            })
                          : calculateTotalPLByColumn()?.map((total, subIndex) => {
                              let pl = currency
                                ? convertINRToCurrency(total?.total_pl, parseFloat(currency?.value?.value), true)
                                : total?.actual_pl;
                              pl = parseFloat(pl);

                              let cs = currency
                                ? convertINRToCurrency(total?.clientShare, parseFloat(currency?.value?.value), true)
                                : total?.clientShare;
                              cs = parseFloat(cs);

                              return (
                                <td key={subIndex}>
                                  <span className={`${pl > 0 ? "runner-p" : "runner-l"}`}>
                                    {pl > 0 ? "" : "-"}
                                    {Math.abs(pl)?.toFixed(2)}
                                  </span>

                                  {sharedBooks && total?.clientShareVisibility && !isNaN(total?.clientShare) && (
                                    <div className={`${cs <= 0 ? "runner-p" : "runner-l"}`}>
                                      [
                                      <>
                                        {adminData?.monitoring_manager_accessibility === "2" ? "MY SHARE" : "CS"}:
                                        <span>
                                          {cs <= 0 ? "" : "-"}
                                          {Math.abs(cs?.toFixed(2))}
                                        </span>
                                      </>
                                      ]
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                      </tr>
                    </tbody>
                  </table>
                </CardBody>
              </div>
            </Collapse>
          </Card>
        )}
      </>
    );
  }
);

export default BookView;
