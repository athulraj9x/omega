import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { SET_COMMISSION_VALUE } from "../../action/types";
import {
  setCommissionValueSuccess,
  setCommissionValueFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* setCommissionValueAPI(action) {
  try {
    const { data } = yield API.put(
      'admin/commission-status-update',action?.payload.data
    );
    if (data.meta.code === 200) {
      yield put(setCommissionValueSuccess(data));
      yield call(action.payload.callback, data.data);
      notifySuccess(data?.meta?.message)

    } else if (data.meta.code === 401) {
      yield put(setCommissionValueFailure());
    } else if (data.meta.code !== 200) {
      yield put(setCommissionValueFailure());
      notifyDanger(data?.meta?.message)
    }
  } catch (error) {
    yield put(setCommissionValueFailure());
  }
}

export function* watchCommissionValueAPI() {
  yield takeEvery(SET_COMMISSION_VALUE, setCommissionValueAPI);
}

export default function* rootSaga() {
  yield all([watchCommissionValueAPI()]);
}
