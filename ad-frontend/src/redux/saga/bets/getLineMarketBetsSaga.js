import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_LINE_MARKET_BETS } from "../../action/types";
import {
  getLineMarketBetsSuccess,
  getLineMarketBetsFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getLineMarketBetsRequest(action) {
  try {
    const { eventId, filterBetAmount } = action?.payload;
    const { data } = yield API.get(
      `admin/get-line-markets-bets?eventId=${eventId}&filterBetAmount=${filterBetAmount}`
    );
    
    if (data.meta.code === 200) {
      yield put(getLineMarketBetsSuccess(data?.data));
    } else if (data.meta.code === 401) {
      yield put(getLineMarketBetsFailure());
      invalidTokenAction(); //helper function to remove localstorage data and reload
    } else if (data.meta.code !== 200) {
      yield put(getLineMarketBetsFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getLineMarketBetsFailure());
  }
}

export function* watchGetLineMarketBetsAPI() {
  yield takeEvery(GET_LINE_MARKET_BETS, getLineMarketBetsRequest);
}

export default function* rootSaga() {
  yield all([watchGetLineMarketBetsAPI()]);
}
