import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_WITHDRAWAL } from "../../action/types";
import { getWithdrawalSuccess, getWithdrawalFailure } from "./../../action";
import API from "../../../utils/api";
import { notifyWarning } from "../../../utils/helper";

function* getWithdrawalRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/withdrawal-list?status=${action?.payload?.data}&page=${action.payload.page}&perPage=${action.payload.perPage}`
    ); // Add the URL from Backend & send data
    if (data.meta.code === 200) {
      yield put(getWithdrawalSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code !== 200) {
      yield put(getWithdrawalFailure());
      notifyWarning(data.meta.message);
    }
  } catch (error) {
    yield put(getWithdrawalFailure());
  }
}

export function* watchWithdrawalAPI() {
  yield takeEvery(GET_WITHDRAWAL, getWithdrawalRequest);
}

export default function* rootSaga() {
  yield all([watchWithdrawalAPI()]);
}
