import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETS_OF_RUNNING_MARKET } from "../../action/types";
import { getBetsOfRunningMarketSuccess, getBetsOfRunningMarketFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getBetsOfRunningMarketRequest(action) {
  try {
    const { eventId, currentPage, perPage, currencyId, deleted, type, filterBetAmount } =
      action?.payload;
    const { data } = yield API.get(
      `admin/get-bets-running-market?eventId=${eventId}&currencyId=${currencyId}&del=${deleted}&type=${type}&per_page=${perPage}&page=${currentPage}&filterBetAmount=${filterBetAmount}`
    );

    if (data.meta.code === 200) {
      yield put(getBetsOfRunningMarketSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getBetsOfRunningMarketFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBetsOfRunningMarketFailure());
    }
  } catch (error) {
    yield put(getBetsOfRunningMarketFailure());
  }
}

export function* watchGetBetsOfRunningMarketAPI() {
  yield takeEvery(GET_BETS_OF_RUNNING_MARKET, getBetsOfRunningMarketRequest);
}

export default function* rootSaga() {
  yield all([watchGetBetsOfRunningMarketAPI()]);
}
