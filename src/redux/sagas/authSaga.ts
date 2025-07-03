import { call, put, takeLatest } from "redux-saga/effects";
import { LOGIN_REQUEST, LoginPayload } from "../types/authTypes";
import { loginSuccess, loginFailure } from "../actions";

// mock API call
function* loginApi(payload: LoginPayload): any {
  return yield new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.email === "admin@example.com" && payload.password === "123456") {
        resolve({ id: 1, name: "Admin", email: payload.email });
      } else {
        reject("Invalid credentials");
      }
    }, 1000);
  });
}

function* handleLogin(action: { type: string; payload: LoginPayload }) {
  try {
    const user = yield call(loginApi, action.payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error as string));
  }
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
}
