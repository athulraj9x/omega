import React, { Fragment, useEffect, useState } from "react";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "../../../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Media,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import ToggleButton from "../../../Common/Component/Buttons/ToggleButton";
import DeleteButton from "../../../Common/Component/Buttons/DeleteButton";
import { useDispatch } from "react-redux";
import {
  deleteSlider,
  getBanner,
  updateSlider,
} from "../../../../redux/action";
import { useSelector } from "react-redux";

const ListBanner = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [bannerData, setBannerData] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false);
  const FetchWhiteLabelData = useSelector((state) => state?.FetchWhiteLabelData);
  const [keys, setKeys] = useState(null)

  useEffect(() => {
    if (!FetchWhiteLabelData?.loading){
      if(!FetchWhiteLabelData?.data){
        setKeys('betxfair');
      }
      else{
        setKeys(FetchWhiteLabelData?.data?.data?.whitelabelIds)
      }
    };
  

  }, [FetchWhiteLabelData]); 
  
  useEffect(() => {
    if(keys){
      const payload = {
        device: mobile ? "mobile" : "desktop",
        keys
      }
      dispatch(
        getBanner({
          payload,
          callback: (data) => {
            setBannerData(data);
          },
        })
      );
    }
  }, [mobile, keys]);

  const handleToggle = (status, id) => {
    let index = bannerData.findIndex((data) => data._id === id);
    const data = { status: status === "1" ? "0" : "1", id: id };
    dispatch(
      updateSlider({
        data,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            const updatedData = [...bannerData];
            updatedData[index] = {
              ...bannerData[index],
              status: status === "1" ? "0" : "1",
            };
            setBannerData(updatedData);
          }
        },
      })
    );
  };

  const handleToggleChange = () => {
    setMobile((prevMobile) => !prevMobile);
  };

  const handleDelete = (id) => {
    setDeleteAction(true);
    dispatch(
      deleteSlider({
        id,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            const updatedData = bannerData.filter((data) => data._id !== id);
            setBannerData(updatedData);
            setDeleteAction(false);
          } else {
            setDeleteAction(false);
          }
        },
      })
    );
  };
  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("HOME_SLIDER_LIST")}
        title={title?.title}
        parent={title?.parent}
      />

      <Container fluid={true}>
        {/* {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )} */}
        <Card>
          <CardHeader className="py-3 d-flex justify-content-end">
            <Row className="g-2 align-items-center ">
              <Col className="ml-2">
                <Media
                  body
                  className={`${"text-left"} d-flex align-items-center justify-content-start gap-2`}
                >
                  <span
                    onClick={(e) => handleToggleChange(e)}
                    style={{ cursor: "pointer" }}
                    className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                  >
                    <span className="fw-semibold fs-6 d-flex align-items-center">
                      {mobile ? t("MOBILE") : t("DESKTOP")}
                    </span>
                    <Label className={`m-0 ${"switch"}`}>
                      <input
                        type="checkbox"
                        checked={mobile}
                        onChange={handleToggleChange}
                      />
                      <span
                        className="switch-state"
                        style={{
                          backgroundColor: mobile ? "limegreen" : "lightgray",
                        }}
                      />
                    </Label>
                  </span>
                </Media>
              </Col>
              <Col>
                <Link
                  to={"/home-sliders/add-slider"}
                  className="d-flex align-items-center "
                >
                  <Button color="success">{t("ADD_SLIDER")}</Button>
                </Link>
              </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0">
            <div className="overflow-auto" style={{ height: "62vh" }}>
              <table className="table table-bordered table-hover ">
                <thead
                  className="table-light bg-light sticky-top "
                  style={{ zIndex: 1 }}
                >
                  <tr className="text-center m-0" style={{ border: "none " }}>
                    <th className="text-nowrap ">{t("ORDER")}</th>
                    <th className="text-nowrap ">{t("BANNER")}</th>
                    <th className="text-nowrap ">{t("STATUS")}</th>
                    <th className="text-nowrap ">{t("ACTION")}</th>
                  </tr>
                </thead>
                <tbody>
                  {bannerData?.map((data, index) => {
                    return (
                      <tr className="text-center align-middle py-2" key={index}>
                        <td className="align-middle py-2">{index + 1}</td>
                        <td>
                          <img
                            style={{ width: "275px", height: "100px" }}
                            src={data?.image}
                            alt="banner"
                          />
                        </td>

                        <td className="align-middle py-1 ">
                          <div className="d-flex justify-content-center">
                            <ToggleButton
                              toggleAction={() =>
                                handleToggle(data?.status, data?._id)
                              }
                              // actionId={"1"}
                              toggle={data?.status}
                              permission={true}
                              indexOne={data?._id}
                            />
                          </div>
                        </td>
                        <td className="align-middle py-1  ">
                          <div className="d-flex justify-content-center">
                            <DeleteButton
                              clickAction={handleDelete}
                              actionId={data?._id}
                              actionType={"slider"}
                              disabled={deleteAction}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* </CardBody> */}
              </table>
              {bannerData?.length === 0 && (
                <div className="d-flex justify-content-center">
                  <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                </div>
              )}
            </div>
          </CardBody>
          {/* <CardFooter className="py-3 text-center text-md-start">
            <div className="pagination-bdy">
              <PaginationRow rowCount={rowCount} setRowCount={setRowCount} />
              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </CardFooter> */}
        </Card>
      </Container>
    </Fragment>
  );
};

export default ListBanner;
