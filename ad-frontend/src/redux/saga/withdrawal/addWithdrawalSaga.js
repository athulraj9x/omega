import { all, call, put, takeEvery } from "redux-saga/effects";
import { ADD_WITHDRAWAL } from "../../action/types";
import { toast } from "react-toastify";
import { addWithdrawalSuccess, addWithdrawalFailure } from "./../../action";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addWithdrawalRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/transaction",
      action?.payload?.datas
    ); // Add the URL from Backend & send data
    if (data.meta.code === 200) {
      yield put(addWithdrawalSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else if (data.meta.code !== 200) {
      yield put(addWithdrawalFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
    }
  } catch (error) {
    yield put(addWithdrawalFailure());
    notifyDanger("Internal Server Error.", { position: toast.POSITION.BOTTOM_CENTER });
  }
}

export function* watchWithdrawalAPI() {
  yield takeEvery(ADD_WITHDRAWAL, addWithdrawalRequest);
}

export default function* rootSaga() {
  yield all([watchWithdrawalAPI()]);
}
