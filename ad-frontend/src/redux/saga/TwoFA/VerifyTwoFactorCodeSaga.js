import { all, call, put, takeEvery } from "redux-saga/effects";
import { notifySuccess,notifyWarning } from "../../../utils/helper";
import API from "../../../utils/api";
import { VERIFY_TWO_FACTOR_CODE } from "../../action/types";
import { VerifyTwoFactorCodeActionFailure, VerifyTwoFactorCodeActionSuccess } from "../../action";




function* verifyTwoFactorCodeRequest(action) {
  try {
    const { data } = yield API.post(
      "/admin/two-factor-auth/verify",
      action?.payload?.data
    );
    if (data?.meta?.code === 200) {
      notifySuccess(data?.meta?.message);
      yield put(VerifyTwoFactorCodeActionSuccess(data));
      yield call(action.payload.callback, data);

    }else if (data?.code === 500) {
      notifyWarning(data?.message);
      yield put(VerifyTwoFactorCodeActionFailure());
    } 
    else if (data?.code === 400) {
      yield put(VerifyTwoFactorCodeActionFailure());
      notifyWarning(data?.message);
    } else if (data?.meta?.code !== 200) {
      yield put(VerifyTwoFactorCodeActionFailure());
      notifyWarning(data?.meta?.message);
    }
  } catch (error) {
    yield put(VerifyTwoFactorCodeActionFailure());
    notifyWarning(error?.response?.data?.message);
  }
}

export function* watchVerifyTwoFactorCodeAPI() {
  yield takeEvery(VERIFY_TWO_FACTOR_CODE, verifyTwoFactorCodeRequest);
}

export default function* rootSaga() {
  yield all([watchVerifyTwoFactorCodeAPI()]);
}
