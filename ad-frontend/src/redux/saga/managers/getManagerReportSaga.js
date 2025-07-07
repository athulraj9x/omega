import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_ACCOUNTS_MANAGER_REPORTS } from "../../action/types";
import {
  getManagerReportsSuccess,
  getManagerReportsFailure,
} from "../../action";
import API from "../../../utils/api";

function* getManagersReportRequest(action) {
  try {
    // const { role } = action.payload;

    const { data } = yield API.get(`admin/accounts-manager-reports`);

    if (data.meta.code === 200) {
      yield put(getManagerReportsSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getManagerReportsFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield call(action.payload.callback, error);
    yield put(getManagerReportsFailure());
  }
}

export function* watchGetManagersReportsAPI() {
  yield takeEvery(GET_ACCOUNTS_MANAGER_REPORTS, getManagersReportRequest);
}

export default function* rootSaga() {
  yield all([watchGetManagersReportsAPI()]);
}
