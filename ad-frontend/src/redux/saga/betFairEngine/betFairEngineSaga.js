import { all, call, put, takeEvery } from "redux-saga/effects";
import { BETFAIR_ENGINE } from "../../action/types";
import {getBetfairEngineSuccess , getBetFairEngineFailure  } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* betFairEngineRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/betfairengine?missmatched=${action.payload?.missMatched}&perPage=${action.payload?.perPage}&page=${action.payload?.page}`
    );
    if (data.meta.code === 200) {
      yield put(getBetfairEngineSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getBetFairEngineFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBetFairEngineFailure());
    }
  } catch (error) {
    yield put(getBetFairEngineFailure());
  }
}

export function* watchBetFairEngineAPI() {
  yield takeEvery(BETFAIR_ENGINE, betFairEngineRequest);
}

export default function* rootSaga() {
  yield all([watchBetFairEngineAPI()]);
}
