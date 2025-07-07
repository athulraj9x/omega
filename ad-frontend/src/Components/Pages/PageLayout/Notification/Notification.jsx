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
} from "reactstrap";
import {
  notifyWarning,
  notifySuccess,
  notifyDanger,
} from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  postNotification,
  getAllusers,
  deleteNotification,
  editNotification,
} from "../../../../redux/action";
import { socket } from "../../../../context/socketContext";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const Notification = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState();
  const [isFormAvailable, setIsFormAvailable] = useState(true);
  const [allusers, setAllusers] = useState([]);
  const [allNotification, setAllNotification] = useState([]);
  const [isAddNotification, setIsAddNotification] = useState(false);
  const [isEdit, setEditActive] = useState(false);
  const [editValues, setEditValues] = useState({});

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      message: "",
      user: "",
      status: "",
    },
  });

  function finduserName(userId) {
    const userName = allusers?.allusers?.filter(
      (users) => users?._id == userId
    );
    if (userName?.length) return userName[0].username;
    else return "General";
  }

  function getData() {
    dispatch(
      getAllusers({
        callback: (data) => {
          if (data?.meta?.code === 200) {
            setAllusers(data?.data);
            setAllNotification(data?.data?.allNotification);
          }
        },
      })
    );
  }

  function deleteNotificationId(id) {
    dispatch(
      deleteNotification({
        id,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            socket.emit("notificationadded");
            notifySuccess("Notification deleted");
            getData();
          } else {
            notifyWarning("Some thing went wrong");
          }
        },
      })
    );
  }

  function handleClear() {
    setEditActive(false);
    setIsAddNotification(false);
    setEditValues({});
    reset();
  }

  function editNotifications(id) {
    setEditActive(true);
    setIsAddNotification(true);
    const notificationToEdit = allNotification?.filter(
      (notification) => notification?._id === id
    )[0];
    setEditValues(notificationToEdit);
    reset({
      message: notificationToEdit.message,
      user: notificationToEdit.userId || "",
      status: notificationToEdit.status ? "true" : "false",
    });
  }

  const onSubmit = (data, e) => {
    if(!isEdit && !data?.message){
      notifyWarning("Notification cannot be empty");
      return;
    }
    let userId = "";
    if (data?.user) {
      userId = data?.user;
    }
    if (isEdit) {
      if (!data?.message) {
        notifyWarning("Notification cannot be empty");
        return;
      }
      if (!data?.status) {
        notifyWarning("Select the status");
        return;
      }
      data._id = editValues._id;
      dispatch(
        editNotification({
          data,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              notifySuccess("Notification Submitted");
              if (userId) {
                socket.emit("notificationadded", userId);
              } else {
                socket.emit("notificationadded");
              }
              setEditActive(false);
              setIsAddNotification(false);
              getData();
            } else {
              notifyWarning("Internal server error");
            }
          },
        })
      );
    } else {
      dispatch(
        postNotification({
          data,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              getData();
              setIsAddNotification(false);
              notifySuccess("Notification added successfully");
              if (userId) {
                socket.emit("notificationadded", userId);
              } else {
                socket.emit("notificationadded");
              }
            } else {
              notifyWarning("Internal server error");
            }
          },
        })
      );
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("Notification")}
        title={title?.title}
        parent={title?.parent}
        className="ms-2"
      />

      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              {!isAddNotification ? (
                <>
                  <div className="mb-2">
                    <Button
                      className="mx-2"
                      form="create"
                      type="submit"
                      color="success"
                      onClick={() => {
                        setIsAddNotification(true);
                        reset({
                          message: "",
                          user: "",
                          status: "",
                        });
                      }}
                    >
                      {isEdit ? "Edit Notification" : "Add Notification"}
                    </Button>
                  </div>
                  <Row>
                    <Col>
                      <div className="overflow-auto ">
                        <table className="table table-bordered table-hover ">
                          <thead className="table-light bg-light sticky-top ">
                            <tr>
                              <th
                                className="text-left m-0"
                                style={{ border: "none " }}
                              >
                                Message
                              </th>
                              <th
                                className="text-left m-0"
                                style={{ border: "none " }}
                              >
                                Status
                              </th>
                              <th
                                className="text-left m-0"
                                style={{ border: "none " }}
                              >
                                Custom Notification
                              </th>
                              <th
                                className="text-left m-0"
                                style={{ border: "none " }}
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {allNotification?.map((notification, index) => {
                              return (
                                <tr
                                  className="text-left align-middle py-2"
                                  key={index}
                                >
                                  <td className="align-middle py-2">
                                    {notification.message}
                                  </td>
                                  <td className="align-middle py-2">
                                    {notification.status
                                      ? "Active"
                                      : "Inactive"}
                                  </td>
                                  <td className="align-middle py-2">
                                    {finduserName(notification?.userId)}
                                  </td>
                                  <td className="align-middle py-2 flex-d">
                                    <span className="mr-2 cursor-pointer">
                                      <CiEdit
                                        onClick={() =>
                                          editNotifications(notification?._id)
                                        }
                                        style={{ color: "blue" }}
                                      />
                                    </span>
                                    <span
                                      className="cursor-pointer"
                                      onClick={() =>
                                        deleteNotificationId(notification?._id)
                                      }
                                    >
                                      <MdDelete style={{ color: "red", marginLeft :"10px" }} />
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : null}
            </CardBody>
            {isAddNotification ? (
              <CardBody>
                <Form
                  className="needs-validation"
                  noValidate=""
                  id="create"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Row className="d-flex flex-col flex-wrap">
                    <h3 className="mb-4 fs-5">Add Notification</h3>
                    <Col md="4 mb-3">
                      <Label htmlFor="validationCustom01">Message</Label>
                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="form-control"
                            value={field.value}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        )}
                      />
                      <span className="text-danger">
                        {errors.sportId && t("FIELD_REQUIRED")}
                      </span>
                    </Col>
                    <Col md="4" className="mb-3">
                      <Label htmlFor="staticSportSelect">
                        Select User (Optional)
                      </Label>
                      <Controller
                        name="user"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <select
                            id="staticSportSelect"
                            className="form-control"
                            {...field}
                          >
                            <option value="">{t("SELECT_DOT")}</option>
                            {allusers?.allusers?.map((option) => (
                              <option key={option?._id} value={option._id}>
                                {t(option.username)}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      <span className="text-danger">
                        {errors.user && t("FIELD_REQUIRED")}
                      </span>
                    </Col>
                    {isEdit ? (
                      <Col md="4" className="mb-3">
                        <Label htmlFor="staticSportSelect">status</Label>
                        <Controller
                          name="status"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <select
                              id="staticSportSelect"
                              className="form-control"
                              isSearchable={true}
                              {...field}
                            >
                              <option value="">{t("SELECT_DOT")}</option>
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          )}
                        />
                        <span className="text-danger">
                          {errors.status && t("FIELD_REQUIRED")}
                        </span>
                      </Col>
                    ) : null}
                  </Row>
                </Form>
                {isFormAvailable && (
                  <>
                    <CardFooter className="py-3 text-center text-md-start">
                      <Button
                        className="mx-2"
                        form="create"
                        type="submit"
                        color="success"
                      >
                        {t("SUBMIT")}
                      </Button>
                      <button
                        onClick={() => handleClear()}
                        className="btn"
                        style={{ backgroundColor: "#CCC" }}
                      >
                        {t("RESET")}
                      </button>
                    </CardFooter>
                  </>
                )}
              </CardBody>
            ) : null}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Notification;
