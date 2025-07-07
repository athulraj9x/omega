import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { EVENT_DEACTIVATED } from "../../action/types";
import {
  eventDeActivateFailure,
  eventDeActivateSuccess,
} from "../../action";
import API from "../../../utils/api";

function* eventDeActivatedRequest(action) {
  try {
    const { data } = yield API.post("admin/event-deactivated", action.payload);
    if (data.meta.code === 200) {
      yield put(eventDeActivateSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 400) {
      yield put(eventDeActivateFailure());
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(eventDeActivateFailure());
  }
}

export function* watchEventDeActivatedAPI() {
  yield takeEvery(EVENT_DEACTIVATED, eventDeActivatedRequest);
}

export default function* rootSaga() {
  yield all([watchEventDeActivatedAPI()]);
}
