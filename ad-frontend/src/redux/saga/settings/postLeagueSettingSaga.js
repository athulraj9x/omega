import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { POST_LEAGUE_SETTING } from "../../action/types";
import {
  postLeagueSettingSuccess,
  postLeagueSettingFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* postLeagueSettingRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-league-setting",
      action.payload?.leaguePayload
    );

    if (data?.meta?.code === 200) {
      yield put(postLeagueSettingSuccess(data?.data));
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data);
    } else if (data?.meta?.code === 400) {
      yield put(postLeagueSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.code === 400) {
      yield put(postLeagueSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else if (data?.meta?.code === 401) {
      yield put(postLeagueSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.code === 401) {
      yield put(postLeagueSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else {
      yield put(postLeagueSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(postLeagueSettingFailure());
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

export function* watchPostLeagueSettingAPI() {
  yield takeEvery(POST_LEAGUE_SETTING, postLeagueSettingRequest);
}

export default function* rootSaga() {
  yield all([watchPostLeagueSettingAPI()]);
}
