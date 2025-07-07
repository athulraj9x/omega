//this is for fetching Runners from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_LEAGUE_SETTING } from "../../action/types";
import { getLeagueSettingSuccess, getLeagueSettingFailure } from "../../action";
import API from "../../../utils/api";

function* getLeagueSettingsRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/league-setting",
      action?.payload?.leaguePayload
    );
    if (data.meta.code === 200) {
      yield put(getLeagueSettingSuccess(data?.data));
    } else if (data.meta.code !== 200) {
      yield put(getLeagueSettingFailure());
    }
  } catch (error) {
    yield put(getLeagueSettingFailure());
  }
}

export function* watchGetLeagueSettingsAPI() {
  yield takeEvery(GET_LEAGUE_SETTING, getLeagueSettingsRequest);
}

export default function* rootSaga() {
  yield all([watchGetLeagueSettingsAPI()]);
}
