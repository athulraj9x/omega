import {
    GET_REPORT_ANALYSIS_EVENTS,
    GET_REPORT_ANALYSIS_EVENTS_SUCCESS,
    GET_REPORT_ANALYSIS_EVENTS_FAILURE
    } from "../types";
    
    export const getEventsForReportAnalysis = (payload) => ({
      type: GET_REPORT_ANALYSIS_EVENTS,
      payload,
    });
    
    export const getEventsForReportAnalysisSuccess = (payload) => ({
      type:  GET_REPORT_ANALYSIS_EVENTS_SUCCESS,
      payload,
    });
    
    export const getEventsForReportAnalysisFailure = () => ({
      type:  GET_REPORT_ANALYSIS_EVENTS_FAILURE,
    });
    