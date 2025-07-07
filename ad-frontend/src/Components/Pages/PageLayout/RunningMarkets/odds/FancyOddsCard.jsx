import React from "react";
import { Col, Row, Table } from "reactstrap";
import EmptyRunners from "./EmptyRunners";

const FancyOddsCard = ({ currentRunnerodd, marketBooks }) => {
  return (
    <>
      <div className="d-flex justify-content-end mr-4">
        {currentRunnerodd !== undefined ?
          <>
            <div className="d-flex px-1">
              <div className={`rounded my-1 runner-back`}>
                <div>
                  <p className="runner-price text-black">
                    {currentRunnerodd?.b1 ? currentRunnerodd?.b1 : "_"}
                  </p>
                  <p className="runner-size text-black">{currentRunnerodd?.bs1}</p>
                </div>
              </div>
            </div>
            <div className="px-1">
              <div className={`rounded my-1 runner-lay`}>
                <div>
                  <p className="runner-price text-black">
                    {currentRunnerodd?.l1 ? currentRunnerodd?.l1 : "_"}
                  </p>
                  <p className="runner-size text-black"> {currentRunnerodd?.ls1}</p>
                </div>
              </div>
            </div>
          </> : <EmptyRunners oddCount={2} status={"suspended"} />}
      </div>
      <div className="overflow-auto pt-1">
        <table className="table table-bordered table-striped table-responsive">
          <thead className="table-light">
            <tr className="text-center">
              {marketBooks &&
                Object?.keys(marketBooks)?.map((val, index) => (
                  <th key={index} scope="col" className="text-uppercase">
                    {val}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {marketBooks &&
                Object?.values(marketBooks)?.map((item, index) => (
                  <>
                    <td
                      className={`fw-bold ${-1 * item < 0 ? "text-danger" : "text-success"
                        }`}
                      key={index}
                    >
                      {(-1 * item)?.toFixed(2)}
                    </td>
                  </>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FancyOddsCard;
