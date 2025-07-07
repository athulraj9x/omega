import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { authDetailFailure, authDetailSuccess } from "../../action";
import { AUTH_DETAIL } from "../../action/types";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning, setLocalStorageItem } from "../../../utils/helper";

function* authDetailRequest(action) {
  try {
    const { data } = yield API.get(`admin/auth-detail?username=${action?.payload?.username}`);
    if (data?.meta?.code === 200) {
      yield put(authDetailSuccess(data?.data));
      yield call(action?.payload?.callback, data?.data);
    } else if (data?.meta?.code === 401) {
      yield put(authDetailFailure());
      invalidTokenAction();
    } else {
      yield put(authDetailFailure());
    }
  } catch (error) {
    yield put(authDetailFailure());
  }
}

export function* watchAuthDetailAPI() {
  yield takeEvery(AUTH_DETAIL, authDetailRequest);
}

export default function* rootSaga() {
  yield all([watchAuthDetailAPI()]);
}
