import { all, call, put, takeEvery } from "redux-saga/effects";
import { CHANGE_PASSWORD } from "../../action/types";
import { changePasswordSuccess, changePasswordFailure } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* changePasswordRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/change-password",
      action?.payload?.datas
    );
    if (data.meta.code === 200) {
      yield put(changePasswordSuccess(data));
      yield call(action.payload.callback, data.data);
      notifySuccess("password Updated", {position: toast.POSITION.BOTTOM_CENTER});
    } else if (data.meta.code !== 200) {
      yield put(changePasswordFailure());
      yield call(action.payload.callback, data.meta);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    notifyDanger("password is not updated", {position: toast.POSITION.BOTTOM_CENTER});
    yield put(changePasswordFailure());
  }
}

export function* watchChangePasswordAPI() {
  yield takeEvery(CHANGE_PASSWORD, changePasswordRequest);
}

export default function* rootSaga() {
  yield all([watchChangePasswordAPI()]);
}
