import React from "react";
import { Col } from "reactstrap";

const EmptyRunners = ({ oddCount, status , empty}) => {
  return (
    <div className="d-flex position-relative"> 
      {Array.from({ length: oddCount ? oddCount : 6 }, (_, index) => (
        <Col
          key={index}
          className={`px-1 flex-grow-1 ${
            index === Math.floor(oddCount / 2) - 1
              ? ""
              : index === Math.ceil(oddCount / 2)
              ? ""
              : " d-none  d-xl-block"
          }`}
        >
          <div
            className={`rounded flex-grow-1 my-1 text-black ${
              index === Math.floor(oddCount / 2) - 1
                ? "runner-back"
                : index === Math.ceil(oddCount / 2)
                ? "runner-lay"
                : "runner-default d-none  d-xl-block"
            }`}
          >
            <div>
              <p className="runner-price">{empty ? "_" :""} </p>
              <p className="runner-size text-nowrap"> {empty ? "_" :""}</p>
            </div>
          </div>
        </Col>
      ))}
      {status && (
        <div
          className={`position-absolute top-50 start-50 translate-middle font-weight-medium text-sm h-6 py-1 px-2 rounded focus-visible-none bg-opacity-50 text-uppercase bg-dark translate-middle-x-n50 translate-middle-y-n50 opacity-88 p-1 text-white backdrop-blur-2`}
        >
          {status.replace("_", " ")}
        </div>
      )}
    </div>
  );
};

export default EmptyRunners;
