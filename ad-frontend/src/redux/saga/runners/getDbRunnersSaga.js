import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_DBRUNNERS } from "../../action/types";
import { getDbRunnerFailure, getDbRunnerSuccess } from "../../action";
import API from "../../../utils/api";

function* getDbRunnersRequest(action) {
  try {
    const { data } = yield API.get(
      `admin/get-runners-data?marketId=${action?.payload?.marketId}&sportId=${action?.payload?.sportId}`
    );
    if (data.meta.code === 200) {
      yield put(getDbRunnerSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getDbRunnerFailure());
    }
  } catch (error) {
    yield put(getDbRunnerFailure());
  }
}

export function* watchDbRunnersAPI() {
  yield takeEvery(GET_DBRUNNERS, getDbRunnersRequest);
}

export default function* rootSaga() {
  yield all([watchDbRunnersAPI()]);
}
