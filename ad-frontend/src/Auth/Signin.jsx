import React from "react";
import { Container, Row, Col, TabContent, TabPane } from "reactstrap";
import LoginTab from "./Tabs/LoginTab";

const Logins = () => {
  return (
    <Container fluid={true} className="p-0 login-page">
      <Row>
        <Col xs="12">
          <div className="login-card">
            <div className="login-main login-tab">
              <TabContent activeTab={"simpleLogin"} className="content-login">
                <TabPane className="fade show" tabId={"simpleLogin"}>
                  <LoginTab />
                </TabPane>
                <TabPane className="fade show" tabId="auth0"></TabPane>
              </TabContent>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Logins;
