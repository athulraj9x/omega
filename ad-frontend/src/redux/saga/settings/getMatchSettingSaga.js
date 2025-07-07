//this is for fetching Runners from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_MATCH_SETTING } from "../../action/types";
import { getMatchSettingFailure, getMatchSettingSuccess } from "../../action";
import API from "../../../utils/api";

function* getMatchSettingsRequest(action) {
  try {
    const { data } = yield API.post(
     "admin/match-setting",action?.payload?.eventPayload
    );
    if (data.meta.code === 200) {
      yield put(getMatchSettingSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code !== 200) {
      yield put(getMatchSettingFailure());
    }
  } catch (error) {
    yield put(getMatchSettingFailure());
  }
}

export function* watchGetMatchSettingsAPI() {
  yield takeEvery(GET_MATCH_SETTING, getMatchSettingsRequest);
}

export default function* rootSaga() {
  yield all([watchGetMatchSettingsAPI()]);
}
