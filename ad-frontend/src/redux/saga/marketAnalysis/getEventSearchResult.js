import { all, call, put, takeEvery } from "redux-saga/effects";
import { SEARCH_EVENT_DATA } from "../../action/types";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";
import { searchEventDataFailure, searchEventDataSuccess } from "../../action";

function* getEventSearchResult(action) {
  try { 
    const { data } = yield API.get(
      `admin/get-event-data-search?keyword=${action?.payload?.keyword}`);
    
    if (data?.meta?.code === 200) {
      yield put(searchEventDataSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(searchEventDataFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(searchEventDataFailure());
    }
  } catch (error) {
    yield put(searchEventDataFailure());
  }
}

export function* watchEventBasedSearchAPI() {
  yield takeEvery(SEARCH_EVENT_DATA, getEventSearchResult);
}

export default function* rootSaga() {
  yield all([watchEventBasedSearchAPI()]);
}
