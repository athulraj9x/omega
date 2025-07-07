import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { TWO_FACTOR_TOGGLE_SETTING } from "../../action/types";
import {
  twoFactorToggleSettingsSuccess,
  twoFactorToggleSettingsFailure
} from "../../action/users/TwoFactorToggleSettingsAction";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* TwoFactorToggleRequestAPI(action) {
  try {
    const { data } = yield API.put(`admin/two-factor-toggle/${action.payload.data}`);
    if (data?.meta?.code === 200) {
      yield put(twoFactorToggleSettingsSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }else{
      yield put(twoFactorToggleSettingsFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(twoFactorToggleSettingsFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchtwoFactorToggleSettingsWatchAPI() {
  yield takeEvery(TWO_FACTOR_TOGGLE_SETTING, TwoFactorToggleRequestAPI);
}

export default function* rootSaga() {
  yield all([watchtwoFactorToggleSettingsWatchAPI()]);
}
