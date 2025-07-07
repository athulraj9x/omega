import {
  VERIFY_TWO_FACTOR_CODE,
  VERIFY_TWO_FACTOR_CODE_FAILURE,
  VERIFY_TWO_FACTOR_CODE_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const VerifyTwoFactorCodeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case VERIFY_TWO_FACTOR_CODE:
      return { ...state, loading: true };
    case VERIFY_TWO_FACTOR_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case VERIFY_TWO_FACTOR_CODE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default VerifyTwoFactorCodeReducer;
