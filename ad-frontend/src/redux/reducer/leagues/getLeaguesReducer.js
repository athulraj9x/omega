//this is for fetching Leagues from external Api

import {
  GET_LEAGUES,
  GET_LEAGUES_SUCCESS,
  GET_LEAGUES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  leagueData: null,
};

const getLeaguesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LEAGUES:
      return { ...state, loading: true };
    case GET_LEAGUES_SUCCESS:
      return { ...state, leagueData: action.payload, loading: false };
    case GET_LEAGUES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getLeaguesReducer;
