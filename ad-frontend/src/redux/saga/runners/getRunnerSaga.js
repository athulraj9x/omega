//this is for fetching Runners from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_RUNNERS } from "../../action/types";
import { getRunnerFailure, getRunnerSuccess } from "../../action";
import API from "../../../utils/api";

function* getRunnersRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-market-odds?market_ids=${action?.payload?.marketId}`
    );
    if (data.meta.code === 200) {
      yield put(getRunnerSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getRunnerFailure());
    }
  } catch (error) {
    yield put(getRunnerFailure());
  }
}

export function* watchRunnersAPI() {
  yield takeEvery(GET_RUNNERS, getRunnersRequest);
}

export default function* rootSaga() {
  yield all([watchRunnersAPI()]);
}
