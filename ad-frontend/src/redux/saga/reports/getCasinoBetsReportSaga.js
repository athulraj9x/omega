import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_CASINO_BETS_REPORT } from "../../action/types";
import {
  getCasinoBetsReportSuccess,
  getCasinoBetsReportFailure,
} from "../../action";
import API from "../../../utils/api";

function* getCasinoBetsReportRequest(action) {
  try {
    const { description, role, userId, createdAt, roundId, casino_type } =
      action?.payload?.data;

    const { data } = yield API.get(
      `admin/casino-report-transaction-user?description=${description}&createdAt=${createdAt}&roundId=${roundId}&userId=${userId}&role=${role}&casino_type=${casino_type}`
    );

    if (data?.data?.meta?.code === 200) {
      yield put(getCasinoBetsReportSuccess(data?.data));
      yield call(action.payload.callback, data?.data);
    } else if (data?.data?.meta?.code === 401) {
      yield put(getCasinoBetsReportFailure());
    } else if (data?.data?.meta?.code !== 200) {
      yield put(getCasinoBetsReportFailure());
      yield call(action.payload.callback, data?.data);
    }
  } catch (error) {
    yield put(getCasinoBetsReportFailure());
  }
}

export function* watchGetCasinoBetsReportAPI() {
  yield takeEvery(GET_CASINO_BETS_REPORT, getCasinoBetsReportRequest);
}

export default function* rootSaga() {
  yield all([watchGetCasinoBetsReportAPI()]);
}
