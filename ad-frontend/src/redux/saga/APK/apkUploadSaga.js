import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { upload_apk_Failure, upload_apk_Success } from "../../action";
import { UPLOAD_APK } from "../../action/types";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning, setLocalStorageItem } from "../../../utils/helper";

function* authDetailRequest(action) {
  try {
    const { data } = yield API.post('admin/uploadAPK',action?.payload?.data);
    if (data?.meta?.code === 200) {
      yield put(upload_apk_Success(data?.data));
      yield call(action?.payload?.callback, data?.data);
    }else if (data?.meta.code === 401) {
      yield put(upload_apk_Failure());
      invalidTokenAction();
    } else {
      yield put(upload_apk_Failure());
    }
  } catch (error) {
    yield put(upload_apk_Failure());
  }
}

export function* watchAuthDetailAPI() {
  yield takeEvery(UPLOAD_APK, authDetailRequest);
}

export default function* rootSaga() {
  yield all([watchAuthDetailAPI()]);
}
