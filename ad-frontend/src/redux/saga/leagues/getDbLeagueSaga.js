import { all, put, takeEvery } from "redux-saga/effects";
import { GET_DBLEAGUES } from "../../action/types";
import { getDbLeagueSuccess, getDbLeagueFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getDbLeagueRequest(action) {
  try {
    const { data } = yield API.get(
      `/admin/get-sports-db?sportId=${action.payload?.sportId}`
    );
    if (data.meta.code === 200) {
      yield put(getDbLeagueSuccess(data?.data?.leagues));
    } else if (data.meta.code !== 200) {
      yield put(getDbLeagueFailure());
    } else if (data.meta.code === 401) {
      yield put(getDbLeagueFailure());
      invalidTokenAction();
    }
  } catch (error) {
    yield put(getDbLeagueFailure());
  }
}

export function* watchDbLeaguesAPI() {
  yield takeEvery(GET_DBLEAGUES, getDbLeagueRequest);
}

export default function* rootSaga() {
  yield all([watchDbLeaguesAPI()]);
}
