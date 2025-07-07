import { all, call, put, takeEvery } from "redux-saga/effects";
import { TRANSACTION_STATUS } from "../../action/types";
import { toast } from "react-toastify";
import {
  transactionStatusSuccess,
  transactionStatusFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* depositStatusRequest(action) {
  try {
    let isCryptoWithdrawalMethod = false;
    let data = null;
    if (action?.payload?.data && action?.payload?.data?.withdrawalMethod) {
      isCryptoWithdrawalMethod = action?.payload?.data?.withdrawalMethod === "crypto";
    }

    if (isCryptoWithdrawalMethod) {
      const response = yield API.put(`admin/transaction-update-crypto-payment`, action?.payload?.data);
      data = response?.data;
    } else {
      const response = yield API.put(`admin/transaction`, action?.payload?.data);
      data = response?.data;
    }

    if (data?.meta?.code === 200) {
      yield put(transactionStatusSuccess(data));
      yield call(action?.payload?.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action?.payload?.callback, data);
      yield put(transactionStatusFailure());
      invalidTokenAction();
    } else if (data?.code === 400) {
      yield put(transactionStatusFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.code === 406) {
      yield put(transactionStatusFailure());
      yield call(action?.payload?.callback, data);
    } else {
      yield put(transactionStatusFailure());
      yield call(action?.payload?.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(transactionStatusFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDepositStatusAPI() {
  yield takeEvery(TRANSACTION_STATUS, depositStatusRequest);
}

export default function* rootSaga() {
  yield all([watchDepositStatusAPI()]);
}
