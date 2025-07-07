import {
    BETFAIR_ENGINE,
    BETFAIR_ENGINE_SUCCESS,
    BETFAIR_ENGINE_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    betFairEngineData: null,
  };
  
  const betFairEngineData = (state = INIT_STATE, action) => {
    switch (action.type) {
      case BETFAIR_ENGINE:
        return { ...state, loading: true };
      case BETFAIR_ENGINE_SUCCESS:
        return { ...state, betFairEngineData: action.payload, loading: false };
      case BETFAIR_ENGINE_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default betFairEngineData;
  