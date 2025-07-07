
import {
    ADD_CREDIT_REFERENCE,
    ADD_CREDIT_REFERENCE_SUCCESS,
    ADD_CREDIT_REFERENCE_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
  };
  
  const addCreditReference = (state = INIT_STATE, action) => {
    switch (action.type) {
      case ADD_CREDIT_REFERENCE:
        return { ...state, loading: true };
      case ADD_CREDIT_REFERENCE_SUCCESS:
        return { ...state, loading: false };
      case ADD_CREDIT_REFERENCE_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default addCreditReference;
  