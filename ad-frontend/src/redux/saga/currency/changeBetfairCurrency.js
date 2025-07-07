import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  changeBetfairCurrencyFailure,
  changeBetfairCurrencySuccess,
} from "../../action/currency/changeBetairCurrencyAction";
import { CHANGE_BETFAIR_CURRENCY } from "../../action/types";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* chaneBetfairCurrencyRequest(action) {
  try {
    const { data } = yield API.put(
      "admin/selected-currency-bet",
      action.payload.data
    );
    if (data.meta.code === 200) {
      yield put(changeBetfairCurrencySuccess(data.data));
      yield call(action.payload.callback, data.meta);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(changeBetfairCurrencyFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.meta);
    } else if (data.meta.code === 401) {
      yield put(changeBetfairCurrencyFailure());
      invalidTokenAction();
    } else {
      yield put(changeBetfairCurrencyFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(changeBetfairCurrencyFailure());
    if (error?.response?.data?.code === 400) {
      notifyWarning(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, "");
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchChangeBetfairCurrencyAPI() {
  yield takeEvery(CHANGE_BETFAIR_CURRENCY, chaneBetfairCurrencyRequest);
}

export default function* rootSaga() {
  yield all([watchChangeBetfairCurrencyAPI()]);
}
