//this is for fetching Events from external Api

import {
  GET_BETFAIR_VENUES,
  GET_BETFAIR_VENUES_SUCCESS,
  GET_BETFAIR_VENUES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  venuesData: null,
};

const getVenuesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BETFAIR_VENUES:
      return { ...state, loading: true };
    case GET_BETFAIR_VENUES_SUCCESS:
      return { ...state, venuesData: action.payload, loading: false };
    case GET_BETFAIR_VENUES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getVenuesReducer;
