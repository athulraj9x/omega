import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_REPORT_ANALYSIS_EVENTS} from "../../action/types";
import {
 getEventsForReportAnalysisSuccess,
 getEventsForReportAnalysisFailure
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* GetEventsForReportAnalysisSaga(action) {
  try {
    let responseData;
      //  FOR FETCHING THE DATA TO SUBMIT RESULT
      const { data } = yield API.get(
        `/admin/get-events-for-report-analysis?leagueId=${action.payload?.id}`
      );
       responseData = data;
    if (responseData.meta.code === 200) {
      yield put(getEventsForReportAnalysisSuccess(responseData));
      yield call(action.payload.callback, responseData);
      
    } else if (responseData.meta.code === 401) {
      yield put(getEventsForReportAnalysisFailure());
      invalidTokenAction();
    } else if (responseData.meta.code !== 200) {
      yield put(getEventsForReportAnalysisFailure());
      yield call(action.payload.callback, responseData.meta);
    }
  } catch (error) {
    yield put(getEventsForReportAnalysisFailure());
  }
}

export function* watchEventsForReportAnalysisAPI() {
  yield takeEvery(GET_REPORT_ANALYSIS_EVENTS, GetEventsForReportAnalysisSaga);
}

export default function* rootSaga() {
  yield all([watchEventsForReportAnalysisAPI()]);
}
