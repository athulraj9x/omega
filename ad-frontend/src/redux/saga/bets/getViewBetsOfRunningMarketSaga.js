import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_VIEW_BETS_OF_RUNNING_MARKET } from "../../action/types";
import { getViewBetsOfRunningMarketSuccess, getViewBetsOfRunningMarketFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getViewBetsOfRunningMarketRequest(action) {
  try {
    const { eventId, currentPage, perPage, currencyId, marketId, isMultiple, deleted, type , username, filterBetAmount} =
      action?.payload;
      // console.log(" action?.payload", action?.payload);
    const { data } = yield API.get(
      `admin/get-view-bets-running-market?eventId=${eventId}&marketId=${marketId}&username=${username}&isMultiple=${isMultiple}&currencyId=${currencyId}&del=${deleted}&type=${type}&per_page=${perPage}&page=${currentPage}&filterBetAmount=${filterBetAmount}`
    );

    if (data.meta.code === 200) {
      yield put(getViewBetsOfRunningMarketSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getViewBetsOfRunningMarketFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getViewBetsOfRunningMarketFailure());
    }
  } catch (error) {
    yield put(getViewBetsOfRunningMarketFailure());
  }
}

export function* watchGetViewBetsOfRunningMarketAPI() {
  yield takeEvery(GET_VIEW_BETS_OF_RUNNING_MARKET, getViewBetsOfRunningMarketRequest);
}

export default function* rootSaga() {
  yield all([watchGetViewBetsOfRunningMarketAPI()]);
}
