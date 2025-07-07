import {
    GET_LEAGUE_DATA_WITH_PRIORITY,
    GET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS,
    GET_LEAGUE_DATA_WITH_PRIORITY_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const getLeagueDataWithPriorityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_LEAGUE_DATA_WITH_PRIORITY:
        return { ...state, loading: true };
      case GET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS:
        return { ...state, loading: false };
      case GET_LEAGUE_DATA_WITH_PRIORITY_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getLeagueDataWithPriorityReducer;
  