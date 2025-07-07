import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_INACTIVE_LAYERS } from "../../action/types";
import { getInactiveLayersSuccess, getInactiveLayersFailure } from "../../action";
import API from "../../../utils/api";

function* getInactiveLayersRequest(action) {
  try {
    const { page, perPage, userId, role, search, isUserId } = action.payload;
    let response;
    if (isUserId) {
      const { data } = yield API.get(
        `admin/layer?userId=${userId}&role=${role}&page=${page}&per_page=${perPage}`
      );
      response = data;
    } else {
      if (userId) {
        const { data } = yield API.get(
          `admin/inactive-layer?userId=${userId}&role=${role}&page=${page}&per_page=${perPage}`
        );
        response = data;
      }
      else if (search) {
        const { data } = yield API.get(
          `admin/inactive-layer?search=${search}`
        );
        response = data;
      } else {
        const { data } = yield API.get(
          `admin/inactive-layer?page=${page}&per_page=${perPage}`
        );
        response = data;
      }
    }
    if (response.meta.code === 200) {
      yield put(getInactiveLayersSuccess(response));
      yield call(action.payload.callback, response);
    } else if (response.meta.code !== 200) {
      yield put(getInactiveLayersFailure());
      yield call(action.payload.callback, response.meta);
    }
  } catch (error) {
    yield put(getInactiveLayersFailure());
  }
}

export function* watchInactiveLayersAPI() {
  yield takeEvery(GET_INACTIVE_LAYERS, getInactiveLayersRequest);
}

export default function* rootSaga() {
  yield all([watchInactiveLayersAPI()]);
}
