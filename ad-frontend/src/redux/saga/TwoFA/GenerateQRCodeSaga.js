import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import { notifySuccess, notifyWarning } from "../../../utils/helper";
import { GENERATE_QR_CODE } from "../../action/types";
import { GenerateQRcodeFailure, GenerateQRcodeSuccess } from "../../action";

function* GenerateQRcodeAPIrequest(action) {
  try {
    const { data } = yield API.get(
      "/admin/two-factor-auth/generate-qr-code",
      action?.payload?.data
    );
    if (data?.meta?.code === 200) {
      yield put(GenerateQRcodeSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message);
    } else if (data?.code === 400) {
      yield put(GenerateQRcodeFailure());
      notifyWarning(data?.message);
    } else if (data?.meta?.code !== 200) {
      yield put(GenerateQRcodeFailure());
      notifyWarning(data?.meta?.message);
    }
  } catch (error) {
    yield put(GenerateQRcodeFailure());
    notifyWarning(error?.response?.data?.message);
  }
}

export function* watchGenerateQRcodeAPIrequest() {
  yield takeEvery(GENERATE_QR_CODE, GenerateQRcodeAPIrequest);
}

export default function* rootSaga() {
  yield all([watchGenerateQRcodeAPIrequest()]);
}
