import { all, call, put, takeEvery } from "redux-saga/effects";
import { SEARCH_BASED_ON_EVENTS } from "../../action/types";
import {
  searchBasedOnEventsSuccess,
  searchBasedOnEventsFailure,
} from "../../action";
import API from "../../../utils/api";

function* searchBasedOnEventsAPI(action) {
  try {
    let responseData;
      // FOR GETTING THE SPORTS DATA FOR EVENT MANAGEMENT
      const { data } = yield API.get(
        `/admin/search?keyword=${action.payload?.data?.query}&sportsId=${action.payload?.data?.sportId}`
      );
      responseData = data;
    if (responseData.meta.code === 200) {
      yield put(searchBasedOnEventsSuccess(responseData));
      yield call(action.payload.callback, responseData);
      
    } else if (responseData.meta.code === 401) {
      yield put(searchBasedOnEventsFailure());
    } else if (responseData.meta.code !== 200) {
      yield put(searchBasedOnEventsFailure());
      yield call(action.payload.callback, responseData.meta);
    }
  } catch (error) {
    yield put(searchBasedOnEventsFailure());
  }
}

export function* watchSearchBasedOnEventsRequest() {
  yield takeEvery(SEARCH_BASED_ON_EVENTS, searchBasedOnEventsAPI);
}

export default function* rootSaga() {
  yield all([watchSearchBasedOnEventsRequest()]);
}
