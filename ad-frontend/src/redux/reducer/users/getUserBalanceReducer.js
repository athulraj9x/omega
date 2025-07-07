import {
    GET_USER_BALANCE,
    GET_USER_BALANCE_SUCCESS,
    GET_USER_BALANCE_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    getUserBalanceData: null,
  };
  
  const getUserBalanceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_USER_BALANCE:
        return { ...state, loading: true };
      case GET_USER_BALANCE_SUCCESS:
        return { ...state, getUserBalanceData: action.payload, loading: false };
      case GET_USER_BALANCE_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getUserBalanceReducer;
  