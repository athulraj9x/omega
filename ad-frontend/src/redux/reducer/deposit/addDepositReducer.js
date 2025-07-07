import {
    ADD_DEPOSIT,
    ADD_DEPOSIT_SUCCESS,
    ADD_DEPOSIT_FAILURE
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false
  };
  
  const addDepositReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case ADD_DEPOSIT:
        return { ...state, loading: true };
      case ADD_DEPOSIT_SUCCESS:
        return { ...state, loading: false };
      case ADD_DEPOSIT_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default addDepositReducer;
  