import {
  GET_FANCY_STAKE_LIMIT,
  GET_FANCY_STAKE_LIMIT_SUCCESS,
  GET_FANCY_STAKE_LIMIT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    fancyStakeLimit: null,
  };

const getFancyStakeLimitReducer = (state = INIT_STATE, action)=>{
    switch(action.type){
        case GET_FANCY_STAKE_LIMIT:
            return {...state, loading : true};
        case GET_FANCY_STAKE_LIMIT_SUCCESS:
            return {...state , fancyStakeLimit : action.payload , loading : false};
        case GET_FANCY_STAKE_LIMIT_FAILURE:
            return {...state , loading : false}
        default:
            return state;
    }
};

export default getFancyStakeLimitReducer;