import { toast } from "react-toastify";
import { all, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { loginFailure, loginSuccess } from "../../action/auth/loginAction";
import { LOGOUT } from "../../action/types";

function* logoutRequest(action) {
  try {
    const { data } = yield API.post("admin/logout");
    if (data?.meta?.code === 200) {
      toast.success(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    } else {
      yield put(loginFailure());
      toast.warn("admin has been logout successfully.", {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    yield put(loginFailure());
    toast.error("Internal Server Error.", {position: toast.POSITION.BOTTOM_CENTER});
  }
}

export function* watchLogoutAPI() {
  yield takeEvery(LOGOUT, logoutRequest);
}

export default function* rootSaga() {
  yield all([watchLogoutAPI()]);
}
