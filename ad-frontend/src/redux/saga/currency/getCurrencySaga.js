import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_CURRENCY, UPDATE_CURRENCY_REQUEST } from "../../action/types";
import {
  getCurrencySuccess,
  getCurrencyFailure,
  updateCurrencyFailure,
  updateCurrencySuccess,
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* getCurrencyRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/currency?toggled=${action?.payload?.betFair}`
    );
    if (data.meta.code === 200) {
      yield put(getCurrencySuccess(data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getCurrencyFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getCurrencyFailure());
    }
  } catch (error) {
    yield put(getCurrencyFailure());
  }
}

function* updateCurrencyRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-currency",
      action.payload.data
    );
    if (data.meta.code === 200) {
      yield put(updateCurrencySuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.code === 400) {
      yield put(updateCurrencyFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.meta);
    } else {
      yield put(updateCurrencyFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(updateCurrencyFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    // if (error?.response?.data?.code === 400) {
    //   toast.warn(error?.response?.data?.message);
    //   yield call(action.payload.callback, "");
    // } else {
    //   toast.error("Internal Server Error.");
    // }
  }
}

export function* watchUpdateCurrencyAPI() {
  yield takeEvery(UPDATE_CURRENCY_REQUEST, updateCurrencyRequest);
}

export function* watchCurrencyAPI() {
  yield takeEvery(GET_CURRENCY, getCurrencyRequest);
}

export default function* rootSaga() {
  yield all([watchCurrencyAPI(), watchUpdateCurrencyAPI()]);
}
