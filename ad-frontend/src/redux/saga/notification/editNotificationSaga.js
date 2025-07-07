import { all, call, put, takeEvery } from "redux-saga/effects";
import { EDITNOTIFICATION } from "../../action/types";
import {
  editNotificationSuccess,
  editNotificationFailure,
} from "../../action/notification/editNotification";
import API from "../../../utils/api";

function* editNotificationRequest(action) {
  try {
    const { data } = yield API.put("admin/notification", action.payload?.data);
    if (data.meta?.code === 200) {
      yield put(editNotificationSuccess(data));
      yield call(action.payload.callback, data);
    } else {
      yield put(editNotificationFailure(data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(editNotificationFailure());
    yield call(action.payload.callback, error);
  }
}
export function* watchPostNotificationAPI() {
  yield takeEvery(EDITNOTIFICATION, editNotificationRequest);
}

export default function* rootSaga() {
  yield all([watchPostNotificationAPI()]);
}
