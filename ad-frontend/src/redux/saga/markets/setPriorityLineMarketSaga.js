//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { SET_PRIORITY_LINE_MARKET } from "../../action/types";
import { setPriorityLineMarketSuccess, setPriorityLineMarketFailure } from "../../action";
import API from "../../../utils/api";
import { notifySuccess } from "../../../utils/helper";

function* setPriorityLineMarketAPI(action) {
  try {
    const { data } = yield API.get(
      `admin/set-markets-priority?marketId=${action?.payload?.data?.marketId}&eventId=${action?.payload?.data?.eventId}`
    );    
    if (data.meta.code === 200) {
      yield put(setPriorityLineMarketSuccess(data?.data?._id));
      yield call(action.payload.callback, data?.data);
      notifySuccess(data?.meta?.message)
    } else if (data.meta.code === 401) {
      yield put(setPriorityLineMarketFailure());
    } else if (data.meta.code !== 200) {
      yield put(setPriorityLineMarketFailure());
    }
  } catch (error) {
    yield put(setPriorityLineMarketFailure());
  }
}

export function* watchPriorityLineMarket() {
  yield takeEvery(SET_PRIORITY_LINE_MARKET, setPriorityLineMarketAPI);
}

export default function* rootSaga() {
  yield all([watchPriorityLineMarket()]);
}
