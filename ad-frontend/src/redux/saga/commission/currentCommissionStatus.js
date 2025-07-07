import { all, call, put, takeEvery } from "redux-saga/effects";
import { COMMISSION_CURRENT_VALUE } from "../../action/types";
import {
  currentCommissionStatus,
} from "../../action";

function* setCurrentCommissionStatusCall(action) {
  try {
    if (action.payload.data) {
      yield put(currentCommissionStatus(action.payload.data));
      yield call(action.payload.callback, action.payload.data);
    }
  } catch (error) {
    console.error(error)
  }
}

export function* watchCurrentCommissionStatusCall() {
  yield takeEvery(COMMISSION_CURRENT_VALUE, setCurrentCommissionStatusCall);
}

export default function* rootSaga() {
  yield all([watchCurrentCommissionStatusCall()]);
}
