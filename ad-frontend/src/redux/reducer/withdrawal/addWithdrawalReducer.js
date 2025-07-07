import {
    ADD_WITHDRAWAL,
    ADD_WITHDRAWAL_SUCCESS,
    ADD_WITHDRAWAL_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false
  };
  
  const addWithdrawalReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case ADD_WITHDRAWAL:
        return { ...state, loading: true };
      case ADD_WITHDRAWAL_SUCCESS:
        return { ...state, loading: false };
      case ADD_WITHDRAWAL_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default addWithdrawalReducer;
  