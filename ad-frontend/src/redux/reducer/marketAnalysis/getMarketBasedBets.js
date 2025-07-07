import {
    GET_EVENT_BASED_BETS,
    GET_EVENT_BASED_BETS_FAILURE,
    GET_EVENT_BASED_BETS_SUCCESS,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    eventBets: null,
  };
  
  const getEventBasedBetsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_EVENT_BASED_BETS:
        return { ...state, loading: true };
      case GET_EVENT_BASED_BETS_SUCCESS:
        return { ...state, data: action.payload, loading: false };
      case GET_EVENT_BASED_BETS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getEventBasedBetsReducer;
  