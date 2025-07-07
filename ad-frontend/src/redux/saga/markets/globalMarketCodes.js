import { all, call, put, takeEvery } from "redux-saga/effects";
import { GLOBAL_MARKET_CODES } from "../../action/types/index";
import { globalMaketCodeSuccess } from "../../action/market/globalMarketCodes";
import { setLocalStorageItem } from "../../../utils/helper";

function* addGlobalMarketCodes(action) {
  try {
    yield put(globalMaketCodeSuccess(action.payload.data));
    yield call(
      setLocalStorageItem,
      "globalMarketCodes",
      JSON.stringify(action.payload.data)
    );
  } catch (error) {
    console.log(error);
  }
}

export function* watchaddGlobalMarketCodes() {
  yield takeEvery(GLOBAL_MARKET_CODES, addGlobalMarketCodes);
}

export default function* rootSaga() {
  yield all([watchaddGlobalMarketCodes()]);
}
