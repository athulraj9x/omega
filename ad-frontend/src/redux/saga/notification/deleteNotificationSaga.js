import { all, call, put, takeEvery } from "redux-saga/effects";
import { DELETE_NOTIFICATION } from "../../action/types";
import {
  deleteNotificationSucess,
  deleteNotificationFailure,
} from "../../action/notification/deleteNotification";
import API from "../../../utils/api";

function* deleteNotificationRequest(action) {
  try {
    const { data } = yield API.delete(
      `admin/notification/${action.payload?.id}`
    );
    if (data.meta?.code === 200) {
      yield put(deleteNotificationSucess(data));
      yield call(action.payload.callback, data);
    } else {
      yield put(deleteNotificationFailure(data));
    }
  } catch (error) {
    yield put(deleteNotificationFailure());
  }
}
export function* watchgetDeleteAPI() {
  yield takeEvery(DELETE_NOTIFICATION, deleteNotificationRequest);
}

export default function* rootSaga() {
  yield all([watchgetDeleteAPI()]);
}
