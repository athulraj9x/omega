import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_USER_EXPOSURE } from "../../action/types";
import { getUserExposureSuccess, getUserExposureFailure } from "../../action";
import API from "../../../utils/api";

function* getUserExposureRequest(action) {
  try {
    const { data } = yield API.get("/admin/user-list");
    if (data.meta.code === 200) {
      yield put(getUserExposureSuccess(data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code !== 200) {
      yield put(getUserExposureFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(getUserExposureFailure());
  }
}

export function* watchUserExposureAPI() {
  yield takeEvery(GET_USER_EXPOSURE, getUserExposureRequest);
}

export default function* rootSaga() {
  yield all([watchUserExposureAPI()]);
}
