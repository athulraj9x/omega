import { toast } from "react-toastify";
import { all, call, put, takeEvery } from "redux-saga/effects";
import API from "../../../utils/api";
import {
  addCurrencyFailure,
  addCurrencySuccess,
} from "../../action/currency/addCurrencyAction";
import { ADD_CURRENCY } from "../../action/types";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addCurrencyRequest(action) {
  try {
    const { data } = yield API.post("admin/add-currency", action.payload.data);
    if (data.meta.code === 200) {
      yield put(addCurrencySuccess(data.data));
      yield call(action.payload.callback, data.meta);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(addCurrencyFailure());
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
      yield call(action.payload.callback, data.meta);
    } else if (data.meta.code === 401) {
      yield put(addCurrencyFailure());
      invalidTokenAction();
    } else {
      yield put(addCurrencyFailure());
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(addCurrencyFailure());
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

export function* watchAddCurrencyAPI() {
  yield takeEvery(ADD_CURRENCY, addCurrencyRequest);
}

export default function* rootSaga() {
  yield all([watchAddCurrencyAPI()]);
}
