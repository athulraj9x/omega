//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EVENT_MARKET } from "../../action/types";
import { getEventMarketSuccess, getEventMarketFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getEventMarketRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-event-markets?eventId=${action?.payload?.eventId}`
    );
    if (data.meta.code === 200) {
      yield put(getEventMarketSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getEventMarketFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getEventMarketFailure());
    }
  } catch (error) {
    yield put(getEventMarketFailure());
  }
}

export function* watchEventMarketAPI() {
  yield takeEvery(GET_EVENT_MARKET, getEventMarketRequest);
}

export default function* rootSaga() {
  yield all([watchEventMarketAPI()]);
}
