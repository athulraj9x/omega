import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { notifySuccess, notifyWarning } from "../../../utils/helper";
import { googleAuthenticatorOTPValidationFailure, googleAuthenticatorOTPValidationSuccess } from "../../action";
import { GOOGLE_AUTHENTICATOR_OTP_VALIDATION } from "../../action/types";

function* googleAuthenticatorOTPvalidationRequestAPI(action) {
  try {
    let response;
    if(action.payload.data.withoutAuth){
      const { data } = yield API.post(
        "/admin/two-factor-auth/generate-qr-code/withoutAuthVerify",
        action?.payload?.data
      );
      response = data
    }else{
      const { data } = yield API.post(
        "/admin/two-factor-auth/generate-qr-code/verify",
        action?.payload?.data
      );
      response = data
    }

    if (response?.meta?.code === 200) {
      yield put(googleAuthenticatorOTPValidationSuccess(response));
      yield call(action.payload.callback, response);
      notifySuccess(response?.meta?.message);
    } else if (response?.code === 400) {
      yield put(googleAuthenticatorOTPValidationFailure());
      notifyWarning(response?.message);
    } else if (response?.meta?.code !== 200) {
      notifyWarning(response?.meta?.message);
      yield call(action.payload.callback, response);
      yield put(googleAuthenticatorOTPValidationFailure());
    }
  } catch (error) {
    yield put(googleAuthenticatorOTPValidationFailure());
    notifyWarning(error?.response?.response?.message);
  }
}

export function* watchGoogleAuthenticatorAPIRequest() {
  yield takeEvery(GOOGLE_AUTHENTICATOR_OTP_VALIDATION, googleAuthenticatorOTPvalidationRequestAPI);
}

export default function* rootSaga() {
  yield all([watchGoogleAuthenticatorAPIRequest()]);
}
