import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_EVENTMANAGEMENT_DATAS } from "../../action/types";
import {
  updateEventManagementDataSuccess,
  updateEventManagementDataFailure,
} from "../../action/eventManagement/postManageEventsAction";
import API from "../../../utils/api";
import { getDbSportsSuccess, getManageEventDataSuccess } from "../../action";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";
import { HorseRelatedSportsCode } from "../../../utils/constants";

function* updateEventManagementDataRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/active-deactive-event-status",
      action?.payload
    );

    if (data.meta.code === 200) {
      yield put(updateEventManagementDataSuccess(data.data));
      toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      // Update status without API call
      var eventDatas = action?.eventDatas;
      var indexOne = action?.indexOne;
      var indexTwo = action?.indexTwo;
      var indexThree = action?.indexThree;
      var countryIndex = action?.countryIndex;

      if (action.payload.type === 1) { 
        eventDatas[indexOne].status = eventDatas[indexOne].status === "0" ? "1" : "0";
        yield put(getDbSportsSuccess(eventDatas));
      } else {
        if (action?.payload?.delete) {
          if (indexOne != null && indexTwo == null) {eventDatas.leagues[indexOne].status = "2"}
          else if (indexTwo != null && indexThree == null) { eventDatas.leagues[indexOne].events[indexTwo].status = "2";
          } else if (indexThree != null) {eventDatas.leagues[indexOne].events[indexTwo].markets[indexThree].status = "2";
          }
          // yield call(action.payload.callback, data);
          yield put(getManageEventDataSuccess(eventDatas.manageData));
        } else {
          if (indexOne != null && indexTwo == null) {
            if(HorseRelatedSportsCode.some(item => item.sportsCode === action?.payload?.sportsCode)){
              eventDatas.countries[countryIndex].Venues[indexOne].status = eventDatas?.countries[countryIndex]?.Venues[indexOne].status === "0" ? "1" : "0";
            }else{
              eventDatas.leagues[indexOne].status = eventDatas?.leagues[indexOne].status === "0" ? "1" : "0";
            }
          } else if (indexTwo != null && indexThree == null) {
            if(HorseRelatedSportsCode.some(item => item.sportsCode === action?.payload?.sportsCode)){
              console.log("horse updation events")
              eventDatas.countries[countryIndex].Venues[indexOne].events[indexTwo].status = eventDatas?.countries[countryIndex]?.Venues[indexOne].events[indexTwo].status === "0" ? "1" : "0";
            }else{
              eventDatas.leagues[indexOne].events[indexTwo].status = eventDatas?.leagues[indexOne].events[indexTwo].status === "0" ? "1" : "0";
            }
          } else if (indexThree != null) {
            if(HorseRelatedSportsCode.some(item => item.sportsCode === action?.payload?.sportsCode)){
              eventDatas.countries[countryIndex].Venues[indexOne].events[indexTwo].markets[indexThree].status = eventDatas?.countries[countryIndex]?.Venues[indexOne].events[indexTwo].markets[indexThree].status === "0"? "1" : "0";
            }else{
              eventDatas.leagues[indexOne].events[indexTwo].markets[indexThree].status = eventDatas?.leagues[indexOne].events[indexTwo].markets[indexThree].status === "0"? "1" : "0";
            }
          }
          yield put(getManageEventDataSuccess(eventDatas));
        }
      }
         
    } else if (data.meta.code === 400) {
      yield put(updateEventManagementDataFailure());
      toast.dismiss();
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(updateEventManagementDataFailure());
      invalidTokenAction();
    }
  } catch (error) {
    console.log(error)
    yield put(updateEventManagementDataFailure());
    toast.dismiss();
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchUpdateEventManagementDataAPI() {
  yield takeEvery(
    UPDATE_EVENTMANAGEMENT_DATAS,
    updateEventManagementDataRequest
  );
}

export default function* rootSaga() {
  yield all([watchUpdateEventManagementDataAPI()]);
}
