//this is for fetching Events from external Api

import {
  GET_BETFAIR_COUNTRIES,
  GET_BETFAIR_COUNTRIES_SUCCESS,
  GET_BETFAIR_COUNTRIES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  countires: null,
};

const getBetfairCountriesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BETFAIR_COUNTRIES:
      return { ...state, loading: true };
    case GET_BETFAIR_COUNTRIES_SUCCESS:
      return { ...state, countires: action.payload, loading: false };
    case GET_BETFAIR_COUNTRIES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getBetfairCountriesReducer;
