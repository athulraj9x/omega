import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ROLLBACK } from "../../action/types";
import {
  rollBackFailure,
  rollBackSuccess,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* rollBackRequest(action) {
  try {
    const { data } = yield API.post("admin/rollback", action?.payload?.data);
    if (data.meta.code === 200) {
      yield put(rollBackSuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(rollBackFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(rollBackFailure());
  }
}

export function* watchRollBackAPI() {
  yield takeEvery(ROLLBACK, rollBackRequest);
}

export default function* rootSaga() {
  yield all([watchRollBackAPI()]);
}
