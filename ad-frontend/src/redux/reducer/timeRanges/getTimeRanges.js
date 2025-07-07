//this is for fetching Events from external Api

import {
  GET_BETFAIR_TIMERANGES,
  GET_BETFAIR_TIMERANGES_SUCCESS,
  GET_BETFAIR_TIMERANGES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  timeData: null,
};

const getTimeRangeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BETFAIR_TIMERANGES:
      return { ...state, loading: true };
    case GET_BETFAIR_TIMERANGES_SUCCESS:
      return { ...state, timeData: action.payload, loading: false };
    case GET_BETFAIR_TIMERANGES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getTimeRangeReducer;
