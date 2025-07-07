//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_MARKETS } from "../../action/types";
import { getMarketSuccess, getMarketFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getMarketsRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-markets?event_id=${action?.payload?.marketId}`
    );
    if (data.meta.code === 200) {
      yield put(getMarketSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getMarketFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getMarketFailure());
    }
  } catch (error) {
    yield put(getMarketFailure());
  }
}

export function* watchMarketsAPI() {
  yield takeEvery(GET_MARKETS, getMarketsRequest);
}

export default function* rootSaga() {
  yield all([watchMarketsAPI()]);
}
