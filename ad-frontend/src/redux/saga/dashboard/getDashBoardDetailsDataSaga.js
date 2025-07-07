//this is for fetching Dashboard from external Api

import { all, put, takeEvery,call } from "redux-saga/effects";
import { DASHBOARD_DETAILS } from "../../action/types";
import { getDashboardDataDetailsSuccess, getDashboardDataDetailsFailure } from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
} from "../../../utils/helper";

function* getDashboardDataDetailsRequest(action) {
  try {
    const { type, page, perPage } = action.payload;
    const { data } = yield API.get(`admin/dashboard-details?type=${type}&page=${page}&perPage=${perPage}`);
    if (data.meta.code === 200) {
      yield put(getDashboardDataDetailsSuccess(data));
      yield call(action?.payload?.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getDashboardDataDetailsFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getDashboardDataDetailsFailure());
    }
  } catch (error) {
    yield put(getDashboardDataDetailsFailure());
  }
}

export function* watchDashboardDetailsDataAPI() {
  yield takeEvery(DASHBOARD_DETAILS, getDashboardDataDetailsRequest);
}

export default function* rootSaga() {
  yield all([watchDashboardDetailsDataAPI()]);
}
