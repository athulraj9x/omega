import { all, put, takeEvery } from "redux-saga/effects";
import { GET_DBSPORTS } from "../../action/types";
import { getDbSportsSuccess, getDbSportsFailure } from "../../action";
import API from "../../../utils/api";

function* getDbSportsRequest(action) {
  try {
    const { data } = yield API.get("admin/get-sports-data");
    if (data.meta.code === 200) {
      yield put(getDbSportsSuccess(data?.data));
    } else if (data.meta.code !== 200) {
      yield put(getDbSportsFailure());
    }
  } catch (error) {
    yield put(getDbSportsFailure());
  }
}

export function* watchDbSportsAPI() {
  yield takeEvery(GET_DBSPORTS, getDbSportsRequest);
}

export default function* rootSaga() {
  yield all([watchDbSportsAPI()]);
}
