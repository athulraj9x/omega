import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_RESULT_TRANSACTION_DETAILS } from "../../action/types";
import {
  getResultTransationDetailSuccess,
  getResultTransationDetailFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getResultTransactionDetailRequest(action) {
  try {
    const { marketId, role, userId, myReport } = action?.payload?.data;
    let responseData;
    if (userId) {
      const { data } = yield API.get(
        `admin/result-transaction-subchild?marketId=${marketId}&userId=${userId}&role=${role}`
      );
      responseData = data;
    } else {
      const { data } = yield API.get(
        `admin/result-transaction-child?marketId=${marketId}`
      );
      responseData = data;
    }
  
    if (responseData.meta.code === 200) {
      yield put(getResultTransationDetailSuccess(responseData));
      yield call(action.payload.callback, responseData);
    } else if (responseData.meta.code === 401) {
      yield put(getResultTransationDetailFailure());
      invalidTokenAction();
    } else if (responseData.meta.code !== 200) {
      yield put(getResultTransationDetailFailure());
    }
  } catch (error) {
    yield put(getResultTransationDetailFailure());
  }
}

export function* watchGetResultTransactionAPI() {
  yield takeEvery(
    GET_RESULT_TRANSACTION_DETAILS,
    getResultTransactionDetailRequest
  );
}

export default function* rootSaga() {
  yield all([watchGetResultTransactionAPI()]);
}
