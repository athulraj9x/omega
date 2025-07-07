//this is for fetching Runners from external Api

import {
  GET_SPORTS,
  GET_SPORTS_SUCCESS,
  GET_SPORTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  sportData: null,
};

const getSportsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SPORTS:
      return { ...state, loading: true };
    case GET_SPORTS_SUCCESS:
      return { ...state, sportData: action.payload, loading: false };
    case GET_SPORTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getSportsReducer;
