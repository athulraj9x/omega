import {
GET_REPORT_ANALYSIS_LEAGUES,
GET_REPORT_ANALYSIS_LEAGUES_SUCCESS,
GET_REPORT_ANALYSIS_LEAGUES_FAILURE
} from "../types";

export const getLeaguesForReportAnalysis = (payload) => ({
  type: GET_REPORT_ANALYSIS_LEAGUES,
  payload,
});

export const getLeaguesForReportAnalysisSuccess = (payload) => ({
  type: GET_REPORT_ANALYSIS_LEAGUES_SUCCESS,
  payload,
});

export const getLeaguesForReportAnalysisFailure = () => ({
  type: GET_REPORT_ANALYSIS_LEAGUES_FAILURE,
});
