import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import H3 from "../Headings/H3Element";
import H4 from "../Headings/H3Element";
import SvgIcon from "../../Components/Common/Component/SvgIcon";

const Breadcrumbs = (props) => {
  
  return (
    <Fragment>
      <Container fluid={true}>
        <div className="page-title">
          <Row>
            <Col
              xs="6"
              className="d-flex algn-items-center flex-wrap text-nowrap gap-2"
            >
              <H3>{props.mainTitle}</H3>
              <span>
                {!props?.route === false ? (
                  <H4 className="breadcrumb-item active">
                    {"Of"} {props.title}
                  </H4>
                ) : (
                  ""
                )}
              </span>
            </Col>
            <Col xs="6">
              <ol className="breadcrumb">
                <li className="breadcrumb-item ">
                  <Link to={`/dashboard`}>
                    <SvgIcon className="text-dark" iconId="stroke-dashboard" />
                  </Link>
                </li>
                {props.parent ? (
                  <li className="breadcrumb-item">
                    <Link
                      to={"/" + props.parent.replace(/\s+/g, "-").toLowerCase()}
                    >
                      {props.parent}
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                {props.subParent ? (
                  <li className="breadcrumb-item">
                    <Link to={"/" + props.subParent}>{props.subParent}</Link>
                  </li>
                ) : (
                  ""
                )}
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default Breadcrumbs;
