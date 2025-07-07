import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_REPORT_ANALYSIS_LEAGUES } from "../../action/types";
import {
 getLeaguesForReportAnalysisSuccess,
 getLeaguesForReportAnalysisFailure
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* GetLeaguesForReportAnalysisSaga(action) {
  try {
    let responseData;
      //  FOR FETCHING THE DATA TO SUBMIT RESULT
      const { data } = yield API.get(
        `/admin/get-leagues-for-report-analysis?sportId=${action.payload?.id}`
      );
       responseData = data;
    if (responseData.meta.code === 200) {
      yield put(getLeaguesForReportAnalysisSuccess(responseData));
      yield call(action.payload.callback, responseData);
      
    } else if (responseData.meta.code === 401) {
      yield put(getLeaguesForReportAnalysisFailure());
      invalidTokenAction();
    } else if (responseData.meta.code !== 200) {
      yield put(getLeaguesForReportAnalysisFailure());
      yield call(action.payload.callback, responseData.meta);
    }
  } catch (error) {
    yield put(getLeaguesForReportAnalysisFailure());
  }
}

export function* watchLeagueForReportAnalysisAPI() {
  yield takeEvery(GET_REPORT_ANALYSIS_LEAGUES, GetLeaguesForReportAnalysisSaga);
}

export default function* rootSaga() {
  yield all([watchLeagueForReportAnalysisAPI()]);
}
