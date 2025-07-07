//this is for fetching Leagues from external Api

import { all, put, takeEvery } from "redux-saga/effects";
import { GET_LEAGUES } from "../../action/types";
import { getLeagueSuccess, getLeagueFailure } from "../../action";
import API from "../../../utils/oddApi";
import { invalidTokenAction } from "../../../utils/helper";

function* getLeagueRequest(action) {
  try {
    const { data } = yield API.get(
      `api/v2/get-leagues?sport_id=${action?.payload}`
    );
    if (data.meta.code === 200) {
      yield put(getLeagueSuccess(data));
    } else if (data.meta.code === 401) {
      yield put(getLeagueFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getLeagueFailure());
    }
  } catch (error) {
    yield put(getLeagueFailure());
  }
}

export function* watchLeaguesAPI() {
  yield takeEvery(GET_LEAGUES, getLeagueRequest);
}

export default function* rootSaga() {
  yield all([watchLeaguesAPI()]);
}
