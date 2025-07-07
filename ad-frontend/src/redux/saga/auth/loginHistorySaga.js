import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  loginHistoryFailure,
  loginHistorySuccess,
} from "../../action";
import { LOGIN_HISTORY } from "../../action/types";
import { invalidTokenAction, notifyDanger, notifyWarning } from "../../../utils/helper";

function* loginHistoryRequest() {
  try {
    const { data } = yield API.get(`admin/login-history`);
    if (data?.meta?.code === 200) {
      yield put(loginHistorySuccess(data?.data));
    } else if (data?.meta?.code === 401) {
      yield put(loginHistoryFailure());
      invalidTokenAction();
    }else {
      yield put(loginHistoryFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(loginHistoryFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchLoginAPI() {
  yield takeEvery(LOGIN_HISTORY, loginHistoryRequest);
}

export default function* rootSaga() {
  yield all([watchLoginAPI()]);
}
