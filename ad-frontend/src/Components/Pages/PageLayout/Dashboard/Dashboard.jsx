import { Fragment, useState } from "react";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Breadcrumbs } from "../../../../AbstractElements";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "reactstrap";
import WidgetsWrapper from "./WidgetsWraper";
import RecentOrders from "./RecentOrders";
import GreetingCard from "./GreetingCard";
import { useSelector } from "react-redux";
import { layerRoles, ManagerRoles } from "../../../../Constant";

const Dashboard = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const options = [
    { value: 1, label: "Today" },
    { value: 7, label: "Monday to Monday" },
    { value: 30, label: "Last 30 Days" },
    { value: 99, label: "All Time" },
    { value: 0, label: "Last Settlement" }
  ];
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[4]);

  const adminData = useSelector((state) => state.Login.userData);

  const handleSelectChange = (event) => {
    const selectedValue = options.find(
      (option) => option?.value === parseInt(event?.target?.value)
    );
    setSelectedOption(selectedValue);
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("DASHBOARD")}
        title={title?.title}
        parent={title?.parent}
      />
      <Container fluid={true}>
        <GreetingCard />
        {/* {(adminData?.role === layerRoles?.DIRECTOR ||
          Object.values(ManagerRoles).includes(adminData?.role)) && ( */}
          <Row className="widget-grid justify-content-end">
            <Col md={3} lg={2} className="d-flex p-0 pb-2">
              <select
                value={selectedOption?.value}
                onChange={handleSelectChange}
                disabled={dashboardLoading}
                className={`form-select w-100 m-1 me-3 ${
                  dashboardLoading ? "disabled-select" : ""
                }`}
                style={{
                  padding: "7px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  cursor: dashboardLoading ? "not-allowed" : "pointer",
                  transition: "all 100ms ease-in-out",
                  opacity: dashboardLoading ? 0.6 : 1,
                }}
              >
                {options.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        {/* // )} */}
        <Row>
          <RecentOrders dashboardLoading={dashboardLoading} />
          <WidgetsWrapper
            selectedOption={selectedOption?.value}
            setDashboardLoading={setDashboardLoading}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
