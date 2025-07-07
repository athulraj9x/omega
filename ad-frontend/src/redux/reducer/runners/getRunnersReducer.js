//this is for fetching Runners from external Api

import {
  GET_RUNNERS,
  GET_RUNNERS_SUCCESS,
  GET_RUNNERS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  runnerData: null,
};

const getRunnersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_RUNNERS:
      return { ...state, loading: true };
    case GET_RUNNERS_SUCCESS:
      return { ...state, runnerData: action.payload, loading: false };
    case GET_RUNNERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getRunnersReducer;
