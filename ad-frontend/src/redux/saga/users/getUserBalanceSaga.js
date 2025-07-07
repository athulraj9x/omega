import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_USER_BALANCE } from "../../action/types";
import { getUserBalanceSuccess, getUserBalanceFailure } from "../../action";
import API from "../../../utils/api";

function* getUserBalanceRequest(action) {
  try {
    const { data } = yield API.get("admin/layer");
    if (data.meta.code === 200) {
      yield put(getUserBalanceSuccess(data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code !== 200) {
      yield put(getUserBalanceFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(getUserBalanceFailure());
  }
}

export function* watchUserBalanceAPI() {
  yield takeEvery(GET_USER_BALANCE, getUserBalanceRequest);
}

export default function* rootSaga() {
  yield all([watchUserBalanceAPI()]);
}
