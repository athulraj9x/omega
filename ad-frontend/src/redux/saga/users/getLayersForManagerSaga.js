import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_LAYERS_FOR_MANAGER } from "../../action/types";
import { getLayersForManagerSuccess, getLayersForManagerFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getLayersRequest(action) {
  try {
    const { data } = yield API.get(`/admin/layers-for-manager`);
    if (data.meta.code === 200) {
      yield put(getLayersForManagerSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getLayersForManagerFailure());
      invalidTokenAction();
    }else if (data.meta.code !== 200) {
      yield put(getLayersForManagerFailure());
    }
  } catch (error) {
    yield put(getLayersForManagerFailure());
  }
}

export function* watchLayersAPI() {
  yield takeEvery(GET_LAYERS_FOR_MANAGER, getLayersRequest);
}

export default function* rootSaga() {
  yield all([watchLayersAPI()]);
}
