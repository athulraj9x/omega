//this is for fetching Sports from external Api

import { all, put, takeEvery } from "redux-saga/effects";
import { GET_SPORTS } from "../../action/types";
import { getSportsSuccess, getSportsFailure } from "../../action";
import API from "../../../utils/oddApi";

function* getSportsRequest() {
  try {
    const { data } = yield API.get("api/v2/get-sports");
    if (data.meta.code === 200) {
      yield put(getSportsSuccess(data));
    } else if (data.meta.code !== 200) {
      yield put(getSportsFailure());
    }
  } catch (error) {
    yield put(getSportsFailure());
  }
}

export function* watchSportsAPI() {
  yield takeEvery(GET_SPORTS, getSportsRequest);
}

export default function* rootSaga() {
  yield all([watchSportsAPI()]);
}
