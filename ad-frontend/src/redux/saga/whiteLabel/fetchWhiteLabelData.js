import { all, call, put, takeEvery } from "redux-saga/effects";
import { FETCH_WHITELABEL_DATA } from "../../action/types";
import {
  fetchWhiteLabelDataSuccess,
  fetchWhiteLabelDataFailure,
} from "../../action";
import API from "../../../utils/api";

function* fetchWhiteLabelDataRequest(action) {
  try {
    const { domain } = action.payload;
    const { data } = yield API.get(`admin/white-label-data?id=${domain}&whiteLabelId=${action?.payload?.whiteLabelId}`);
    if (data.meta.code === 200) {
      yield put(fetchWhiteLabelDataSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(fetchWhiteLabelDataFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    console.log(error, "error");
    yield put(fetchWhiteLabelDataFailure());
  }
}

export function* watchfetchWhiteLabelDataAPI() {
  yield takeEvery(FETCH_WHITELABEL_DATA, fetchWhiteLabelDataRequest);
}

export default function* rootSaga() {
  yield all([watchfetchWhiteLabelDataAPI()]);
}
