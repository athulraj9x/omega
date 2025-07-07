import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_ACTIVE_FANCIES } from "../../action/types";
import { getActiveFanciesSuccess, getActiveFanciesFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getActiveFanciesRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-active-fanies-of-event/?event_id=${action?.payload?.eventCode}`
    );
    if (data.meta.code === 200) {
      yield put(getActiveFanciesSuccess(data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getActiveFanciesFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getActiveFanciesFailure());
    }
  } catch (error) {
    yield put(getActiveFanciesFailure());
  }
}

export function* watchtgetActiveFanciesAPI() {
  yield takeEvery(GET_ACTIVE_FANCIES, getActiveFanciesRequest);
}

export default function* rootSaga() {
  yield all([watchtgetActiveFanciesAPI()]);
}
