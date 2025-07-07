import { all, put, takeEvery,call } from "redux-saga/effects";
import { GET_BETFAIR_BALANCE } from "../../action/types";
import { getBetfairBalanceSuccess, getBetfairBalanceFailure} from "../../action";
import API from "../../../utils/getBetFairBalanceApi";
import {
  convertHKDToINR,
  invalidTokenAction,
  notifyWarning,
} from "../../../utils/helper";

function* getBetFairBalanceRequest(action) {
  try {
    const { data } = yield API.get("admin/getBetfairBalance");
    
    if (data.meta.code === 200) {
      yield put(getBetfairBalanceSuccess(data));
      yield call(action?.payload?.callback, data);
      if (data?.data?.betFairBalance) {
        const inrBalance = convertHKDToINR(data?.data?.betFairBalance);
        if (inrBalance < 10000)
          yield put(notifyWarning("Betfair balance is less than 10000!"));
      }
    } else if (data.meta.code === 401) {
      yield put(getBetfairBalanceFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBetfairBalanceFailure());
    }
  } catch (error) {
    yield put(getBetfairBalanceFailure());
  }
}

export function* watchBetFairBalanceAPI() {
  yield takeEvery(GET_BETFAIR_BALANCE, getBetFairBalanceRequest);
}

export default function* rootSaga() {
  yield all([watchBetFairBalanceAPI()]);
}
