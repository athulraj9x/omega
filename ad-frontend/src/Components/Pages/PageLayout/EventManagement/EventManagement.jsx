/** @format */

import React, { Fragment, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getDbSports,
  getLeagueEventData,
  getManageEventData,
  updateEventManagementDatas,
} from "../../../../redux/action";
import ManagementSection from "./ManagementSection";
import IconCard from "../IconCards/IconCard";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { ACTION_EVENT, SportPriority } from "../../../../Constant";
import Loader from "../../../../Layout/Loader";
import Pagination from "../../../Common/Component/pagination/Pagination";

const EventManagement = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedSport, setSelectedSport] = useState({});
  const [sportData, setSportData] = useState([]);
  const [dataFromChild, setDataFromChild] = useState([]);

  const [openLeague, setOpenLeague] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [defaultloading, setDefaultLoading] = useState(false);

  const allSportsData = useSelector((state) => state?.GetDbSports);
  const loadingGetSport = useSelector((state) => state?.GetDbSports?.loading);

  const allEventDa = useSelector((state) => state?.ManageEvents);

  const loadingAllEvent = useSelector((state) => state?.ManageEvents?.loading);

  const loadingUpdateEventManagementDatas = useSelector(
    (state) => state?.UpdateEventManagementDatas?.loading
  );
  const [leagueData, setleagueData] = useState([]);
  const [dataDeleted, setDataDeleted] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [allEventDatas, setAllEventDatas] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    let data = {
      id: selectedSport.sportId,
      currentPage: page || 1,
    };
    if (data?.id !== null) {
      dispatch(
        getManageEventData({
          data,
          callback: (response) => {
            setAllEventDatas(response.data);
            setTotalPages(response?.meta?.totalDataCount);
            setLoading(false);
          },
        })
      );
    }
  };

  //Getting Sports from DB with redux Action
  useEffect(() => {
    dispatch(getDbSports());
  }, [dataFromChild]);

  useEffect(() => {
    // const priority = SportPriority;
    let arr = allSportsData?.sportsData?.slice().sort((a, b) => {
      const priorityA = SportPriority[a.slugName] || 9999;
      const priorityB = SportPriority[b.slugName] || 9999;

      return priorityA - priorityB || a.slugName.localeCompare(b.slugName);
    });
    setSportData(arr);
  }, [allSportsData]);

  const handleOpenCloseToggleFunction = () => {
    setOpenLeague(null);
    setOpenEvent(null);
  };

  //Sports card Click Action
  const handleSportClick = (id) => {
    setLoading(true);
    handleOpenCloseToggleFunction();
    let data = {
      id: id,
      currentPage: currentPage,
    };
    dispatch(
      getManageEventData({
        data,
        callback: (response) => {
          setAllEventDatas(response.data);
          setTotalPages(response?.meta?.totalDataCount);
          setLoading(false);
        },
      })
    );
  };

  //Toggle Button  Action
  const handleToggle = (
    id,
    type,
    indexOne = null,
    indexTwo = null,
    indexThree = null,
    sportsCode = null,
    countryIndex=null
  ) => {
    let eventDatas;
    setDefaultLoading(true);
    if (type === 1) {
      eventDatas = sportData;
    } else {
      eventDatas = allEventDatas;
    }
    const data = {
      id,
      type,
      delete: ACTION_EVENT.update,
      sportsCode,
    };
    dispatch(
      updateEventManagementDatas(
        data,
        eventDatas,
        indexOne,
        indexTwo,
        indexThree,
        countryIndex,
      )
    );
    setDefaultLoading(false);
  };

  //Delete Action
  const handleDelete = (
    id,
    type,
    indexOne = null,
    indexTwo = null,
    indexThree = null,
    sportsCode = null,
    countryIndex = null
  ) => {
    let eventDatas;
    if (type === 1) {
      eventDatas = sportData;
    } else {
      eventDatas = allEventDatas;
    }
    const data = {
      id,
      type,
      delete: ACTION_EVENT.delete,
      sportsCode
    };
    dispatch(
      updateEventManagementDatas(
        data,
        eventDatas,
        indexOne,
        indexTwo,
        indexThree,
        countryIndex
      )
    );
    setDataDeleted(Date.now());
  };

  return (
    <Fragment>
      {loadingGetSport && (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {(loading || defaultloading) && (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {loadingUpdateEventManagementDatas && (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      <Breadcrumbs
        mainTitle={t("EVENT_MANAGEMENT")}
        title={title?.title}
        parent={title?.parent}
      />
      <div className="overflow-x-auto w-full px-3">
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            480: {
              slidesPerView: 7,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 7,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            1440: {
              slidesPerView: 9,
              spaceBetween: 5,
            },
          }}
          slidesPerView={8}
          spaceBetween={10}
          freeMode={true}
          draggable={true}
          className="d-flex gap-1 rounded-xl bg-skin-main"
        >
          {sportData?.map((item, index) => (
            <SwiperSlide key={index}>
              <IconCard
                iconName={item?.slugName}
                name={item?.name}
                setSelected={setSelectedSport}
                handleSportClick={handleSportClick}
                sportId={item?._id}
                status={item?.status}
                index={index}
                key={index}
                handleToggle={handleToggle}
                cardDatas={sportData}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {selectedSport?.name && (
        <div className="mt-3 px-3">
          <ManagementSection
            selectedSport={selectedSport}
            eventDatas={allEventDatas}
            setAllEventDatas={setAllEventDatas}
            handleToggle={handleToggle}
            handleDelete={handleDelete}
            openLeague={openLeague}
            openEvent={openEvent}
            setOpenEvent={setOpenEvent}
            setOpenLeague={setOpenLeague}
            leagueData={leagueData}
            setleagueData={setleagueData}
            setDataDeleted={setDataDeleted}
            dataDeleted={dataDeleted}
            setTotalPages={setTotalPages}
            handlePageChange={handlePageChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setFullScreenLoader={setLoading}
          />
        </div>
      )}

      {selectedSport?.name &&
        (allEventDatas?.leagues?.length >= 10 || totalPages > 0) && (
          <Pagination
            currentPage={Math.floor(currentPage)}
            totalPages={totalPages / 10}
            onPageChange={handlePageChange}
          />
        )}
    </Fragment>
  );
};

export default EventManagement;
