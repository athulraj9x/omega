import { all, call, put, takeEvery } from "redux-saga/effects";
import { notifySuccess, notifyWarning } from "../../../utils/helper";
import API from "../../../utils/api";
import { googleloginValidationFailure, googleloginValidationSuccess } from "../../action";
import { GOOGLE_LOGIN_VALIDATION } from "../../action/types";

function* googleLoginValidationAPIRequest(action) {
  try {
    let responseData;
    if(action?.payload?.data?.authType=== "app"){
      const {data} = yield API.post(
        "/admin/two-factor-auth/app-code-validation",
        action?.payload?.data
      );
      responseData = data;
    }
    if(action?.payload?.data?.authType=== "google"){
      const {data} = yield API.post(
        "/admin/two-factor-auth/google-login-validation",
        action?.payload?.data
      );
      responseData = data;
    }
    if (responseData?.meta?.code === 200) {
      notifySuccess(responseData?.meta?.message);
      yield put(googleloginValidationSuccess(responseData));
      yield call(action.payload.callback, responseData);
    } else if (responseData?.code === 500) {
      yield put(googleloginValidationFailure());
      notifyWarning(responseData?.message);
    } else if (responseData?.meta?.code === 500) {
      yield put(googleloginValidationFailure());
      notifyWarning(responseData?.meta?.message);
    } else if (responseData?.code === 400) {
      yield put(googleloginValidationFailure());
      notifyWarning(responseData?.message);
    } else if (responseData?.meta?.code == 401) {
      yield put(googleloginValidationFailure());
      notifyWarning(responseData?.meta?.message);
      yield put(googleloginValidationFailure());
    } 
    
    else if (responseData?.meta?.code !== 200) {
      yield put(googleloginValidationFailure());
      notifyWarning(responseData?.meta?.message);
    }
  } catch (error) {
    yield put(googleloginValidationFailure());
    notifyWarning(error?.response?.responseData?.message);
  }
}

export function* watchGoogleLoginValidation() {
  yield takeEvery(GOOGLE_LOGIN_VALIDATION, googleLoginValidationAPIRequest);
}

export default function* rootSaga() {
  yield all([watchGoogleLoginValidation()]);
}
