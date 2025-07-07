import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { SETTLEMENT_ROLLBACK } from "../../action/types";
import {
  settlementRollBackFailure,
  settlementRollBackSuccess,
} from "../../action";
import API from "../../../utils/api";
import { notifySuccess, notifyWarning } from "../../../utils/helper";

function* settlementRollBackRequest(action) {
  try {
    const { data } = yield API.post("admin/settlement-rollback", action?.payload?.data);
    if (data.meta.code === 200) {
      yield put(settlementRollBackSuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(settlementRollBackFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(settlementRollBackFailure());
  }
}

export function* watchSettlementRollBackAPI() {
  yield takeEvery(SETTLEMENT_ROLLBACK, settlementRollBackRequest);
}

export default function* rootSaga() {
  yield all([watchSettlementRollBackAPI()]);
}
