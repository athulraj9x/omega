import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_RESULT_TRANSACTION } from "../../action/types";
import {
  getResultTransationSuccess,
  getResultTransationFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getResultTransactionRequest(action) {
  try {
    let response;
    if (action.payload.path === "/betfair-reports") {
      let data = yield API.get(
        `admin/betfair-reports?start_date=${action?.payload?.startDate}&end_date=${action?.payload?.endDate}&isChecked=${action?.payload?.isChecked}`
      );
      response = data;
    } else {
      let data = yield API.get(
        `admin/result-transaction?type=${action?.payload?.type}&start_date=${action?.payload?.startDate}&end_date=${action?.payload?.endDate}&isChecked=${action?.payload?.isChecked}`
      );
      response = data;
    }

    if (response.data.meta.code === 200) {
      yield put(getResultTransationSuccess(response?.data?.data));
      yield call(action.payload.callback, response?.data);
    } else if (response.data.meta.code === 401) {
      yield put(getResultTransationFailure());
      invalidTokenAction();
    } else if (response.data.meta.code !== 200) {
      yield put(getResultTransationFailure());
      yield call(action.payload.callback, response);
    }
  } catch (error) {
    yield put(getResultTransationFailure());
  }
}

export function* watchGetResultTransactionAPI() {
  yield takeEvery(GET_RESULT_TRANSACTION, getResultTransactionRequest);
}

export default function* rootSaga() {
  yield all([watchGetResultTransactionAPI()]);
}
