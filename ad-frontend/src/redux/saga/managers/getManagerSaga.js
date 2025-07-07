import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_MANAGERS } from "../../action/types";
import { getManagerSuccess, getManagerFailure } from "../../action";
import API from "../../../utils/api";

function* getManagersRequest(action) {
  try {
    const { role } = action.payload;

    const { data } = yield API.get(`admin/managers?type=${role}`);

    if (data.meta.code === 200) {
      yield put(getManagerSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getManagerFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield call(action.payload.callback, error);
    yield put(getManagerFailure());
  }
}

export function* watchManagersAPI() {
  yield takeEvery(GET_MANAGERS, getManagersRequest);
}

export default function* rootSaga() {
  yield all([watchManagersAPI()]);
}
