//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_PRIORITY_DATA_BASED_EVENT_MARKET } from "../../action/types";
import { getPriorityEventMarketActionSuccess, getPriorityEventMarketActionFailure } from "../../action";
import API from "../../../utils/api";

function* GetPriorityEventMarketAPI(action) {
  try {
    const { data } = yield API.get(
      `admin/get-eventmarket-priority?id=${action?.payload?.data}`
    );
    if (data.meta.code === 200) {
      yield put(getPriorityEventMarketActionSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getPriorityEventMarketActionFailure());
    } else if (data.meta.code !== 200) {
      yield put(getPriorityEventMarketActionFailure());
    }
  } catch (error) {
    yield put(getPriorityEventMarketActionFailure());
  }
}

export function* watchGetPriorityEventMarketAPI() {
  yield takeEvery(GET_PRIORITY_DATA_BASED_EVENT_MARKET, GetPriorityEventMarketAPI);
}

export default function* rootSaga() {
  yield all([watchGetPriorityEventMarketAPI()]);
}
