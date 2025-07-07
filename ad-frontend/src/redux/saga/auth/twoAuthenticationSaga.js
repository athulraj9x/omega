import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning, setLocalStorageItem } from "../../../utils/helper";
import { twoAuthenticationFailure,twoAuthenticationSuccess } from "../../action/auth/TwoFactorAction";
import { TWO_AUTHENTICATION } from "../../action/types";

function* twoAuthenticationSaga(action) {
  try {
    const { data } = yield API.post("admin/two-factor-verification", action?.payload?.data);
    if (data?.meta?.code === 200) {
      yield put(twoAuthenticationSuccess(data?.data));
      yield call(action?.payload?.callback, data?.data);
      notifySuccess(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }else if (data?.meta.code === 401) {
      yield put(twoAuthenticationFailure());
      invalidTokenAction();
    }  else {
      yield put(twoAuthenticationFailure());
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    console.log(error)
    yield put(twoAuthenticationFailure());
    notifyDanger("Internal Server Error.", {position: toast.POSITION.BOTTOM_CENTER});
  }
}

export function* watchTwoFactorAuthticationAPI() {
  yield takeEvery(TWO_AUTHENTICATION, twoAuthenticationSaga);
}

export default function* rootSaga() {
  yield all([watchTwoFactorAuthticationAPI()]);
}
