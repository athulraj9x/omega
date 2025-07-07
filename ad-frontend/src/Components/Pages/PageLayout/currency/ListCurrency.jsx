import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Label, Media } from "reactstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Breadcrumbs } from "../../../../AbstractElements";
import { getCurrency } from "../../../../redux/action/currency/getCurrencyAction";
import usePageTitle from "../../../../Hooks/usePageTitle";
import Loader from "../../../../Layout/Loader";
import { changeBetfairCurrency, updateCurrencyRequest } from "../../../../redux/action";
import { HiPencilAlt, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { notifySuccess } from "../../../../utils/helper";
import ToggleButton from "../../../Common/Component/Buttons/ToggleButton";

const ListCurrency = () => {
  const dispatch = useDispatch();
  const title = usePageTitle();
  const { t } = useTranslation();

  //Accessing Currencies from global Redux state
  const currency = useSelector((state) => state?.GetCurrency?.currencyData);
  const loading = useSelector((state) => state?.GetCurrency?.loading);

  //editables

  const [editIndex, setEditIndex] = useState(-1);
  const [editId, setEditId] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [betFair, setBetFair] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);

  const handleEdit = (index) => {
    const data = currencyData[index];
    setEditIndex(index);
    setEditId(data?._id);
    setEditedName(data?.name);
    setEditedCode(data?.code);
    setEditedValue(data?.value);
  };

  const handleSave = () => {
    if (
      editId !== null &&
      (editedName !== currencyData[editIndex]?.name ||
        editedCode !== currencyData[editIndex]?.code ||
        editedValue !== currencyData[editIndex]?.value)
    ) {
      let data = {
        _id: editId,
        name: editedName,
        code: editedCode,
        value: editedValue,
      };
      dispatch(
        updateCurrencyRequest({
          data,
          callback: () => {
            // Handle callback if needed
          },
        })
      );
    } else {
      notifySuccess("No changes detected.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    setEditIndex(-1);
  };

  useEffect(() => {
    dispatch(getCurrency());
  }, []);

  useEffect(() => {
    setCurrencyData(currency);
  }, [currency]);

  return (
    <Fragment>
      <Breadcrumbs mainTitle={t("CURRENCY_LIST")} title={title?.title} parent={title?.parent} />

      <Container fluid={true}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="p-0">
                <div className="overflow-auto" style={{ height: "80vh" }}>
                  <table responsive className="table table-bordered table-hover">
                    <thead className="table-light sticky-top" style={{ zIndex: "0" }}>
                      <tr className="text-left">
                        <th>{t("NAME")}</th>
                        <th>{t("CODE")}</th>
                        <th>{t("VALUE")}</th>
                        <th>{t("ACTIONS")}</th>
                        {betFair && <th>{t("SELECTED")}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {currencyData !== null &&
                        currencyData?.map((data, index) => {
                          return (
                            <tr className="text-left " key={index}>
                              <td>
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                  />
                                ) : (
                                  data?.name
                                )}
                              </td>
                              <td>
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editedCode}
                                    onChange={(e) => setEditedCode(e.target.value)}
                                  />
                                ) : (
                                  data?.code
                                )}
                              </td>
                              <td>
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editedValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                  />
                                ) : (
                                  data?.value
                                )}
                              </td>
                              <td>
                                {editIndex === index ? (
                                  <>
                                    <div className="d-flex align-items-center gap-2">
                                      <HiCheckCircle
                                        onClick={handleSave}
                                        className={`btn  ${"align-text-top fs-2 currency-edit bg-light rounded"}`}
                                      />
                                      <HiXCircle
                                        onClick={() => setEditIndex(-1)}
                                        className={`btn  ${"align-text-top fs-2 currency-edit-cross bg-light rounded"}`}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <HiPencilAlt
                                    className={`btn ${"align-text-top fs-2 currency-edit bg-light rounded"}`}
                                    onClick={() => handleEdit(index)}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {loading === false && currencyData?.length === 0 && (
                    <div className="d-flex justify-content-center">
                      <p className="p-3">{t("NO_DATA_AVAILABLE")}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ListCurrency;
