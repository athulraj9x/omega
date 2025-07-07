import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { POST_SPORT_SETTINGS } from "../../action/types";
import {
  postSportSettingFailure,
  postSportSettingSuccess,
} from "../../action/settings/postSportSettingsAction";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* postSportSettingRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/setting",
      action.payload.settingData
    );

    if (data?.meta?.code === 200) {
      yield put(postSportSettingSuccess(data?.data));
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data);
    } else if (data?.meta?.code === 400) {
      yield put(postSportSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.code === 400) {
      yield put(postSportSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else if (data?.meta?.code === 401) {
      yield put(postSportSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      invalidTokenAction();
    } else if (data?.code === 401) {
      yield put(postSportSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else {
      yield put(postSportSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(postSportSettingFailure());
    if (error?.response?.data?.code === 400) {
      notifyWarning(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchsportSettingAPI() {
  yield takeEvery(POST_SPORT_SETTINGS, postSportSettingRequest);
}

export default function* rootSaga() {
  yield all([watchsportSettingAPI()]);
}
