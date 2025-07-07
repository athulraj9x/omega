import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
  setLocalStorageItem,
} from "../../../utils/helper";
import { loginFailure, loginSuccess } from "../../action/auth/loginAction";
import { LOGIN } from "../../action/types";

function* loginRequest(action) {
  try {
    const { data } = yield API.post("admin/login", action?.payload?.data);
    if (data?.meta?.code === 200) {
      yield put(loginSuccess(data?.data));
      // yield call(setLocalStorageItem, "userData", JSON.stringify(data.data));
      // setLocalStorageItem("token", data?.meta?.token);
      const modifiedData = {
        ...data?.data,
        token:data?.meta?.token,
      };
      yield call(action?.payload?.callback, modifiedData);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(loginFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(loginFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchLoginAPI() {
  yield takeEvery(LOGIN, loginRequest);
}

export default function* rootSaga() {
  yield all([watchLoginAPI()]);
}
