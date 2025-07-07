import { Col, Row } from "reactstrap";
import { findBookMakerOdds } from "../../../../../utils/helper";
import EmptyRunners from "./EmptyRunners";
import { Fragment, useState } from "react";
import { useEffect } from "react";

const BookMakerCard = ({ runners, runnerBook, odds, sharedBooks }) => {
  const oddsCount = Array?.from({ length: 3 });
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const totalPLByColumn = [];
    runnerBook?.books?.[0]?.booksData?.forEach((bkData) => {
      // totalPLByColumn.push(0);
      let data = {
        name: bkData?.name,
        pl_pr: 0,
        pl: 0,
      };
      totalPLByColumn.push(data);
    });
    // Loop through the bookviewData to sum up pl values for each column
    runnerBook?.books?.forEach((book) => {
      totalPLByColumn.forEach((plData) => {
        book?.booksData?.forEach((bookData, subIndex) => {
          if (String(bookData?.name) === String(plData?.name)) {
            plData.pl +=
              sharedBooks && bookData?.p_r
                ? bookData?.p_r || 0
                : bookData?.pl || 0;
            // plData.pl += bookData?.pl || 0;
            // plData.pl_pr += bookData?.p_r || 0;
          }
        });
      });
    });
    setBooks(totalPLByColumn);
  }, [runnerBook, sharedBooks]);

  return (
    <>
      {runners
        ?.sort((a, b) => parseInt(a.sort) - parseInt(b.sort))
        ?.map((runner, index) => {
          const currentMarket = findBookMakerOdds(odds, runner?.selectionId);
          return (
            <Fragment key={index}>
              <div className="d-flex  justify-content-between p-1">
                <div className="d-flex">
                  <Col>
                    <p className="runner-name">{runner?.runnerName}</p>
                    {books?.map((book, i) => {
                      if (runner?.runnerName === book?.name) {
                        if (book?.pl !== 0) {
                          return (
                            <span
                              key={i}
                              className={`${
                                book?.pl > 0 ? "runner-l" : "runner-p"
                              }`}
                            >
                              {Math.abs(book?.pl).toFixed(2)}
                            </span>
                          );
                        } else {
                          return null;
                        }
                      } else {
                        return null;
                      }
                    })}
                  </Col>
                </div>

                <div className="d-flex">
                  {currentMarket?.status === "SUSPENDED" ||
                  currentMarket?.status === "BALL_RUNNING" ||
                  currentMarket?.back_price <= 0 ? (
                    <EmptyRunners
                      oddCount={6}
                      status={
                        currentMarket?.back_price <= 0
                          ? "suspended"
                          : currentMarket?.status
                      }
                    />
                  ) : (
                    <>
                      {oddsCount?.map((_, index) => {
                        return (
                          <>
                            <Col
                              key={index}
                              className={`px-1 flex-grow-1 text-black ${
                                index === Math.floor(oddsCount?.length / 2)
                                  ? ""
                                  : " d-none  d-xl-block"
                              }`}
                            >
                              <div
                                className={`rounded my-1 ${
                                  index === Math.floor(oddsCount?.length / 2)
                                    ? "runner-back"
                                    : "runner-default d-none  d-xl-block"
                                }`}
                              >
                                <div>
                                  <p className="runner-price">
                                    {index === Math.floor(oddsCount?.length / 2)
                                      ? currentMarket?.back_price
                                        ? currentMarket?.back_price
                                        : "-"
                                      : ""}
                                  </p>
                                  <p className="runner-size text-nowrap">
                                    {index === Math.floor(oddsCount?.length / 2)
                                      ? currentMarket?.back_volume
                                        ? currentMarket?.back_volume
                                        : "-"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col
                              className={`px-1 flex-grow-1 text-black ${
                                index === Math.floor(oddsCount?.length / 2)
                                  ? ""
                                  : " d-none  d-xl-block"
                              }`}
                            >
                              <div
                                className={`rounded my-1 ${
                                  index === Math.floor(oddsCount?.length / 2)
                                    ? "runner-lay"
                                    : "runner-default d-none  d-xl-block"
                                }`}
                              >
                                <div>
                                  <p className="runner-price">
                                    {index === Math.floor(oddsCount?.length / 2)
                                      ? currentMarket?.lay_price
                                        ? currentMarket?.lay_price
                                        : "-"
                                      : ""}
                                  </p>
                                  <p className="runner-size text-nowrap">
                                    {index === Math.floor(oddsCount?.length / 2)
                                      ? currentMarket?.lay_volume
                                        ? currentMarket?.lay_volume
                                        : "-"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
              {index < runner?.length - 1 && (
                <hr className="my-0" style={{ borderTop: "1px solid #ccc" }} />
              )}{" "}
            </Fragment>
          );
        })}
    </>
  );
};

export default BookMakerCard;
