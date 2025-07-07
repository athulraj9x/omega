import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_WHITELABEL } from "../../action/types";
import { getWhiteLabelSuccess, getWhiteLabelFailure } from "../../action";
import API from "../../../utils/api";

function* getWhiteLabelRequest(action) {
  try {
    const { page, perPage, buildTreeFrom, search, selectedCurrency, userType, selectedSorting } = action.payload;
    const { data } = yield API.get(
      `admin/white-labels?buildTreeFrom=${buildTreeFrom}&selectedSorting=${selectedSorting}&page=${page}&perPage=${perPage}&selectedCurrency=${selectedCurrency}&userType=${userType}&search=${search}`
    );

    if (data.meta.code === 200) {
      yield put(getWhiteLabelSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code !== 200) {
      yield put(getWhiteLabelFailure());
      yield call(action.payload.callback, data.meta);
    }
  } catch (error) {
    yield put(getWhiteLabelFailure());
  }
}

export function* watchgetWhiteLabelAPI() {
  yield takeEvery(GET_WHITELABEL, getWhiteLabelRequest);
}

export default function* rootSaga() {
  yield all([watchgetWhiteLabelAPI()]);
}
