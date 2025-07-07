import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { SETTLEMENT } from "../../action/types";
import { settlementFailure, settlementSuccess } from "../../action";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* settlementRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/user-settlement",
      action.payload.data
    );

    if (data?.meta?.code === 200) {
      yield put(settlementSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 400) {
      yield put(settlementFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(settlementFailure());
    yield call(action.payload.callback, error);
    if (error?.response?.data?.code === 400) {
      notifyWarning(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchSettlementAPI() {
  yield takeEvery(SETTLEMENT, settlementRequest);
}

export default function* rootSaga() {
  yield all([watchSettlementAPI()]);
}
