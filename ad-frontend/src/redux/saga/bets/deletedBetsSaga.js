import { all, call, put, takeEvery } from "redux-saga/effects";
import { ERRORBETS } from "../../action/types";
import { getErrorBetsSuccess, getAllErrorBetsFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getDeletedBetsRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/error-bets?type=${action.payload.type}&sport=${action.payload?.sport}&league=${action.payload?.leagueSelect}&perPage=${action.payload?.perPage}&page=${action.payload?.page}`
    );

    if (data.meta.code === 200) {
      yield put(getErrorBetsSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getAllErrorBetsFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getAllErrorBetsFailure());
    }
  } catch (error) {
    yield put(getAllErrorBetsFailure());
  }
}

export function* watchErrorBetsAPI() {
  yield takeEvery(ERRORBETS, getDeletedBetsRequest);
}

export default function* rootSaga() {
  yield all([watchErrorBetsAPI()]);
}
