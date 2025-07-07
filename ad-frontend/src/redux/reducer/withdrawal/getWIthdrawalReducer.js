import {
    GET_WITHDRAWAL,
    GET_WITHDRAWAL_SUCCESS,
    GET_WITHDRAWAL_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false
  };
  
  const getWithdrawalReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_WITHDRAWAL:
        return { ...state, loading: true };
      case GET_WITHDRAWAL_SUCCESS:
        return { ...state, loading: false };
      case GET_WITHDRAWAL_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getWithdrawalReducer;
  