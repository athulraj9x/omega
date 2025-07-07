import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_LINE_MARKETS } from "../../action/types";
import { getLineMarketsSuccess, getLineMarketsFailure } from "../../action";
import API from "../../../utils/oddApi";

function* getLineMarketRequest(action) {
  try {
    const { data } = yield API.get(
      `/api/v2/get-updated-markets?eventId=${action.payload?.id}`
    );

    if (data.meta.code === 200) {
      yield put(getLineMarketsSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data.meta.code === 401) {
      yield put(getLineMarketsFailure());
    } else if (data.meta.code !== 200) {
      yield put(getLineMarketsFailure());
    }
  } catch (error) {
    yield put(getLineMarketsFailure());
  }
}

export function* watchLineMarketAPI() {
  yield takeEvery(GET_LINE_MARKETS, getLineMarketRequest);
}

export default function* rootSaga() {
  yield all([watchLineMarketAPI()]);
}
