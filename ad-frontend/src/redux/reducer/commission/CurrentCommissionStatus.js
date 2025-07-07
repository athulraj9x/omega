import {
    COMMISSION_CURRENT_VALUE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    currentCommissionStatus: null,
  };
  
  const currentCommissionStatusReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case COMMISSION_CURRENT_VALUE:
        return { ...state,currentCommissionStatus: action?.payload, loading: false };
        default :
        return {
          ...state
        };
    }
  };
  
  export default currentCommissionStatusReducer;
  