/** @format */

import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Row,
} from "reactstrap";
import ToggleButton from "../../../Common/Component/Buttons/ToggleButton";
import DeleteButton from "../../../Common/Component/Buttons/DeleteButton";
import { Btn, H5 } from "../../../../AbstractElements";
import { ACTIONTYPES, SportPriority } from "../../../../Constant";

import {
  getLocalStorageItem,
  notifySuccess,
  notifyWarning,
} from "../../../../utils/helper";
import { Controller } from "react-hook-form";
import { control } from "leaflet";
import { CiEdit } from "react-icons/ci";
import { BsCheckLg } from "react-icons/bs";
import EditableInputField from "../../../Common/Component/CommonWidgets/EditableInputField";
import EditableRadarIdField from "../../../Common/Component/CommonWidgets/EditableRadarIdField";
import EditableChannelCodeField from "../../../Common/Component/CommonWidgets/EditableChannelCodeField";
import { useDispatch } from "react-redux";
import {
  addOddLimit,
  deleteMultipleEvents,
  getLeagueEventData,
  getManageEventData,
  getPriorityEventMarketAction,
  searchBasedOnEvents,
  setPriorityLineMarket,
  updateRadarId,
  updateChannelCode,
} from "../../../../redux/action";
import { toast } from "react-toastify";
import "./style.css";
import CloseButton from "react-bootstrap/CloseButton";
import { HorseRelatedSportsCode } from "../../../../utils/constants";

const ManagementSection = ({
  selectedSport,
  eventDatas,
  handleToggle,
  handleDelete,
  openEvent,
  openLeague,
  setOpenEvent,
  setOpenLeague,
  setleagueData,
  leagueData,
  dataDeleted,
  setDataDeleted,
  setAllEventDatas,
  handlePageChange,
  setSearchTerm,
  searchTerm,
  currentPage,
  handleSportClick,
  setFullScreenLoader
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [role, setRole] = useState(1);
  const [openMarkket, setOpenMarket] = useState(null);
  const [editStatus, setEditStatus] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);
  const [isEditableRadarId, setIsEditableRadarId] = useState(false);
  const [isEditableChannel, setIsEditableChannel] = useState(false);
  const [isCheck, setIsCheck] = useState(true);
  const [eventData, setEventData] = useState([]);

  const [currentCheckedItems, setCurrentCheckedItems] = useState([]);
  const [currentEventId, setCurrentEventId] = useState("");
  const [checkboxDisabled, setcheckboxDisabled] = useState(false);
  const [dataReceived, setdataReceived] = useState();

  const [currentSports, setCurrentSports] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const [checkedCount, setCheckedCount] = useState(0);
  const [leagueDataLoader, setLeagueDataLoader] = useState({
    index: null,
    loading: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousSportsData, setPreviousSportsData] = useState([]);
  const [closeButtonRemove, setCloseButtonRemove] = useState(null);
  const [currentSelectedSports, setCurrentSelectedSports] = useState(null);
  const [rotatingRows, setRotatingRows] = useState({});
  const [countrySelectedIndex, setCountrySelectedIndex] = useState(null);


  useEffect(() => {
    setCurrentSelectedSports(selectedSport);
    setSearchTerm("");
  }, [selectedSport]);
  useEffect(() => {
    setleagueData([]);
  }, [openLeague]);

  useEffect(() => {
    let sortedData;
    if (HorseRelatedSportsCode.some(item => item.sportsCode === eventDatas?.sportsCode)) {
      sortedData = eventDatas?.countries;
    } else {
      sortedData = eventDatas?.leagues;
    }
    setEventData(sortedData);
    // handleMessageFromChild(dataReceived);
  }, [eventDatas, dataReceived, checkboxDisabled, currentCheckedItems]);

  const setLineMarketPriorityAPI = (marketId, eventId) => {
    if (marketId && eventId) {
      dispatch(
        setPriorityLineMarket({
          data: { marketId, eventId },
          callback: (data) => {
            setdataReceived(data);
            setCurrentCheckedItems(data);
          },
        })
      );
    }
  };

  const handlePriorityLineMarket = async (e, marketId, marketBoolean) => {
    let checked = e.target.checked;
    if (checked) {
      setCheckedCount((prevCount) => ++prevCount);
    } else {
      setCheckedCount((prevCount) => --prevCount);
    }

    if (marketBoolean) {
      setcheckboxDisabled(false);
      setLineMarketPriorityAPI(marketId, currentEventId);
      // handleMessageFromChild(marketId);
      return;
    } else {
      if (currentCheckedItems.length > 10) {
        notifyWarning("You can only select 10 items. Please remove one.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      } else {
        setcheckboxDisabled(true);
        setLineMarketPriorityAPI(marketId, currentEventId);
        // getPriorityBasedOnEvent(currentEventId);
        setcheckboxDisabled(false);
      }
    }
  };

  useEffect(() => {
    setOpenLeague(openIndex);
    let data = {
      id: currentSports,
      currentPage: 1,
    };
    if (data?.id !== null) {
      dispatch(
        getLeagueEventData({
          data: data,
          callback: (response) => {
            setleagueData(response);
          },
        })
      );
    }
  }, [dataDeleted]);

  let roles = JSON.parse(getLocalStorageItem("userData"));
  useEffect(() => {
    setRole(roles?.role);
  }, [roles]);

  const getPriorityBasedOnEvent = (eventId) => {
    if (eventId) {
      dispatch(
        getPriorityEventMarketAction({
          data: eventId,
          callback: (data) => {
            if (data) {
              setCurrentCheckedItems(data);
              setCheckedCount(data?.length);
              // handleMessageFromChild(data);
              return;
            }
          },
        })
      );
    }
  };

  //Toggle Leagues Section
  const toggleLeaguesAccordion = (leagueId, index, sportsCode = null) => {
    setOpenLeague(null);
    setOpenLeague(false);
    setCurrentSports(leagueId?._id);
    setOpenIndex(index);
    setLeagueDataLoader({
      index: index,
      loading: true,
    });
    if (openLeague === index) {
      setOpenLeague(null);
      setLeagueDataLoader({
        index: index,
        loading: false,
      });
    } else {
      setOpenLeague(index);
      let data = {
        id: leagueId?._id,
        currentPage: 1,
        sportsCode: sportsCode,
      };
      dispatch(
        getLeagueEventData({
          data: data,
          callback: (response) => {
            setleagueData(response);
            setLeagueDataLoader({
              index: index,
              loading: false,
            });
          },
        })
      );
    }
  };
  //Toggle Events Section
  const toggleEventsAccordion = (index, eventId) => {
    if (eventId) {
      setCurrentEventId(eventId);
      getPriorityBasedOnEvent(eventId);
    }
    if (openEvent === index) {
      setOpenEvent(null);
    } else {
      setOpenEvent(index);
    }
  };

  //Toggle Markets Section
  const toggleMarketsAccordion = (index) => {
    if (openMarkket === index) {
      setOpenMarket(null);
    } else {
      setOpenMarket(index);
    }
  };

  const handleCheckboxChange = (id, data, league, index) => {
    const isSelected = selectedIds.includes(id);
    let updatedSelectedIds = [];

    if (isSelected) {
      updatedSelectedIds = selectedIds.filter(
        (selectedId) => selectedId !== id
      );
    } else {
      updatedSelectedIds = [...selectedIds, id];
    }

    setSelectedIds(updatedSelectedIds);
    if (updatedSelectedIds.length === data.length) {
      setSelectAll(league);
    } else {
      setSelectAll("");
    }
  };

  const handleSelectAllChange = (option, id) => {
    const isSelected = selectAll.includes(id);

    if (isSelected) {
      // updatedSelectedIds = selectAll.filter((selectedId) => selectedId !== id);
      setSelectedIds([]);
      setSelectAll([]);
    } else {
      const allIds = option.map((item) => item._id);
      setSelectedIds(allIds);
      setSelectAll(id);
    }
  };

  const handleDeleteMultiple = () => {
    setActionSuccess(false);
    if (selectedIds?.length > 0) {
      dispatch(
        deleteMultipleEvents({
          ids: selectedIds,
          callback: (data) => {
            if (data?.code === 200) {
              const payload = {
                data: {
                  id: selectedSport?.sportId,
                }
              }
              dispatch(
                getManageEventData(payload)
              );
              setDataDeleted(Date.now());
              setSelectAll("");
              setSelectedIds([]);
            }
          },
        })
      );
    } else {
      notifyWarning("Please select events to proceed the action.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const handleSubmit = (id, value) => {
    dispatch(
      addOddLimit({
        marketId: id,
        oddLimit: value,
        callback: () => {
          setEditStatus(false);
        },
      })
    );
  };

  const handleSubmitRadarId = (id, value) => {
    dispatch(
      updateRadarId({
        eventId: id,
        raderId: value,
        callback: () => {
          setIsCheck(true);
          setIsEditableRadarId(false);
        },
      })
    );
  };

  const handleSubmitChannelCode = (id, value) => {
    dispatch(
      updateChannelCode({
        eventId: id,
        channelCode: value,
        callback: () => {
          setIsCheck(true);
          setIsEditableChannel(false);
        },
      })
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== "") {
        fetchSearchResults(searchTerm);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchSearchResults = async (query) => {
    if (!query) {
      closeButtonVisibility();
      setPreviousSportsData(eventDatas);
      return;
    }
    try {
      closeButtonVisibility(true);
      setLoading(true);
      setError(null);
      const data = {
        query: query,
        sportId: selectedSport.sportId,
      };
      dispatch(
        searchBasedOnEvents({
          data: data,
          callback: (response) => {
            setPreviousSportsData(eventDatas);
            if (response?.data === null) {
              setError("Error fetching data");
            }
            setAllEventDatas(response?.data);
          },
        })
      );
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const cancelSearchResults = () => {
    setSearchTerm("");
    handlePageChange(currentPage);
    // setAllEventDatas(previousSportsData)
  };

  const closeButtonVisibility = (status) => {
    setCloseButtonRemove(status);
  };


  const selectCountry = (index) => {
    if (index === countrySelectedIndex) {
      setCountrySelectedIndex(null)
    } else {
      setCountrySelectedIndex(index)
    }
  }

  const handleRadarIdClick = (e, leagueId, index) => {
    setFullScreenLoader(true)
    e.preventDefault();
    e.stopPropagation();
    setRotatingRows((prevRotatingRows) => ({
      ...prevRotatingRows,
      [index]: !prevRotatingRows[index],
    }));

    dispatch(
      updateRadarId({
        league_id: leagueId,
        callback: (data)=>{
          setFullScreenLoader(false)
        }
      })
    );

  };

  useEffect(() => { }, [actionSuccess, dataReceived]);
  return (
    <Fragment>
      <Accordion toggle={() => { }} open={"false"}>
        <Card>
          {eventDatas?.length === 0 ? (
            ""
          ) : (
            <CardHeader className="event-card-header">
              <H5>{`${t("MANAGE")} ${selectedSport?.name}`}</H5>
              <div className="container-fluid mt-3">
                <div className="row">
                  <div className="col-3 p-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border rounded"
                        value={searchTerm}
                        placeholder="Search Terms"
                        onChange={handleSearch}
                      />
                      {closeButtonRemove && (
                        <div className="input-group-append">
                          <CloseButton
                            className="btn p-1 mt-1"
                            aria-label="Close"
                            onClick={cancelSearchResults}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                  </div>
                </div>
              </div>
            </CardHeader>
          )}
          <CardBody className="event-card-body">
            {selectedIds?.length > 0 && (
              <div className="d-flex justify-content-end mb-2">
                <DeleteButton
                  clickAction={handleDeleteMultiple}
                  actionId={selectedIds}
                  actionType={ACTIONTYPES?.league}
                  multi={true}
                  actionSuccess={actionSuccess}
                  disabled={selectedIds?.length > 0 ? "" : "2"}
                  type="Events"
                />
              </div>
            )}

            <div>
              {eventData?.length === 0 ? (
                <div className="text-center py-4">{t("NO_DATA_AVAILABLE")}</div>
              ) : (
                <div className="default-according" id="accordion">

                  {HorseRelatedSportsCode.some(item => item.sportsCode === eventDatas?.sportsCode) ? (
                    <>
                      {eventDatas?.countries.map((country, countryIndex) => {
                        return (
                          country.status !== "2" && (
                            <Card key={countryIndex}>
                              <CardHeader className="">
                                <H5
                                  attrH5={{
                                    className: `mb-0 leagues-h5 ${openLeague === countryIndex
                                      ? "accordian-radius-open"
                                      : "accordian-radius-close"
                                      }`,
                                  }}
                                >
                                  <Btn
                                    attrBtn={{
                                      as: Card.Header,
                                      className: `btn btn-link accordian-btn`,
                                      color: "default",
                                      // onClick: () => toggleLeaguesAccordion(country, countryIndex),
                                    }}
                                  >
                                    <Row className="align-items-center py-1">
                                      <Col onClick={() => selectCountry(countryIndex)} className="h6 m-0 d-flex gap-2">
                                        <div>
                                          <label
                                            className="checkbox-containers"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              className="hidden-checkboxx"
                                              // onChange={() => handleSelectAllChange(country?.events, country?._id) }
                                              checked={selectAll === country?._id}
                                            />
                                            <div className="custom-checkboxx">
                                              <svg className="checkmarkx" viewBox="0 0 24 24">
                                                <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                              </svg>
                                            </div>
                                          </label>
                                        </div>
                                        <span>{country?.name}</span>
                                      </Col>

                                      <Col className="d-flex align-items-center justify-content-center gap-3 col-md-4 col-sm-3 p-1">
                                        <ToggleButton
                                          toggleAction={handleToggle}
                                          actionId={country?._id}
                                          actionType={ACTIONTYPES.country}
                                          toggle={country?.status}
                                          // indexOne={indexOne}
                                          sportsCode={eventDatas?.sportsCode}
                                        />
                                        {role == 1 && (
                                          <DeleteButton
                                            clickAction={handleDelete}
                                            actionId={country?._id}
                                            actionType={ACTIONTYPES.country}
                                            // indexOne={indexOne}
                                            disabled={country?.status}
                                            sportsCode={eventDatas?.sportsCode}
                                            type="COUNTRY"
                                          />
                                        )}
                                      </Col>
                                    </Row>


                                    {countrySelectedIndex === countryIndex && (
                                      <H5
                                        attrH5={{
                                          className: `mb-0 leagues-h5 ${countrySelectedIndex === countryIndex
                                            ? "accordian-radius-open"
                                            : "accordian-radius-close"
                                            }`,
                                        }}
                                      >
                                        <Btn
                                          attrBtn={{
                                            as: Card.Header,
                                            className: `btn btn-link accordian-btn`,
                                            color: "default",
                                            // onClick: () => toggleLeaguesAccordion(country, countryIndex),
                                          }}
                                        >

                                          <>
                                            {country?.Venues.map((league, indexOne) => {

                                              return (
                                                league.status !== "2" && (
                                                  <>
                                                    <Card key={indexOne}>
                                                      <CardHeader className="">
                                                        <H5
                                                          attrH5={{
                                                            className: `mb-0 leagues-h5 ${openLeague === indexOne
                                                              ? "accordian-radius-open"
                                                              : "accordian-radius-close"
                                                              }`,
                                                          }}
                                                        >
                                                          <Btn
                                                            attrBtn={{
                                                              as: Card.Header,
                                                              className: `btn btn-link accordian-btn`,
                                                              color: "default",
                                                              onClick: () =>
                                                                toggleLeaguesAccordion(league, indexOne, eventDatas?.sportsCode),
                                                            }}
                                                          >
                                                            <Row className="align-items-center py-1">
                                                              <Col className="h6 m-0 d-flex gap-2">
                                                                <div>
                                                                  {/* START  */}
                                                                  <label
                                                                    className="checkbox-containers"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                  >
                                                                    <input
                                                                      type="checkbox"
                                                                      className="hidden-checkboxx"
                                                                      // onClick={(e) => e.stopPropagation()}
                                                                      onChange={() =>
                                                                        handleSelectAllChange(
                                                                          league?.events,
                                                                          league?._id
                                                                        )
                                                                      }
                                                                      checked={selectAll === league?._id}
                                                                    />
                                                                    <div className="custom-checkboxx">
                                                                      <svg
                                                                        className="checkmarkx"
                                                                        viewBox="0 0 24 24"
                                                                      >
                                                                        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                                                      </svg>
                                                                    </div>
                                                                  </label>
                                                                  {/* /END */}
                                                                </div>
                                                                <span>{league?.name}</span>
                                                              </Col>

                                                              <Col className="d-flex align-items-center justify-content-center gap-3 col-md-4 col-sm-3 p-1">
                                                                <ToggleButton
                                                                  toggleAction={handleToggle}
                                                                  actionId={league?._id}
                                                                  actionType={ACTIONTYPES.league}
                                                                  toggle={league?.status}
                                                                  countryIndex={countryIndex}
                                                                  indexOne={indexOne}
                                                                  sportsCode={eventDatas?.sportsCode}
                                                                />
                                                                {role == 1 && (
                                                                  <DeleteButton
                                                                    clickAction={handleDelete}
                                                                    actionId={league?._id}
                                                                    actionType={ACTIONTYPES?.league}
                                                                    indexOne={indexOne}
                                                                    countryIndex={countryIndex}
                                                                    disabled={league?.status}
                                                                    sportsCode={eventDatas?.sportsCode}
                                                                    type="League"
                                                                  />
                                                                )}
                                                              </Col>
                                                            </Row>
                                                          </Btn>
                                                        </H5>
                                                      </CardHeader>

                                                      {leagueDataLoader?.loading &&
                                                        leagueDataLoader?.index === indexOne ? (
                                                        <button
                                                          className="btn btn-primary"
                                                          type="button"
                                                          disabled
                                                        >
                                                          <span
                                                            className="spinner-border spinner-border-sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                          ></span>
                                                          <span className="sr-only">Loading...</span>
                                                        </button>
                                                      ) : (
                                                        <Collapse
                                                          isOpen={openLeague === indexOne ? true : false}
                                                        >
                                                          <CardBody className="event-sub-card-body">
                                                            {leagueData?.events?.map((event, indexTwo) => {
                                                              const totalEvents = leagueData?.events.length
                                                              const filteringEvents = leagueData?.events?.filter(item => item.status === "2")
                                                              if (totalEvents === filteringEvents.length) {
                                                                <Card key={indexTwo}>
                                                                  "Existing Events are Deleted Or Not Available now"
                                                                  <CardHeader >
                                                                    <H5>
                                                                      {/* <Btn
                                                                          attrBtn={{
                                                                            as: Card.Header,
                                                                            className:
                                                                              "btn btn-link accordian-btn",
                                                                            color: "default",
                                                                          }}
                                                                        >
                                                                          <Row className="align-items-center py-1">
                                                                            <Col className="col-md-4 h6 m-0 d-flex gap-2">
                                                                            </Col>
                                                                          </Row>
                                                                        </Btn> */}
                                                                    </H5>
                                                                  </CardHeader>
                                                                </Card>
                                                              } else {
                                                                return (
                                                                  event?.status !== "2" && (
                                                                    <Card key={indexTwo}>
                                                                      <CardHeader className="">
                                                                        <H5
                                                                          attrH5={{
                                                                            className: `mb-0 events-h5  ${openEvent === indexTwo
                                                                              ? "accordian-radius-open"
                                                                              : "accordian-radius-close"
                                                                              }`,
                                                                          }}
                                                                        >
                                                                          <Btn
                                                                            attrBtn={{
                                                                              as: Card.Header,
                                                                              className:
                                                                                "btn btn-link accordian-btn",
                                                                              color: "default",
                                                                              onClick: () =>
                                                                                toggleEventsAccordion(
                                                                                  indexTwo,
                                                                                  event?._id
                                                                                ),
                                                                            }}
                                                                          >
                                                                            <Row className="align-items-center py-1">
                                                                              <Col className="col-md-4 h6 m-0 d-flex gap-2">
                                                                                <div>
                                                                                  {/* START  */}
                                                                                  <label
                                                                                    className="checkbox-containers"
                                                                                    onClick={(e) =>
                                                                                      e.stopPropagation()
                                                                                    }
                                                                                  >
                                                                                    <input
                                                                                      type="checkbox"
                                                                                      className="hidden-checkboxx"
                                                                                      checked={selectedIds.includes(
                                                                                        event?._id
                                                                                      )}
                                                                                      onChange={() =>
                                                                                        handleCheckboxChange(
                                                                                          event?._id,
                                                                                          league?.events,
                                                                                          league?._id
                                                                                        )
                                                                                      }
                                                                                    // onClick={(e) =>
                                                                                    //   e.stopPropagation()
                                                                                    // }
                                                                                    />
                                                                                    <div className="custom-checkboxx">
                                                                                      <svg
                                                                                        className="checkmarkx"
                                                                                        viewBox="0 0 24 24"
                                                                                      >
                                                                                        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                                                                      </svg>
                                                                                    </div>
                                                                                  </label>
                                                                                  {/* /END */}
                                                                                </div>
                                                                                <span>{event?.name}</span>
                                                                              </Col>
                                                                              <Col className="col-md-4 align-middle d-flex gap-5">
                                                                                <p
                                                                                  className="p-0 m-0 text-success h6 m-0"
                                                                                  style={{
                                                                                    fontSize: "14px",
                                                                                  }}
                                                                                >
                                                                                  {event?.date}
                                                                                </p>
                                                                                {role == 1 && (
                                                                                  <Col className="col-md-4 align-middle ms-5">
                                                                                    <EditableRadarIdField
                                                                                      isEditableRadarId={
                                                                                        isEditableRadarId
                                                                                      }
                                                                                      setIsEditableRadarId={
                                                                                        setIsEditableRadarId
                                                                                      }
                                                                                      isCheck={isCheck}
                                                                                      setIsCheck={
                                                                                        setIsCheck
                                                                                      }
                                                                                      radarId={
                                                                                        event?.raderId
                                                                                      }
                                                                                      handleSubmitRadarId={
                                                                                        handleSubmitRadarId
                                                                                      }
                                                                                      id={event?._id}
                                                                                      edit={editStatus}
                                                                                    />
                                                                                  </Col>
                                                                                )}
                                                                                {role == 1 && (
                                                                                  <Col className="col-md-4 align-middle ms-2">
                                                                                    <EditableChannelCodeField
                                                                                      isEditableChannel={
                                                                                        isEditableChannel
                                                                                      }
                                                                                      setIsEditableChannel={
                                                                                        setIsEditableChannel
                                                                                      }
                                                                                      isCheck={isCheck}
                                                                                      setIsCheck={
                                                                                        setIsCheck
                                                                                      }
                                                                                      channelCode={
                                                                                        event?.channelCode
                                                                                      }
                                                                                      handleSubmitChannelCode={
                                                                                        handleSubmitChannelCode
                                                                                      }
                                                                                      id={event?._id}
                                                                                      edit={editStatus}
                                                                                    />
                                                                                  </Col>
                                                                                )}
                                                                              </Col>
                                                                              <Col className="d-flex ms-auto align-items-center gap-3 col-md-3">
                                                                                <ToggleButton
                                                                                  toggleAction={
                                                                                    handleToggle
                                                                                  }
                                                                                  actionId={event?._id}
                                                                                  actionType={
                                                                                    ACTIONTYPES?.event
                                                                                  }
                                                                                  toggle={event?.status}
                                                                                  countryIndex={countryIndex}
                                                                                  indexOne={indexOne}
                                                                                  indexTwo={indexTwo}
                                                                                  sportsCode={eventDatas?.sportsCode}
                                                                                />
                                                                                {role == 1 && (
                                                                                  <DeleteButton
                                                                                    clickAction={
                                                                                      handleDelete
                                                                                    }
                                                                                    actionId={event?._id}
                                                                                    actionType={
                                                                                      ACTIONTYPES?.event
                                                                                    }

                                                                                    countryIndex={countryIndex}
                                                                                    indexOne={indexOne}
                                                                                    indexTwo={indexTwo}
                                                                                    type="Event"
                                                                                    sportsCode={eventDatas?.sportsCode}
                                                                                    disabled={
                                                                                      event?.status
                                                                                    }
                                                                                  />
                                                                                )}
                                                                              </Col>
                                                                            </Row>
                                                                          </Btn>
                                                                        </H5>
                                                                      </CardHeader>
                                                                      <Collapse
                                                                        isOpen={
                                                                          openEvent === indexTwo
                                                                            ? true
                                                                            : false
                                                                        }
                                                                      >
                                                                        <CardBody className="pe-0 event-sub-card-body">
                                                                          {event?.markets
                                                                            ?.filter(
                                                                              (market) =>
                                                                                market.type !== "fancy"
                                                                            )
                                                                            .map((market, indexThree) => {
                                                                              if (
                                                                                market?.type !== "fancy"
                                                                              ) {
                                                                                return (
                                                                                  market?.status !==
                                                                                  "2" && (
                                                                                    <Card
                                                                                      className="m-0"
                                                                                      key={indexThree}
                                                                                    >
                                                                                      <CardHeader className="">
                                                                                        <H5
                                                                                          attrH5={{
                                                                                            className: `mb-0 markets-h5`,
                                                                                          }}
                                                                                        >
                                                                                          <Btn
                                                                                            attrBtn={{
                                                                                              as: Card.Header,
                                                                                              className:
                                                                                                "btn btn-link accordian-btn",
                                                                                              color:
                                                                                                "default",
                                                                                              onClick:
                                                                                                () =>
                                                                                                  toggleMarketsAccordion(
                                                                                                    indexThree
                                                                                                  ),
                                                                                            }}
                                                                                          >
                                                                                            <Row className="align-items-left py-1 gap-2">

                                                                                              <Col className="d-flex align-items-center">
                                                                                                {market?.marketName
                                                                                                  .trim()
                                                                                                  .split(
                                                                                                    " "
                                                                                                  )
                                                                                                  .pop() ===
                                                                                                  "Line" && (
                                                                                                    <label className="custom-label">
                                                                                                      <input
                                                                                                        type="checkbox"
                                                                                                        defaultChecked={
                                                                                                          market?.priority
                                                                                                        }
                                                                                                        disabled={
                                                                                                          checkboxDisabled &&
                                                                                                          !market?.priority
                                                                                                        }
                                                                                                        // checked={market?.priority}
                                                                                                        onClick={(
                                                                                                          e
                                                                                                        ) =>
                                                                                                          handlePriorityLineMarket(
                                                                                                            e,
                                                                                                            market._id,
                                                                                                            market.priority
                                                                                                          )
                                                                                                        }
                                                                                                      />
                                                                                                      <span className="checkbox"></span>
                                                                                                      {/* <span className={`checkbox ${true ? 'checkbox-reverted' : ''}`}></span> */}
                                                                                                    </label>
                                                                                                  )}
                                                                                                <h6 className="m-3">
                                                                                                  {
                                                                                                    market?.marketName
                                                                                                  }
                                                                                                </h6>
                                                                                              </Col>

                                                                                              <Col className="d-flex gap-3  align-items-center">
                                                                                                <Col className=" align-items-center">
                                                                                                  <ToggleButton
                                                                                                    toggleAction={
                                                                                                      handleToggle
                                                                                                    }
                                                                                                    actionId={
                                                                                                      market?._id
                                                                                                    }
                                                                                                    actionType={
                                                                                                      ACTIONTYPES?.market
                                                                                                    }
                                                                                                    toggle={
                                                                                                      market?.status
                                                                                                    }

                                                                                                    countryIndex={countryIndex}
                                                                                                    indexOne={
                                                                                                      indexOne
                                                                                                    }
                                                                                                    indexTwo={
                                                                                                      indexTwo
                                                                                                    }
                                                                                                    indexThree={
                                                                                                      indexThree
                                                                                                    }
                                                                                                    sportsCode={eventDatas?.sportsCode}
                                                                                                  />
                                                                                                </Col>
                                                                                                <Col className="">
                                                                                                  {role ==
                                                                                                    1 && (
                                                                                                      <DeleteButton
                                                                                                        actionId={
                                                                                                          market?._id
                                                                                                        }
                                                                                                        actionType={
                                                                                                          ACTIONTYPES?.market
                                                                                                        }
                                                                                                        clickAction={
                                                                                                          handleDelete
                                                                                                        }

                                                                                                        countryIndex={countryIndex}
                                                                                                        indexOne={
                                                                                                          indexOne
                                                                                                        }
                                                                                                        indexTwo={
                                                                                                          indexTwo
                                                                                                        }
                                                                                                        indexThree={
                                                                                                          indexThree
                                                                                                        }
                                                                                                        type="Market"
                                                                                                        disabled={
                                                                                                          market?.status
                                                                                                        }
                                                                                                        sportsCode={eventDatas?.sportsCode}
                                                                                                      />
                                                                                                    )}
                                                                                                </Col>
                                                                                                {role ==
                                                                                                  1 &&
                                                                                                  market.type ===
                                                                                                  "exchange" && (
                                                                                                    <Col className="d-flex align-items-center gap-2">
                                                                                                      <EditableInputField
                                                                                                        oddValue={
                                                                                                          market?.oddLimit
                                                                                                        }
                                                                                                        handleSubmit={
                                                                                                          handleSubmit
                                                                                                        }
                                                                                                        id={
                                                                                                          market?._id
                                                                                                        }
                                                                                                        edit={
                                                                                                          editStatus
                                                                                                        }
                                                                                                      />
                                                                                                    </Col>
                                                                                                  )}
                                                                                              </Col>
                                                                                            </Row>
                                                                                          </Btn>
                                                                                        </H5>
                                                                                      </CardHeader>
                                                                                    </Card>
                                                                                  )
                                                                                );
                                                                              }
                                                                            })}
                                                                        </CardBody>
                                                                      </Collapse>
                                                                    </Card>
                                                                  )
                                                                );
                                                              }
                                                            }
                                                            )}
                                                          </CardBody>
                                                        </Collapse>
                                                      )}
                                                    </Card>
                                                  </>
                                                )
                                              );
                                            })}
                                          </>




                                        </Btn>
                                      </H5>
                                    )}
                                  </Btn>
                                </H5>
                              </CardHeader>
                            </Card>
                          )
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {eventDatas?.leagues.map((league, indexOne) => {
                        const isRotating = rotatingRows[indexOne];
                        const iconStyle = {
                          transform: isRotating
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s",
                          cursor: "pointer", // Add cursor style for clickable icons
                          color: " #54ba4a",
                        };
                        return (
                          league.status !== "2" && (
                            <>
                              <Card key={indexOne}>
                                <CardHeader className="">
                                  <H5
                                    attrH5={{
                                      className: `mb-0 leagues-h5 ${openLeague === indexOne
                                        ? "accordian-radius-open"
                                        : "accordian-radius-close"
                                        }`,
                                    }}
                                  >
                                    <Btn
                                      attrBtn={{
                                        as: Card.Header,
                                        className: `btn btn-link accordian-btn`,
                                        color: "default",
                                        onClick: () =>
                                          toggleLeaguesAccordion(league, indexOne, eventDatas?.sportsCode),
                                      }}
                                    >
                                      <Row className="align-items-center py-1">
                                        <Col className="h6 m-0 d-flex gap-2">
                                          <div>
                                            {/* <input
                        type="checkbox"
                        name="game1"
                        className="checkbox-events mr-2"
                        onClick={(e) => e.stopPropagation()}
                        onChange={() =>
                          handleSelectAllChange(
                            league?.events,
                            league?._id
                          )
                        }
                        checked={selectAll === league?._id}
                      /> */}

                                            {/* START  */}
                                            <label
                                              className="checkbox-containers"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <input
                                                type="checkbox"
                                                className="hidden-checkboxx"
                                                // onClick={(e) => e.stopPropagation()}
                                                onChange={() =>
                                                  handleSelectAllChange(
                                                    league?.events,
                                                    league?._id
                                                  )
                                                }
                                                checked={selectAll === league?._id}
                                              />
                                              <div className="custom-checkboxx">
                                                <svg
                                                  className="checkmarkx"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                                </svg>
                                              </div>
                                            </label>
                                            {/* /END */}
                                          </div>
                                          <span>{league?.name}</span>
                                        </Col>

                                        <Col className="d-flex align-items-center justify-content-center gap-3 col-md-4 col-sm-3 p-1">
                                          <ToggleButton
                                            toggleAction={handleToggle}
                                            actionId={league?._id}
                                            actionType={ACTIONTYPES.league}
                                            toggle={league?.status}
                                            indexOne={indexOne}
                                            sportsCode={eventDatas?.sportsCode}
                                          />
                                          {role == 1 && (
                                            <DeleteButton
                                              clickAction={handleDelete}
                                              actionId={league?._id}
                                              actionType={ACTIONTYPES?.league}
                                              indexOne={indexOne}
                                              disabled={league?.status}
                                              type="League"
                                              sportsCode={eventDatas?.sportsCode}
                                            />
                                          )}
                                          {role == 1 && (
                                            <div className="d-flex align-items-center justify-content-center mx-auto">
                                              <label>Radar Id:</label>
                                              <span
                                                onClick={(e) =>
                                                  handleRadarIdClick(e, league?._id, indexOne)
                                                }
                                                className="ms-1"
                                              >
                                                <FiRefreshCw style={iconStyle} />
                                              </span>
                                            </div>
                                          )}
                                        </Col>
                                      </Row>
                                    </Btn>
                                  </H5>
                                </CardHeader>

                                {leagueDataLoader?.loading &&
                                  leagueDataLoader?.index === indexOne ? (
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    disabled
                                  >
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    <span className="sr-only">Loading...</span>
                                  </button>
                                ) : (
                                  <Collapse
                                    isOpen={openLeague === indexOne ? true : false}
                                  >
                                    <CardBody className="event-sub-card-body">
                                      {leagueData?.events?.map(
                                        (event, indexTwo) => {
                                          return (
                                            event?.status !== "2" && (
                                              <Card key={indexTwo}>
                                                <CardHeader className="">
                                                  <H5
                                                    attrH5={{
                                                      className: `mb-0 events-h5  ${openEvent === indexTwo
                                                        ? "accordian-radius-open"
                                                        : "accordian-radius-close"
                                                        }`,
                                                    }}
                                                  >
                                                    <Btn
                                                      attrBtn={{
                                                        as: Card.Header,
                                                        className:
                                                          "btn btn-link accordian-btn",
                                                        color: "default",
                                                        onClick: () =>
                                                          toggleEventsAccordion(
                                                            indexTwo,
                                                            event?._id
                                                          ),
                                                      }}
                                                    >
                                                      <Row className="align-items-center py-1">
                                                        <Col className="col-md-4 h6 m-0 d-flex gap-2">
                                                          <div>
                                                            {/* START  */}
                                                            <label
                                                              className="checkbox-containers"
                                                              onClick={(e) =>
                                                                e.stopPropagation()
                                                              }
                                                            >
                                                              <input
                                                                type="checkbox"
                                                                className="hidden-checkboxx"
                                                                checked={selectedIds.includes(
                                                                  event?._id
                                                                )}
                                                                onChange={() =>
                                                                  handleCheckboxChange(
                                                                    event?._id,
                                                                    league?.events,
                                                                    league?._id
                                                                  )
                                                                }
                                                              // onClick={(e) =>
                                                              //   e.stopPropagation()
                                                              // }
                                                              />
                                                              <div className="custom-checkboxx">
                                                                <svg
                                                                  className="checkmarkx"
                                                                  viewBox="0 0 24 24"
                                                                >
                                                                  <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                                                </svg>
                                                              </div>
                                                            </label>
                                                            {/* /END */}
                                                          </div>
                                                          <span>{event?.name}</span>
                                                        </Col>
                                                        <Col className="col-md-4 align-middle d-flex gap-5">
                                                          <p
                                                            className="p-0 m-0 text-success h6 m-0"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            {event?.date}
                                                          </p>
                                                          {role == 1 && (
                                                            <Col className="col-md-4 align-middle ms-5">
                                                              <EditableRadarIdField
                                                                isEditableRadarId={
                                                                  isEditableRadarId
                                                                }
                                                                setIsEditableRadarId={
                                                                  setIsEditableRadarId
                                                                }
                                                                isCheck={isCheck}
                                                                setIsCheck={
                                                                  setIsCheck
                                                                }
                                                                radarId={
                                                                  event?.raderId
                                                                }
                                                                handleSubmitRadarId={
                                                                  handleSubmitRadarId
                                                                }
                                                                id={event?._id}
                                                                edit={editStatus}
                                                              />
                                                            </Col>
                                                          )}
                                                          {role == 1 && (
                                                            <Col className="col-md-4 align-middle ms-2">
                                                              <EditableChannelCodeField
                                                                isEditableChannel={
                                                                  isEditableChannel
                                                                }
                                                                setIsEditableChannel={
                                                                  setIsEditableChannel
                                                                }
                                                                isCheck={isCheck}
                                                                setIsCheck={
                                                                  setIsCheck
                                                                }
                                                                channelCode={
                                                                  event?.channelCode
                                                                }
                                                                handleSubmitChannelCode={
                                                                  handleSubmitChannelCode
                                                                }
                                                                id={event?._id}
                                                                edit={editStatus}
                                                              />
                                                            </Col>
                                                          )}
                                                        </Col>
                                                        <Col className="d-flex ms-auto align-items-center gap-3 col-md-3">
                                                          <ToggleButton
                                                            toggleAction={
                                                              handleToggle
                                                            }
                                                            actionId={event?._id}
                                                            actionType={
                                                              ACTIONTYPES?.event
                                                            }
                                                            toggle={event?.status}
                                                            indexOne={indexOne}
                                                            indexTwo={indexTwo}
                                                            sportsCode={eventDatas?.sportsCode}
                                                          />
                                                          {role == 1 && (
                                                            <DeleteButton
                                                              clickAction={
                                                                handleDelete
                                                              }
                                                              actionId={event?._id}
                                                              actionType={
                                                                ACTIONTYPES?.event
                                                              }
                                                              indexOne={indexOne}
                                                              indexTwo={indexTwo}
                                                              type="Event"
                                                              disabled={
                                                                event?.status
                                                              }
                                                              sportsCode={eventDatas?.sportsCode}
                                                            />
                                                          )}
                                                        </Col>
                                                      </Row>
                                                    </Btn>
                                                  </H5>
                                                </CardHeader>
                                                <Collapse
                                                  isOpen={
                                                    openEvent === indexTwo
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  <CardBody className="pe-0 event-sub-card-body">
                                                    {event?.markets
                                                      ?.filter(
                                                        (market) =>
                                                          market.type !== "fancy"
                                                      )
                                                      // .sort((a, b) => {
                                                      //   if (a.marketName === "Line")
                                                      //     return -1;
                                                      //   if (b.marketName === "BOOKMAKER")
                                                      //     return 1;
                                                      //   return a.marketName.localeCompare(
                                                      //     b.marketName
                                                      //   );
                                                      // })
                                                      .map((market, indexThree) => {
                                                        if (
                                                          market?.type !== "fancy"
                                                        ) {
                                                          return (
                                                            market?.status !==
                                                            "2" && (
                                                              <Card
                                                                className="m-0"
                                                                key={indexThree}
                                                              >
                                                                <CardHeader className="">
                                                                  <H5
                                                                    attrH5={{
                                                                      className: `mb-0 markets-h5`,
                                                                    }}
                                                                  >
                                                                    <Btn
                                                                      attrBtn={{
                                                                        as: Card.Header,
                                                                        className:
                                                                          "btn btn-link accordian-btn",
                                                                        color:
                                                                          "default",
                                                                        onClick:
                                                                          () =>
                                                                            toggleMarketsAccordion(
                                                                              indexThree
                                                                            ),
                                                                      }}
                                                                    >
                                                                      <Row className="align-items-left py-1 gap-2">
                                                                        {/* <Col className="d-flex align-items-center">
                                              {market?.marketName
                                                .split(" ")
                                                .pop() ===
                                                "Line" && (
                                                <label
                                                  className={`switch ${
                                                    checkboxDisabled ||
                                                    (currentCheckedItems.length >
                                                      4 &&
                                                      !market?.priority)
                                                      ? "disabled"
                                                      : ""
                                                  }`}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    defaultChecked={ market?.priority }
                                                    className="checkbox"
                                                    disabled={
                                                    checkboxDisabled || (currentCheckedItems.length > 4 &&!market?.priority) }
                                                    onClick={() => {handlePriorityLineMarket(market._id,market.priority);
                                                    }}
                                                  />
                                                  <div className="slider"></div>
                                                </label>
                                              )} */}
                                                                        <Col className="d-flex align-items-center">
                                                                          {market?.marketName
                                                                            .trim()
                                                                            .split(
                                                                              " "
                                                                            )
                                                                            .pop() ===
                                                                            "Line" && (
                                                                              <label className="custom-label">
                                                                                <input
                                                                                  type="checkbox"
                                                                                  defaultChecked={
                                                                                    market?.priority
                                                                                  }
                                                                                  disabled={
                                                                                    checkboxDisabled &&
                                                                                    !market?.priority
                                                                                  }
                                                                                  // checked={market?.priority}
                                                                                  onClick={(
                                                                                    e
                                                                                  ) =>
                                                                                    handlePriorityLineMarket(
                                                                                      e,
                                                                                      market._id,
                                                                                      market.priority
                                                                                    )
                                                                                  }
                                                                                />
                                                                                <span className="checkbox"></span>
                                                                                {/* <span className={`checkbox ${true ? 'checkbox-reverted' : ''}`}></span> */}
                                                                              </label>
                                                                            )}
                                                                          <h6 className="m-3">
                                                                            {
                                                                              market?.marketName
                                                                            }
                                                                          </h6>
                                                                        </Col>

                                                                        <Col className="d-flex gap-3  align-items-center">
                                                                          <Col className=" align-items-center">
                                                                            <ToggleButton
                                                                              toggleAction={
                                                                                handleToggle
                                                                              }
                                                                              actionId={
                                                                                market?._id
                                                                              }
                                                                              actionType={
                                                                                ACTIONTYPES?.market
                                                                              }
                                                                              toggle={
                                                                                market?.status
                                                                              }
                                                                              indexOne={
                                                                                indexOne
                                                                              }
                                                                              indexTwo={
                                                                                indexTwo
                                                                              }
                                                                              indexThree={
                                                                                indexThree
                                                                              }
                                                                              sportsCode={eventDatas?.sportsCode}
                                                                            />
                                                                          </Col>
                                                                          <Col className="">
                                                                            {role ==
                                                                              1 && (
                                                                                <DeleteButton
                                                                                  actionId={
                                                                                    market?._id
                                                                                  }
                                                                                  actionType={
                                                                                    ACTIONTYPES?.market
                                                                                  }
                                                                                  clickAction={
                                                                                    handleDelete
                                                                                  }
                                                                                  indexOne={
                                                                                    indexOne
                                                                                  }
                                                                                  indexTwo={
                                                                                    indexTwo
                                                                                  }
                                                                                  indexThree={
                                                                                    indexThree
                                                                                  }
                                                                                  type="Market"
                                                                                  disabled={
                                                                                    market?.status
                                                                                  }
                                                                                  sportsCode={eventDatas?.sportsCode}
                                                                                />
                                                                              )}
                                                                          </Col>
                                                                          {role ==
                                                                            1 &&
                                                                            market.type ===
                                                                            "exchange" && (
                                                                              <Col className="d-flex align-items-center gap-2">
                                                                                <EditableInputField
                                                                                  oddValue={
                                                                                    market?.oddLimit
                                                                                  }
                                                                                  handleSubmit={
                                                                                    handleSubmit
                                                                                  }
                                                                                  id={
                                                                                    market?._id
                                                                                  }
                                                                                  edit={
                                                                                    editStatus
                                                                                  }
                                                                                />
                                                                                {/* <input
                                                      className="form-control"
                                                      min={0}
                                                      style={{
                                                        width:
                                                          "110px",
                                                      }}
                                                      value={
                                                        market?.oddLimit
                                                      }
                                                      type="number"
                                                      placeholder="odd limit"
                                                      disabled={
                                                        !isEditing[
                                                          indexThree
                                                        ]
                                                      }
                                                      onChange={(
                                                        e
                                                      ) =>
                                                        handleOddChange(
                                                          e,
                                                          market?.oddLimit,
                                                          indexThree
                                                        )
                                                      }
                                                    />

                                                    <span
                                                      className="icon cursor-pointer fs-5 lh-1 m-0 p-1 "
                                                      color="success"
                                                    >
                                                      {isEditing[
                                                        indexThree
                                                      ] ? (
                                                        <BsCheckLg
                                                          className="align-text-top fs-5 pointer"
                                                          onClick={() =>
                                                            handleSubmit(
                                                              indexThree,
                                                              market?._id
                                                            )
                                                          }
                                                        />
                                                      ) : (
                                                        <CiEdit
                                                          className="align-text-top fs-5 pointer"
                                                          onClick={() =>
                                                            handleoddLimitEdit(
                                                              indexThree
                                                            )
                                                          }
                                                        />
                                                      )}
                                                    </span> */}
                                                                              </Col>
                                                                            )}
                                                                        </Col>
                                                                      </Row>
                                                                    </Btn>
                                                                  </H5>
                                                                </CardHeader>
                                                              </Card>
                                                            )
                                                          );
                                                        }
                                                      })}
                                                  </CardBody>
                                                </Collapse>
                                              </Card>
                                            )
                                          );
                                        }
                                      )}
                                    </CardBody>
                                  </Collapse>
                                )}
                              </Card>
                            </>
                          )
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Accordion>
    </Fragment>
  );
};

export default ManagementSection;
