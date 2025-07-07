//this is for fetching Events from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BETFAIR_COUNTRIES } from "../../action/types";
import {
  getBetfairCountrySuccess,
  getBetfairCountryFailure,
} from "../../action";
import API from "../../../utils/oddApi";
import { invalidTokenAction } from "../../../utils/helper";

function* getBetfairCountryRequest(action) {
  try {
    const { data } = yield API.get(
      `api/v2/get-list-countries?sport_id=${action?.payload?.id}`
      // `admin/get-events-and-dates?league_id=${action?.payload?.id}`
    );
    if (data.meta.code === 200) {
      yield put(getBetfairCountrySuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getBetfairCountryFailure());
    } else if (data.meta.code === 401) {
      yield put(getBetfairCountryFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(getBetfairCountryFailure());
  }
}

export function* watchBetfairCountryAPI() {
  yield takeEvery(GET_BETFAIR_COUNTRIES, getBetfairCountryRequest);
}

export default function* rootSaga() {
  yield all([watchBetfairCountryAPI()]);
}
