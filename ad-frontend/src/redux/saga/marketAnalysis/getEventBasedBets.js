//this is for fetching Markets from external Api

import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EVENT_BASED_BETS } from "../../action/types";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";
import { getEventBasedBetsFailure, getEventBasedBetsSuccess } from "../../action/marketAnalysis/getSportsByMarketId";

function* getEventBasedBetsRequest(action) {
  try { 
    const { data } = yield API.get(
      `admin/get-event-based-bets?eventId=${action?.payload?.data?.eventId}&lastDate=${action?.payload?.data?.lastDate}`
    );
    
    if (data?.meta?.code === 200) {
      yield put(getEventBasedBetsSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data.meta.code === 401) {
      yield put(getEventBasedBetsFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getEventBasedBetsFailure());
    }
  } catch (error) {
    yield put(getEventBasedBetsFailure());
  }
}

export function* watchEventBasedBetsAPI() {
  yield takeEvery(GET_EVENT_BASED_BETS, getEventBasedBetsRequest);
}

export default function* rootSaga() {
  yield all([watchEventBasedBetsAPI()]);
}
