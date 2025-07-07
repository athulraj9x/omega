//this is for fetching Events from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EVENTS } from "../../action/types";
import { getEventSuccess, getEventFailure } from "../../action";
import API from "../../../utils/oddApi";
import { invalidTokenAction } from "../../../utils/helper";

function* getEventsRequest(action) {
  try {
    const { data } = yield API.get(
      `api/v2/get-events?league_id=${action?.payload?.id}`
      // `admin/get-events-and-dates?league_id=${action?.payload?.id}`
    );
    if (data.meta.code === 200) {
      yield put(getEventSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getEventFailure());
    } else if (data.meta.code === 401) {
      yield put(getEventFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(getEventFailure());
  }
}

export function* watchEventsAPI() {
  yield takeEvery(GET_EVENTS, getEventsRequest);
}

export default function* rootSaga() {
  yield all([watchEventsAPI()]);
}
