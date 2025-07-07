//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_MARKET_ANALYSIS_DATA } from "../../action/types";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";
import { getMarketAnalysisDataFailure,getMarketAnalysisDataSuccess } from "../../action";

function* getMarketAnalysisDataRequest(action) {
  try {
    const { data } = yield API.get(`admin/get-data-market-analysis?from=${action.payload.from}&to=${action.payload.to}`);
    if (data.meta.code === 200) {
      yield put(getMarketAnalysisDataSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getMarketAnalysisDataFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getMarketAnalysisDataFailure());
    }
  } catch (error) {
    yield put(getMarketAnalysisDataFailure());
  }
}

export function* watchGetMarketAnalysisAPI() {
  yield takeEvery(GET_MARKET_ANALYSIS_DATA, getMarketAnalysisDataRequest);
}

export default function* rootSaga() {
  yield all([watchGetMarketAnalysisAPI()]);
}
