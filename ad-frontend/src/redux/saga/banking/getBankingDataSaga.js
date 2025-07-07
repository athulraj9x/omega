//this is for fetching Dashboard from external Api

import { all, put, takeEvery } from "redux-saga/effects";
import { GET_BANKING_DATA } from "../../action/types";
import { getBankingDataSuccess, getBankingDataFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getBankingDataRequest() {
  try {
    const { data } = yield API.get("admin/banking");
    if (data.meta.code === 200) {
      yield put(getBankingDataSuccess(data));
    } else if (data.meta.code === 401) {
      yield put(getBankingDataFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBankingDataFailure());
    }
  } catch (error) {
    yield put(getBankingDataFailure());
  }
}

export function* watchBankingDataAPI() {
  yield takeEvery(GET_BANKING_DATA, getBankingDataRequest);
}

export default function* rootSaga() {
  yield all([watchBankingDataAPI()]);
}
