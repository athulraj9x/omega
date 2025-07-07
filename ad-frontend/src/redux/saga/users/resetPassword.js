import { all, call, put, takeEvery } from "redux-saga/effects";
import { RESET_PASSWORD } from "../../action/types";
import { resetPasswordSuccess, resetPasswordFailure } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* resetPasswordRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/reset-password",
      action?.payload?.datas
    );

    if (data.meta.code === 200) {
      yield put(resetPasswordSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess("password Updated", {position: toast.POSITION.BOTTOM_CENTER});
    } else if (data.meta.code !== 200) {
      yield put(resetPasswordFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    notifyDanger("password is not updated", {position: toast.POSITION.BOTTOM_CENTER});
    yield put(resetPasswordFailure());
  }
}

export function* watchresetPasswordAPI() {
  yield takeEvery(RESET_PASSWORD, resetPasswordRequest);
}

export default function* rootSaga() {
  yield all([watchresetPasswordAPI()]);
}
