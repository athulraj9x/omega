//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETS_BY_MARKET_ID } from "../../action/types";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";
import { getBetsByMarketIdFailure, getBetsByMarketIdSuccess } from "../../action";

function* getBetsByMarketIdAPIRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-bets-by-market-id?marketId=${action?.payload?.marketId}`
    );
    if (data.meta.code === 200) {
      yield put(getBetsByMarketIdSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getBetsByMarketIdFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBetsByMarketIdFailure());
    }
  } catch (error) {
    yield put(getBetsByMarketIdFailure());
  }
}

export function* watchGetBetsByMarketIdAPI() {
  yield takeEvery(GET_BETS_BY_MARKET_ID, getBetsByMarketIdAPIRequest);
}

export default function* rootSaga() {
  yield all([watchGetBetsByMarketIdAPI()]);
}
