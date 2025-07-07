//this is for fetching Events from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETFAIR_VENUES } from "../../action/types";
import { getVenuesSuccess, getVenuesFailure } from "../../action";
import API from "../../../utils/oddApi";
import { invalidTokenAction } from "../../../utils/helper";

function* getVenuesRequest(action) {
  try {
    const { data } = yield API.get(
      `api/v2/get-list-venues?country=${action?.payload?.id}`
      // `admin/get-events-and-dates?league_id=${action?.payload?.id}`
    );
    if (data.meta.code === 200) {
      yield put(getVenuesSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getVenuesFailure());
    } else if (data.meta.code === 401) {
      yield put(getVenuesFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(getVenuesFailure());
  }
}

export function* watchVenuesAPI() {
  yield takeEvery(GET_BETFAIR_VENUES, getVenuesRequest);
}

export default function* rootSaga() {
  yield all([watchVenuesAPI()]);
}
