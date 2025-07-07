import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_FANCY_MARKET_BETS } from "../../action/types";
import {
  getFancyMarketBetsFailure,
  getFancyMarketBetsSuccess,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getFancyMarketBetsRequest(action) {
  try {
    const { eventId, filterBetAmount } = action?.payload;
    const { data } = yield API.get(
      `admin/get-fancy-markets-bets?eventId=${eventId}&filterBetAmount=${filterBetAmount}`
    );
    if (data.meta.code === 200) {
      yield put(getFancyMarketBetsSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getFancyMarketBetsFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else if (data.meta.code !== 200) {
      yield put(getFancyMarketBetsFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getFancyMarketBetsFailure());
  }
}

export function* watchGetFancyMarketBetsAPI() {
  yield takeEvery(GET_FANCY_MARKET_BETS, getFancyMarketBetsRequest);
}

export default function* rootSaga() {
  yield all([watchGetFancyMarketBetsAPI()]);
}
