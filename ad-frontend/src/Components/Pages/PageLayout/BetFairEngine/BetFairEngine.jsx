import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, H3 } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Label,
  CardFooter,
  Media,
  Table,
  CardHeader,
} from "reactstrap";

import PaginationButtons from "../../../Common/Component/pagination/PaginationButtons";
import PaginationRow from "../../../Common/Component/pagination/PaginationRow";
import { PAGINATION, layerRoles } from "../../../../Constant";
import { useDispatch, useSelector } from "react-redux";
import { getBetFairEngine, getCurrency } from "../../../../redux/action";
import { socket } from "../../../../context/socketContext";
import { formatDate } from "../../../../utils/helper";

const BetFairEngine = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [betFairCurency, setBetFairCurrency] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowCount, setRowCount] = useState(100);
  const [missMatched, setMissMatched] = useState(false);
  const handleMissMatch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setMissMatched(e.target.checked);
    getData(e.target.checked);
  };
  function getData(check = false) {
    dispatch(
      getBetFairEngine({
        perPage: rowCount,
        page: currentPage,
        missMatched: check,
        callback: (data) => {
          setTotalPages(data?.meta?.totalPages); 
          
          setData(data?.data);
        },
      })
    );
  }
  useEffect(() => {
    getData();
  }, [rowCount,currentPage]);
  useEffect(() => {
    const betFair = true;
    dispatch(
      getCurrency({
        betFair,
        callback: (data) => {
          const currency = data?.filter((cur) => cur.betFair === true);
          setBetFairCurrency(parseFloat(currency[0]?.value));
        },
      })
    );
  }, []);
  useEffect(() => {
    socket.on("new-bet", () => {
      getData();
    });
    return () => {
      socket.off("new-bet");
    };
  }, [socket]);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("Betfair Engine")}
        title={title?.title}
        parent={title?.parent}
        className="ms-2"
      />

      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              <CardHeader>
                <Media
                  body
                  className={`${"text-left"} d-flex align-items-center justify-content-end gap-2`}
                >
                  <span
                    // onClick={(e) => handleMissMatch(e)}
                    style={{ cursor: "pointer" }}
                    className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                  >
                    <span className="fw-semibold fs-6 d-flex align-items-center">
                      MissMatched{" "}
                    </span>

                    <Label className={`m-0 ${"switch"}`}>
                      <input
                        type="checkbox"
                        checked={missMatched}
                        onChange={(e) => handleMissMatch(e)}
                      />
                      <span
                        className="switch-state"
                        style={{
                          backgroundColor: missMatched
                            ? "limegreen"
                            : "lightgray",
                        }}
                      />
                    </Label>
                  </span>
                </Media>
              </CardHeader>
              <>
                <Row>
                  <Col>
                    <div className="overflow-auto ">
                      <table className="table table-bordered table-hover ">
                        <thead className="table-light bg-light sticky-top ">
                          <tr className="text-center">
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Date
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Stake
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Bet Id
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Balance before bet
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Balance After bet
                            </th>

                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              CustmerReference
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Type
                            </th>
                            <th
                              className="text-left m-0"
                              style={{ border: "none " }}
                            >
                              Mismatched
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.map((obj, index) => {
                            return (
                              <React.Fragment key={index}>
                                <tr
                                  className="text-left align-middle py-2 text-center"
                                  key={`data-${index}`}
                                >
                                  <td className="align-middle py-2 ">
                                    {formatDate(obj?.createdAt)}
                                  </td>
                                  <td className="align-middle py-2">
                                    {/* {(
                                    obj?.betFairStake / betFairCurency
                                  )?.toFixed(2)} */}
                                    {obj?.betFairStake}
                                  </td>
                                  <td className="align-middle py-2">
                                    {obj?.betId}
                                  </td>
                                  <td className="align-middle py-2">
                                    {obj?.betFairBalanceBefore}
                                  </td>
                                  <td className="align-middle py-2">
                                    {obj?.betFairBalanceAfter}
                                  </td>
                                  <td className="align-middle py-2 flex-d">
                                    {obj?.custmerReferenceId}
                                  </td>
                                  <td className="align-middle py-2 flex-d">
                                    {obj?.partialBet
                                      ? "Partial Bet"
                                      : obj?.unMatched
                                      ? "Unmatched bet"
                                      : "Bet Placed"}
                                  </td>
                                  <td
                                    className={`align-middle py-2 flex-d ${
                                      obj?.betMissMatched
                                        ? "text-danger"
                                        : "text-success"
                                    }`}
                                  >
                                    {obj?.betMissMatched
                                      ? "Miss Matched"
                                      : "Matched"}
                                  </td>
                                </tr>
                                {obj?.resultPublished ? (
                                  <tr
                                    className="text-center align-middle py-2"
                                    key={`result-${index}`}
                                  >
                                    <td colSpan="8">
                                      <p className="text-success h6 m-0">
                                        Result Published
                                      </p>
                                    </td>
                                  </tr>
                                ) : null}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </>
            </CardBody>
            <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow
                rowCount={rowCount}
                setRowCount={setRowCount}
                // keyVal={currentPage}
              />
              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </CardFooter>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BetFairEngine;
