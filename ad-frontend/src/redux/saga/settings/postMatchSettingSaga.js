import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { POST_MATCH_SETTING } from "../../action/types";
import {
  postMatchSettingSuccess,
  postMatchSettingFailure,
} from "../../action";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* postMatchSettingRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-match-setting",
      action.payload.eventPayload
    );
   
    if (data?.meta?.code === 200) {
      yield put(postMatchSettingSuccess(data?.data));
      notifySuccess(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
      yield call(action.payload.callback, data);
    } else if (data?.meta?.code === 400) {
      yield put(postMatchSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else if (data?.code === 400) {
      yield put(postMatchSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else if (data?.meta?.code === 401) {
      yield put(postMatchSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }else if (data?.code === 401) {
      yield put(postMatchSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else {
      yield put(postMatchSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    yield put(postMatchSettingFailure());
    if (error?.response?.data?.code === 400) {
      notifyWarning(error?.response?.data?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else {
      notifyDanger("Internal Server Error.", {position: toast.POSITION.BOTTOM_CENTER});
    }
  }
}

export function* watchPostMatchSettingAPI() {
  yield takeEvery(POST_MATCH_SETTING, postMatchSettingRequest);
}

export default function* rootSaga() {
  yield all([watchPostMatchSettingAPI()]);
}
