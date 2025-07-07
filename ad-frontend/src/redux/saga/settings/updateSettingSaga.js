import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_SETTING } from "../../action/types";
import { updateSettingSuccess, updateSettingFailure } from "../../action";
import API from "../../../utils/api";
import { notifySuccess, notifyWarning } from "../../../utils/helper";

function* updateSettingRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-setting",
      action.payload.settingObj
    );

    if (data?.meta?.code === 200) {
      yield put(updateSettingSuccess(data?.data));
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data);
    } else if (data?.meta?.code === 400) {
      yield put(updateSettingFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(updateSettingFailure());
  }
}

export function* watchUpdateSettingAPI() {
  yield takeEvery(UPDATE_SETTING, updateSettingRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateSettingAPI()]);
}
