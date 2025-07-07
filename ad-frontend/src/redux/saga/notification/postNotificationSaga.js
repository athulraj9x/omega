import { all, call, put, takeEvery } from "redux-saga/effects";
import { POSTNOTIFICATION } from "../../action/types";
import {
  postNotificationSuccess,
  postNotificationFailure,
} from "../../action/notification/postNotification";
import API from "../../../utils/api";

function* postNotificationRequest(action) {
  try {
    const { data } = yield API.post("admin/notification", action.payload);
    if (data.meta?.code === 200) {
      yield put(postNotificationSuccess(data));
      yield call(action.payload.callback, data);
    } else {
      yield put(postNotificationFailure(data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(postNotificationFailure());
    yield call(action.payload.callback, error);
  }
}
export function* watchPostNotificationAPI() {
  yield takeEvery(POSTNOTIFICATION, postNotificationRequest);
}

export default function* rootSaga() {
  yield all([watchPostNotificationAPI()]);
}
