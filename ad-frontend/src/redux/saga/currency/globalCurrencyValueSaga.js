import { all, put, takeEvery } from "redux-saga/effects";
import { GLOBAL_CURRENCY_VALUE } from "../../action/types";
import { globalCurrencyValueSuccess } from "../../action/currency/globalCurrencyValueAction";

function* addGlobalCurrencyValue(action) {
  try {
    yield put(globalCurrencyValueSuccess(action.payload.data));
  } catch (error) {
    console.log(error);
  }
}

export function* watchaddGlobalCurrencyValue() {
  yield takeEvery(GLOBAL_CURRENCY_VALUE, addGlobalCurrencyValue);
}

export default function* rootSaga() {
  yield all([watchaddGlobalCurrencyValue()]);
}
