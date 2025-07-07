//this is for fetching Dashboard from external Api

import { all, put, takeEvery,call } from "redux-saga/effects";
import { GET_DASHBOARD_DATA } from "../../action/types";
import { getDashboardDataSuccess, getDashboardDataFailure } from "../../action";
import API from "../../../utils/api";
import {
  convertHKDToINR,
  invalidTokenAction,
  notifyWarning,
} from "../../../utils/helper";

function* getDashboardDataRequest(action) {
  try {

    const {selectedOption} = action?.payload
    
    const { data } = yield API.get(`admin/get-dashboard-data?selectedOption=${selectedOption}`);
    if (data.meta.code === 200) {
      yield put(getDashboardDataSuccess(data));
      yield call(action?.payload?.callback, data);
      if (data?.data?.betFairBalance) {
        const inrBalance = convertHKDToINR(data?.data?.betFairBalance);
        if (inrBalance < 10000)
          yield put(notifyWarning("Betfair balance is less than 10000!"));
      }
    } else if (data.meta.code === 401) {
      yield put(getDashboardDataFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getDashboardDataFailure());
    }
  } catch (error) {
    yield put(getDashboardDataFailure());
  }
}

export function* watchDashboardDataAPI() {
  yield takeEvery(GET_DASHBOARD_DATA, getDashboardDataRequest);
}

export default function* rootSaga() {
  yield all([watchDashboardDataAPI()]);
}
