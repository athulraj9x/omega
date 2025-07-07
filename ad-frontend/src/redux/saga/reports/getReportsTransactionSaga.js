import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_REPORT_TRANSACTION } from "../../action/types";
import {
  getReportTransationSuccess,
  getReportTransationFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getReportTransactionRequest(action) {
  try {
    var data = null;
    if (action?.payload?.manager) {
      data = yield API.get(
        `admin/accounts-manager-reports?page=${action?.payload?.page}&perPage=${action?.payload?.perPage}&layer_id=${action?.payload?.layer_id}&username=${action?.payload?.username}&type=${action?.payload?.type}&start_date=${action?.payload?.startDate}&end_date=${action?.payload?.endDate}&isChecked=${action?.payload?.isChecked}`
      );
    } else {
      if (action?.payload?.role === 7) {
        data = yield API.get(
          `admin/result-transaction-user?page=${action?.payload?.page}&perPage=${action?.payload?.perPage}&layer_id=${action?.payload?.layer_id}&commission=${action?.payload?.commission}&username=${action?.payload?.username}&type=${action?.payload?.type}&start_date=${action?.payload?.startDate}&end_date=${action?.payload?.endDate}&isChecked=${action?.payload?.isChecked}`
        );
      } else {
        data = yield API.get(
          `admin/result-transaction-layer?page=${action?.payload?.page}&perPage=${action?.payload?.perPage}&layer_id=${action?.payload?.layer_id}&type=${action?.payload?.type}&start_date=${action?.payload?.startDate}&end_date=${action?.payload?.endDate}&isChecked=${action?.payload?.isChecked}`
        );
      }
    }

    if (data.status === 200) {
      yield put(getReportTransationSuccess(data?.data?.data));
      yield call(action.payload.callback, data?.data?.data);
    } else if (data.meta.code === 401) {
      yield put(getReportTransationFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getReportTransationFailure());
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(getReportTransationFailure());
  }
}

export function* watchGetReportTransactionAPI() {
  yield takeEvery(GET_REPORT_TRANSACTION, getReportTransactionRequest);
}

export default function* rootSaga() {
  yield all([watchGetReportTransactionAPI()]);
}
