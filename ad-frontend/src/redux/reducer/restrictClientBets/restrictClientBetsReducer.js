import {
    RESTRICT_LAYERS_BETS,
    RESTRICT_LAYERS_BETS_SUCCESS,
    RESTRICT_LAYERS_BETS_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const restrictClientBetsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case RESTRICT_LAYERS_BETS:
        return { ...state, loading: true };
      case RESTRICT_LAYERS_BETS_SUCCESS:
        return { ...state, loading: false };
      case RESTRICT_LAYERS_BETS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default restrictClientBetsReducer;
  