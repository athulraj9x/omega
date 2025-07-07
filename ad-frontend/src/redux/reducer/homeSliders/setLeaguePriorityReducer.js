import {
    SET_LEAGUE_DATA_WITH_PRIORITY,
    SET_LEAGUE_DATA_WITH_PRIORITY_FAILURE,
    SET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const setLeaguePriorityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case SET_LEAGUE_DATA_WITH_PRIORITY:
        return { ...state, loading: true };
      case SET_LEAGUE_DATA_WITH_PRIORITY_SUCCESS:
        return { ...state, loading: false };
      case SET_LEAGUE_DATA_WITH_PRIORITY_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default setLeaguePriorityReducer;
  