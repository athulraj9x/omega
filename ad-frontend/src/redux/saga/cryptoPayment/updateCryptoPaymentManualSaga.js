import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { CRYPTO_PAYMENT_MANUAL_UPDATEION } from "../../action/types";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";
import { cryptoPaymentManualUpdationFailure, cryptoPaymentManualUpdationSuccess } from "../../action";

function* updateCryptoPaymentManual(action) {
  try {
    const { data } = yield API.post(
      `admin/update-crypto-payment-manual`,action.payload.data
    );
    if (data.meta.code === 200) {
      yield put(cryptoPaymentManualUpdationSuccess(data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(cryptoPaymentManualUpdationFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(cryptoPaymentManualUpdationFailure());
    }
  } catch (error) {
    yield put(cryptoPaymentManualUpdationFailure());
  }
}

export function* cryptoPaymentManualUpdation() {
  yield takeEvery(CRYPTO_PAYMENT_MANUAL_UPDATEION, updateCryptoPaymentManual);
}

export default function* rootSaga() {
  yield all([cryptoPaymentManualUpdation()]);
}
