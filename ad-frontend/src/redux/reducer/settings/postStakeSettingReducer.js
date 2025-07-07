import {
    UPDATE_FANCY_STAKE_LIMIT,
    UPDATE_FANCY_STAKE_LIMIT_SUCCESS,
    UPDATE_FANCY_STAKE_LIMIT_FAILURE,
  } from "../types";

  const INIT_STATE = {
    loading: false,
    fancyStakeLimit: null,
  };

  const updateFancyStakeLimitReducer =(state = INIT_STATE, action)=>{
    switch(action.type){
        case UPDATE_FANCY_STAKE_LIMIT :
            return {...state , loading : true};
        case UPDATE_FANCY_STAKE_LIMIT_SUCCESS :
            return {...state , fancyStakeLimit :action.payload ,loading : false}
        case UPDATE_FANCY_STAKE_LIMIT_FAILURE:
            return {...state , loading : false};
        default:
            return state;
    }
  }

  export default updateFancyStakeLimitReducer;