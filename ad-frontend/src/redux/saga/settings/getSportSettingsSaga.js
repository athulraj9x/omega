//this is for fetching Runners from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_SPORT_SETTINGS } from "../../action/types";
import { getSportSettingsFailure, getSportSettingsSuccess } from "../../action";
import API from "../../../utils/api";

function* getSportSettingsRequest(action) {
  const { sportId, currencyId, whiteLabelId } = action?.payload?.data;
  let sport = sportId.value;
  let currency = currencyId.value;

  let url;
  if (whiteLabelId) {
    url = `admin/setting?sport_id=${sport}&currency_id=${currency}&id=${whiteLabelId}`;
  } else {
    url = `admin/setting?sport_id=${sport}&currency_id=${currency}`;
  }
  try {
    const { data } = yield API.get(url);
    if (data.meta.code === 200) {
      yield put(getSportSettingsSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code !== 200) {
      yield put(getSportSettingsFailure());
    }
  } catch (error) {
    yield put(getSportSettingsFailure());
  }
}

export function* watchSportSettingsAPI() {
  yield takeEvery(GET_SPORT_SETTINGS, getSportSettingsRequest);
}

export default function* rootSaga() {
  yield all([watchSportSettingsAPI()]);
}
