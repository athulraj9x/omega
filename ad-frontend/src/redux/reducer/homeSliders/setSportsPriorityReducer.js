import {
    SET_SPORTS_DATA_WITH_PRIORITY,
    SET_SPORTS_DATA_WITH_PRIORITY_SUCCESS,
    SET_SPORTS_DATA_WITH_PRIORITY_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const setSportsPriorityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case SET_SPORTS_DATA_WITH_PRIORITY:
        return { ...state, loading: true };
      case SET_SPORTS_DATA_WITH_PRIORITY_SUCCESS:
        return { ...state, loading: false };
      case SET_SPORTS_DATA_WITH_PRIORITY_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default setSportsPriorityReducer;
  