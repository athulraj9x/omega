import { all, call, put, takeEvery } from "redux-saga/effects";
import { ADD_DEPOSIT } from "../../action/types";
import { toast } from "react-toastify";
import { addDepositSuccess, addDepositFailure } from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* addDepositRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/transaction",
      action?.payload?.datas
    ); // Add the URL from Backend & send data
    if (data?.meta?.code === 200) {
      yield put(addDepositSuccess(data?.data));
      yield call(action?.payload?.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      yield put(addDepositFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(addDepositFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addDepositFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(addDepositFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDepositAPI() {
  yield takeEvery(ADD_DEPOSIT, addDepositRequest);
}

export default function* rootSaga() {
  yield all([watchDepositAPI()]);
}
