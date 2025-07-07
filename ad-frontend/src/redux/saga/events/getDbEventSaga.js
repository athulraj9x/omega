import { all, put, takeEvery } from "redux-saga/effects";
import { GET_DBEVENT } from "../../action/types";
import { getDbEventSuccess, getDbEventFailure } from "../../action";
import API from "../../../utils/api";

function* getDbEventRequest() {
  try {
    const { data } = yield API.get(`admin/leagues`);
    if (data.meta.code === 200) {
      yield put(getDbEventSuccess(data));
    } else if (data.meta.code !== 200) {
      yield put(getDbEventFailure());
    }
  } catch (error) {
    yield put(getDbEventFailure());
  }
}

export function* watchDbEventAPI() {
  yield takeEvery(GET_DBEVENT, getDbEventRequest);
}

export default function* rootSaga() {
  yield all([watchDbEventAPI()]);
}
