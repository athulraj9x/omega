import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_RADAR_ID} from "../../action/types";
import { updateRadarIdSuccess, updateRadarIdFailure } from "../../action";
import API from "../../../utils/oddApi";
import ADMINAPI from "../../../utils/api"
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* updateRadarIdRequest(action) {
  try {
    const eventId = action?.payload?.eventId

    let data;
    if (eventId) {
      const response = yield ADMINAPI.post("admin/update-radarId", action?.payload);
      data = response.data;
    } else {
      const response = yield API.post("/api/v2/update-radarId", action?.payload);
      data = response.data;
    }
    
    if (data.meta.code === 200) {
      
      yield put(updateRadarIdSuccess(data));
      yield call(action.payload.callback, data);
      // toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(updateRadarIdFailure());
      toast.dismiss();
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(updateRadarIdFailure());
      invalidTokenAction();
    }
  } catch (error) {
    console.log(error, "update radar id error");
    
    yield put(updateRadarIdFailure());
    toast.dismiss();
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchUpdateRadarIdAPI() {
  yield takeEvery(UPDATE_RADAR_ID, updateRadarIdRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateRadarIdAPI()]);
}