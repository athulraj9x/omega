import {
    GET_SPORTS_DATA_WITH_PRIORITY,
    GET_SPORTS_DATA_WITH_PRIORITY_SUCCESS,
    GET_SPORTS_DATA_WITH_PRIORITY_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const getSportsDataWithPriorityReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_SPORTS_DATA_WITH_PRIORITY:
        return { ...state, loading: true };
      case GET_SPORTS_DATA_WITH_PRIORITY_SUCCESS:
        return { ...state, loading: false };
      case GET_SPORTS_DATA_WITH_PRIORITY_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getSportsDataWithPriorityReducer;
  