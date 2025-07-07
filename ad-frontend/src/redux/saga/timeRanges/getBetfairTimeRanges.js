//this is for fetching Events from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETFAIR_TIMERANGES } from "../../action/types";
import {
  getBetfairTimeRangesSuccess,
  getBetfairTimeRangesFailure,
} from "../../action";
import API from "../../../utils/oddApi";
import { invalidTokenAction } from "../../../utils/helper";

function* getBetfairTimeRangeRequest(action) {;
  try {
    const { venue, eventId } = action?.payload?.data;
    const { data } = yield API.get(
      `api/v2/get-list-time-ranges?venue=${venue}&eventId=${eventId}`
    );
    if (data.meta.code === 200) {
      yield put(getBetfairTimeRangesSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getBetfairTimeRangesFailure());
    } else if (data.meta.code === 401) {
      yield put(getBetfairTimeRangesFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(getBetfairTimeRangesFailure());
  }
}

export function* watchBetfairTimeRangeAPI() {
  yield takeEvery(GET_BETFAIR_TIMERANGES, getBetfairTimeRangeRequest);
}

export default function* rootSaga() {
  yield all([watchBetfairTimeRangeAPI()]);
}
