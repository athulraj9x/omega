import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import H3 from "../Headings/H3Element";
import H4 from "../Headings/H3Element";
import { useNavigate } from 'react-router-dom';
import SvgIcon from "../../Components/Common/Component/SvgIcon";

const BreadcrumbsWithName = (props) => {
  const navigate = useNavigate(); 
  const handleNavigate = () => {
    // Use navigate when 'crypto' is true and send some state payload
    const eventName= props?.crypto?.payload?.event?.event?.name.trim().replace(/\s+/g, '')
    navigate(`/reports/analysis/${eventName}`,{
      state: {
        ...props.crypto.payload 
     },
   });
  };
  
  return (
    <Fragment>
      <Container fluid={true} className={props?.marginTop? "mt-5" :""}>
        <div className="page-title" >
          <Row>
            <Col
              xs="6"
              className="d-flex algn-items-center flex-wrap text-nowrap gap-2"
            >
              <H3>{props.mainTitle}</H3>
              <span>
                {!props?.route === false ? (
                  <H4 className="breadcrumb-item active">
                    {"Of"} {props.title.name}
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
                      to={"/" + props.parent.link}
                    >
                      {props.parent.name}
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                {props.subParent ? (
                  <li className="breadcrumb-item">
                      {props.crypto ? (
                        <button
                          onClick={handleNavigate}  // Navigate when clicked
                          style={{ background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'none' }}
                        >
                          {props.subParent.name}
                        </button>
                      ) :  (
                    <Link to={"/" + props.subParent.link}>{props.subParent.name}</Link>
                    )}
                  </li>
                ) : (
                  ""
                )}
                <li className="breadcrumb-item active">{props.title.name}</li>
              </ol>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default BreadcrumbsWithName;