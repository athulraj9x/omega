import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Form,
  Button,
  CardHeader,
  Badge,
} from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addPanel,
  getBetfairCountries,
  getBetfairTimeRanges,
  getEvents,
  getLeagues,
  getSports,
  getVenues,
  getTvUrl,
  addRaceEvent,
  getLineMarkets,
  addNewMarket,
  addRaceEventAll,
} from "../../../../redux/action";
import EventsPanel from "./EventsPanel";
import MarketsPanel from "./MarketsPanel";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Breadcrumbs } from "../../../../AbstractElements";
import Loader from "../../../../Layout/Loader";
import { notifyWarning } from "../../../../utils/helper";
import { socket } from "../../../../context/socketContext";
import HorseRacePanel from "./HorseRacePanel";
import { HorseRelatedSportsCode, HorseRelatedSportsName } from "../../../../utils/constants";

const RestorePanel = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //React-hook form imports...
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const [sportOption, setsportOption] = useState([]);
  const [leagueOption, setLeagueOption] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [latestMarkets, setLatestMarkets] = useState([]);
  const [marketsDropdown, setMarketsDropdown] = useState([]);
  const [eventCodes, setEventCodes] = useState([]);
  const [event, setEvent] = useState([]);
  const [eventId, setEventId] = useState("");
  const [sport, setSport] = useState("");
  const [league, setLeague] = useState("");
  const [eveCount, setEveCount] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [sportSelected, setSportSelected] = useState(false);
  // Step 1: Create state variables for selected checkbox IDs and count
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMarketIds, setSelectedMarketIds] = useState([]);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isRoleSelectOpen2, setIsRoleSelectOpen2] = useState(false);
  const [isRoleSelectOpen3, setIsRoleSelectOpen3] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState("");
  const [selectEvent, setSelectEvent] = useState("");
  const [timeRanges, setTimeRanges] = useState([]);
  const [race, setRace] = useState(false);
  const [isLiveTv, setIsLiveTv] = useState(false);
  const [isLoadingAddRace, setIsLoadingHorseRace] = useState(false);

  //Redux Global States Import
  const getSportData = useSelector((state) => state?.GetSports?.sportData);
  const getLeagueData = useSelector((state) => state?.GetLeagues?.leagueData);
  const addData = useSelector((state) => state?.AddPanel);

  const loadingSport = useSelector((state) => state?.GetSports?.loading);
  const loadingLeague = useSelector((state) => state?.GetLeagues?.loading);
  const loadingCountry = useSelector(
    (state) => state?.GetBetfairCountries?.loading
  );
  const loadingVenues = useSelector(
    (state) => state?.GetBetfairVenues?.loading
  );

  useEffect(() => {
    dispatch(getSports());
  }, []);

  /* ---------------- //For getting data for sports Select tag ---------------- */
  useEffect(() => {
    if (!getSportData?.data) {
      return;
    }

    const reorderedData = getSportData.data.reduce((acc, curr) => {
      const mappedValue = {
        label: curr.eventType?.name,
        value: { name: curr.eventType?.name, id: curr.eventType?.id },
      };

      if (curr.eventType?.id === "4") {
        //sorting the cricket data to top
        return [mappedValue, ...acc];
      } else {
        acc.push(mappedValue);
        return acc;
      }
    }, []);

    setsportOption(reorderedData);
  }, [getSportData]);

  /* ---------------- //For getting data for league select tag ---------------- */
  useEffect(() => {
    let data = getLeagueData?.data?.map((ele) => {
      return {
        label: ele?.competition?.name,
        value: { name: ele?.competition?.name, id: ele?.competition?.id },
      };
    });
    setLeagueOption(data);
  }, [getLeagueData]);

  useEffect(() => {
    let even_codes = markets?.map((event_data) => {
      return {
        events_code: event_data?.event?.event?.id,
        events_eventDate: event_data?.event?.event?.openDate,
        events_name: event_data?.event?.event?.name,
        events_slugName: event_data?.event?.event?.name,
      };
    });
    // ?.filter((remove_undefined) => remove_undefined !== undefined)
    // ?.flat();

    setEvent(even_codes);
    //For getting event Count
    // const count = markets.reduce((acc, obj) => {
    //   if (Object.keys(obj.event || {}).includes("childs")) {
    //     return acc + obj?.event?.childs.length;
    //   }
    //   return acc;
    // }, 0);
    setEveCount(markets ? markets?.length : 0);
  }, [markets]);
  //Handles the Sport Select and Setting Values
  const handleSportSelect = async (option, field) => {
    setSport(option);
    field.onChange(option.value);
    if (option?.value?.id === "7") {
      setRace(true);
      const id = option?.value?.id;
      dispatch(
        getBetfairCountries({
          id,
          callback: (data) => {
            let options = data?.data?.map((ele) => {
              return {
                label: ele?.countryCode,
                value: ele?.countryCode,
              };
            });
            setCountries(options);
          },
        })
      );
    } else {
      if (race) setRace(false);
      dispatch(getLeagues(option?.value?.id));
      setSportSelected(true);
    }
  };

  //Handles the League select
  const handleLeagueSelect = async (option, field) => {
    setSelectedMarkets([]);
    setSelectedMarketIds([]);
    let count = 0;
    field.onChange(option.value);
    setSelectedIds([]); // Reset selectedIds to an empty array when the league changes
    setMarkets([]);
    setMarketsDropdown([]);
    setLeague(option);
    setLoading(true);
    field.onChange(option.value);
    let id = option?.value?.id;
    dispatch(
      getEvents({
        id,
        callback: (data) => {
          setLoading(false);

          setEventCodes([]);
          let dataObj;
          let marketData;
          data?.data?.map((ele) => {
            dataObj = {
              event: ele,
              index: count++,
            };

            setMarkets((prevArray) => [...prevArray, dataObj]);

            marketData = {
              label: ele?.event?.name,
              value: ele?.event?.id,
            };
            setMarketsDropdown((prevArray) => [...prevArray, marketData]);
            return null;
          });
        },
      })
    );
  };

  //Handles the League select
  const handleEventSelect = async (option, field) => {
    setSelectEvent("");
    field.onChange(option.value);
    setLoading(true);

    let options = {
      label: option?.label,
      value: option?.value,
    };
    setSelectEvent(options);
    dispatch(
      getLineMarkets({
        id: option?.value,
        callback: (data) => {
          setEventId(data?.data?.eventId);
          setLatestMarkets(data?.data?.eventMarketsModified);
          setLoading(false);
          // setLatestMarkets();
        },
      })
    );
  };

  const handleCountrySelect = (option, field) => {
    setVenue("");
    dispatch(
      getVenues({
        id: option?.value,
        callback: (data) => {
          let options = data?.data?.map((ele) => {
            return {
              label: ele?.venue,
              value: ele?.venue,
            };
          });
          setVenues(options);
        },
      })
    );
  };

  const handleVenueSelect = (option, field) => {
    ;
    setLoading(true);

    const data = {
      venue: option?.value,
      eventId: sport?.value?.id,
    };
    dispatch(
      getBetfairTimeRanges({
        data,
        callback: (data) => {
          let dataObj;
          let count = 0;
          setLoading(false);

          data?.data?.map((ele) => {
            //timeRange  //marketCount
            dataObj = {
              timeRange: {
                from: new Date(ele?.timeRange?.from).toLocaleString(),
                to: new Date(ele?.timeRange?.to).toLocaleString(),
              },
              marketCount: ele?.marketCount,
              id: count++,
            };
            setTimeRanges((prevArray) => [...prevArray, dataObj]);
            return null;
          });
        },
      })
    );
  };

  //Create New Data on Submit...
  const onSubmit = (data, e) => {
    if (isChecked) {
      createMarket();
    } else {
      createEvent(data);
    }
  };

  const createEvent = (data) => {
    if (race) {
      setIsSubmit(true);
      setIsLoadingHorseRace(true);
      let formData = {
        sports_name: data?.sports?.name,
        sports_slugName: data?.sports?.name,
        eventTypeId: data?.sports?.id,
        country: data?.country,
        venue: data?.venue,
      };

      if (formData) {
        dispatch(
          addRaceEvent({
            data: formData,
            callback: () => {
              handleClear();
              setIsSubmit(false);
              setIsLoadingHorseRace(false);
            },
          })
        );
      } else {
        notifyWarning("Please select an event", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      let event_data = event?.filter(
        (event_data) =>
          !selectedEvents
            ?.map((event_code) => event_code?.events_code)
            .includes(event_data.events_code)
      );
      setIsSubmit(true);
      let formData = {
        sports_name: data?.sports?.name,
        sports_slugName: data?.sports?.name,
        sports_code: data?.sports?.id,
        league_name: data?.league?.name,
        league_slugName: data?.league?.name,
        league_code: data?.league?.id,
        events: event_data,
      };

      if (formData && event_data?.length > 0) {
        dispatch(
          addPanel({
            formData,
            callback: () => {
              reset();
              setSelectedEvents([]);
              setSport("");
              setLeague("");
              setMarkets([]);
              setLeagueOption([]);
              setIsSubmit(false);
              socket.emit("new-events-added");
            },
          })
        );
      } else {
        notifyWarning("Please select an event", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  const createMarket = () => {
    setIsSubmit(true);
    let marketObj = {
      eventId: eventId,
      market: selectedMarkets,
    };
    dispatch(
      addNewMarket({
        marketObj,
        callback: () => {
          handleClear();
          setIsSubmit(false);
          setIsChecked(false);
          setIsMarket(false);
        },
      })
    );
  };

  //Cancel Click handle
  const handleClear = () => {
    setRace(false);
    reset();
    setSport("");
    setLeague("");
    setVenue("");
    setCountry("");
    setMarkets([]);
    setTimeRanges([]);
    setLatestMarkets([]);
    setIsChecked(false);
    setIsMarket(false);
  };

  // Step 2: Update the checkbox change handler
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
    } else {
      setSelectedIds((prevIds) => [...prevIds, id]);
    }
  };

  // Step 2: Update the checkbox change handler
  const handleMarketCheckboxChange = (id) => {
    if (selectedMarketIds?.includes(id)) {
      setSelectedMarketIds((prevIds) =>
        prevIds.filter((prevId) => prevId !== id)
      );
    } else {
      setSelectedMarketIds((prevIds) => [...prevIds, id]);
    }
  };

  const liveTv = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    dispatch(
      getTvUrl({
        callback: (data) => {
          if (data) {
            setIsLiveTv(false);
            setIsSubmit(false);
          }
        },
      })
    );
  };

  const addRaceAll = () => {
    setIsLoadingHorseRace(true);
    dispatch(
      addRaceEventAll({
        callback: () => {
          setIsLoadingHorseRace(false);
          handleClear();
          setIsSubmit(false);
        },
      })
    );
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("RESTORE_PANEL")}
        title={title?.title}
        parent={title?.parent}
      />

      <Container fluid={false}>
        {addData?.loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        {isLoadingAddRace && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}
        <Row>
          <Col sm="12" className="px-3">
            <Card className="px-2">
              <CardBody>
                <Form
                  className="needs-validation"
                  noValidate=""
                  id="create"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Row className="d-flex flex-col flex-wrap">
                    <Col md="4 mb-3" className="">
                      <Label htmlFor="validationCustom01">
                        {t("SELECT_SPORTS")}
                      </Label>

                      <Controller
                        name="sports"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              options={sportOption}
                              className="mySelect"
                              placeholder={t("SELECT_DOT")}
                              isLoading={loadingSport}
                              value={sport}
                              onChange={(option) => {
                                handleSportSelect(option, field);
                                setIsRoleSelectOpen(false);
                              }}
                              menuIsOpen={isRoleSelectOpen} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen(false)} // Close menu on blur
                            />
                          </>
                        )}
                      />
                      <span className="text-danger">
                        {errors.sports && t("fieldRequired")}
                      </span>
                    </Col>
                    {!race && (
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom02">
                          {t("SELECT_LEAGUE")}
                        </Label>
                        <Controller
                          name="league"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={leagueOption}
                              value={league}
                              placeholder={t("SELECT_DOT")}
                              isLoading={loadingLeague}
                              onChange={(option) => {
                                handleLeagueSelect(option, field);
                                setLeague(option);
                                field.onChange(option.value);
                                setIsRoleSelectOpen2(false);
                              }}
                              menuIsOpen={isRoleSelectOpen2} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen2(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen2(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.sport && t("fieldRequired")}
                        </span>
                      </Col>
                    )}
                    {race && (
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom02">
                          {t("SELECT_COUNTRY")}
                        </Label>
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={countries}
                              value={country}
                              placeholder={t("SELECT_DOT")}
                              isLoading={loadingCountry}
                              onChange={(option) => {
                                handleCountrySelect(option, field);
                                setCountry(option);
                                field.onChange(option.value);
                                setIsRoleSelectOpen2(false);
                              }}
                              menuIsOpen={isRoleSelectOpen2} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen2(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen2(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.sport && t("fieldRequired")}
                        </span>
                      </Col>
                    )}

                    {race && (
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom02">
                          {t("SELECT_VENUE")}
                        </Label>
                        <Controller
                          name="venue"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="mySelect"
                              options={venues}
                              value={venue}
                              placeholder={t("SELECT_DOT")}
                              isLoading={loadingVenues}
                              onChange={(option) => {
                                handleVenueSelect(option, field);
                                setVenue(option);
                                field.onChange(option.value);
                                setIsRoleSelectOpen3(false);
                              }}
                              menuIsOpen={isRoleSelectOpen3} // Set menuIsOpen based on state
                              onFocus={() => setIsRoleSelectOpen3(true)} // Open menu on focus
                              onBlur={() => setIsRoleSelectOpen3(false)} // Close menu on blur
                            />
                          )}
                        />
                        <span className="text-danger">
                          {errors.sport && t("fieldRequired")}
                        </span>
                      </Col>
                    )}

                    <Col
                      md="4 mb-3"
                      className="mt-4 d-flex justify-content-start"
                    >

                      {/* {sport?.label === "Horse Racing" && (
                        <>
                          <button
                            className="btn btn-success p-2 m-2"
                            onClick={addRaceAll}
                          >
                            Add race at once
                          </button>
                        </>
                      )} */}
                      <button
                        onClick={(e) => liveTv(e)}
                        disabled={isLiveTv}
                        className={`p-2 m-2 ${isSubmit ? "live-tv" : "btn btn-success"
                          } `}
                      >
                        Live Score
                      </button>
                    </Col>

                    <Col md="4 mb-3" className="mt-4">
                   {HorseRelatedSportsName.some(item => item.sportsName !== sport?.label) && (
                      <>
                      <div>
                        <Label className="m-0 switch">
                          <input
                            type="checkbox"
                            onClick={() => {
                              setIsChecked(!isChecked);
                              setIsMarket(false);
                            }}
                            checked={isChecked}
                            />
                          <span className="switch-state" />
                        </Label>

                        {/* <input
                          onClick={() => {
                            setIsChecked(!isChecked);
                            setIsMarket(false);
                          }}
                          checked={isChecked}
                          type="checkbox"
                          className="custom-checkbox-market"
                        /> */}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        disabled={false}
                        className={`${isChecked ? "btn btn-success" : "live-tv"
                        } `}
                        >
                        Add market in existing events
                      </button>
                        </>
)}
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {isChecked && (
              <Card className="px-2">
                <CardBody>
                  <Form
                    className="needs-validation"
                    noValidate=""
                    id="create"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Row className="d-flex flex-col flex-wrap">
                      <Col md="4 mb-3" className="">
                        <Label htmlFor="validationCustom01">
                          {t("SELECT_EVENT")}
                        </Label>

                        <Controller
                          name="event"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                options={marketsDropdown}
                                className="mySelect"
                                placeholder={t("SELECT_DOT")}
                                isLoading={loadingLeague}
                                value={selectEvent}
                                onChange={(option) => {
                                  handleEventSelect(option, field);
                                }}
                              />
                            </>
                          )}
                        />
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            )}

            <Card>
              {(!race && league === "") || (race && venue === "") ? (
                <CardBody>
                  <div className="text-center">
                    {t("SELECT_SPORT_AND_LEAGUE")}
                  </div>
                </CardBody>
              ) : (
                <Fragment>
                  <CardHeader className="py-3 d-flex align-items-center justify-content-between">
                    <div className="title d-flex align-items-center">
                      {race ? (
                        <h4 className="my-0">
                          {country?.label + ` | ` + venue?.label}{" "}
                        </h4>
                      ) : (
                        <h4 className="my-0">{league?.label} </h4>
                      )}
                      {!race && (
                        <div className="badge-group ms-3">
                          <Badge className="btn btn-success px-2 py-1">
                            {race ? timeRanges?.length : eveCount}
                          </Badge>

                          <Badge className="btn btn-warning ms-1 px-2 py-1">
                            {selectedIds?.length === 0
                              ? 0
                              : eveCount - selectedIds?.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        className="btn ms-2"
                        style={{ backgroundColor: "#CCC" }}
                        onClick={() => {
                          handleClear();
                        }}
                      >
                        {t("RESET")}
                      </button>
                      <Button
                        className="mx-2"
                        form="create"
                        type="submit"
                        color="success"
                      >
                        {t("CREATE")}
                      </Button>
                    </div>
                  </CardHeader>
                  {race && (
                    <CardBody className="p-0">
                      <div className="overflow-auto" style={{ height: "66vh" }}>
                        {loading ? (
                          <div className="d-flex justify-content-center">
                            <p className="m-0">Loading ...</p>
                          </div>
                        ) : (
                          <table className="table table-bordered">
                            <tbody>
                              {timeRanges?.length === 0 ? (
                                <tr>
                                  <td colSpan="YOUR_COLSPAN_VALUE">
                                    No Data Available...
                                  </td>
                                </tr>
                              ) : (
                                timeRanges.map((time, index) => (
                                  <HorseRacePanel
                                    event={time}
                                    setSelectedEvents={setSelectedEvents}
                                    selectedEvents={selectedEvents}
                                    setSelectedIds={setSelectedIds}
                                    selectedIds={selectedIds}
                                    key={index}
                                    onChange={(id) => handleCheckboxChange(id)}
                                  />
                                ))
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </CardBody>
                  )}
                  {!race && (
                    <CardBody className="p-0">
                      <div className="overflow-auto" style={{ height: "66vh" }}>
                        {loading ? (
                          <div className="d-flex justify-content-center">
                            <p className="m-0">Loading ...</p>
                          </div>
                        ) : (
                          <table className="table table-bordered">
                            <tbody>
                              {isChecked ? (
                                <>
                                  {/* <MarketsPanel market={latestMarkets}/> */}
                                  {latestMarkets?.length === 0 ? (
                                    <tr>
                                      <td colSpan="d-flex justify-content-center">
                                        no existing market available.
                                      </td>
                                    </tr>
                                  ) : (
                                    latestMarkets?.map((market, index) => {
                                      return (
                                        <MarketsPanel
                                          market={market}
                                          setSelectedMarkets={
                                            setSelectedMarkets
                                          }
                                          selectedMarkets={selectedMarkets}
                                          selectedMarketIds={selectedMarketIds}
                                          index={index}
                                          onChange={(id) =>
                                            handleMarketCheckboxChange(id)
                                          }
                                        />
                                      );
                                    })
                                  )}
                                </>
                              ) : (
                                <>
                                  {markets?.length === 0 ? (
                                    <tr>
                                      <td colSpan="YOUR_COLSPAN_VALUE">
                                        Loading...
                                      </td>
                                    </tr>
                                  ) : (
                                    markets?.map((event, index) => {
                                      // if (
                                      //   Object.keys(event?.event).includes("childs")
                                      // ) {
                                      return (
                                        <EventsPanel
                                          event={event?.event}
                                          setSelectedEvents={setSelectedEvents}
                                          selectedEvents={selectedEvents}
                                          setSelectedIds={setSelectedIds}
                                          selectedIds={selectedIds} // Pass the selectedIds state to the EventsPanel
                                          key={index}
                                          // checked={selectedIds.includes(
                                          //   event?.event?.name
                                          // )}
                                          onChange={(id) =>
                                            handleCheckboxChange(id)
                                          }
                                        />
                                      );
                                      // } else {
                                      //   return null;
                                      // }
                                    })
                                  )}
                                </>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </CardBody>
                  )}
                </Fragment>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default RestorePanel;
