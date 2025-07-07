import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_CASINO_BETS_BY_DATE } from "../../action/types";
import {
  getCasinoBetsByDateSuccess,
  getCasinoBetsByDateFailure,
} from "../../action";
import API from "../../../utils/api";

function* getCasinoBetsRequest(action) {
  try {
    const { description, role, userId, createdAt, roundId, casino_type } = action?.payload?.data;
    let responseData;
    if (userId) {
      const { data } = yield API.get(
        `admin/casino-transaction-subchild?description=${description}&userId=${userId}&role=${role}&createdAt=${createdAt}&roundId=${roundId}&casino_type=${casino_type}`
      );
      responseData = data;
    } else {
      const { data } = yield API.get(
        `admin/casino-transaction-child?description=${description}&createdAt=${createdAt}&roundId=${roundId}&casino_type=${casino_type}`
      );
      responseData = data;
    }

    if (responseData.meta.code === 200) {
      yield put(getCasinoBetsByDateSuccess(responseData?.data));
      yield call(action.payload.callback, responseData?.data);
    } else if (responseData.meta.code === 401) {
      yield put(getCasinoBetsByDateFailure());
    } else if (responseData.meta.code !== 200) {
      yield put(getCasinoBetsByDateFailure());
      yield call(action.payload.callback, responseData);
    }
  } catch (error) {
    yield put(getCasinoBetsByDateFailure());
  }
}

export function* watchGetCasinoBetsAPI() {
  yield takeEvery(GET_CASINO_BETS_BY_DATE, getCasinoBetsRequest);
}

export default function* rootSaga() {
  yield all([watchGetCasinoBetsAPI()]);
}
