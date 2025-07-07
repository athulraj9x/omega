import { GOOGLE_AUTHENTICATOR_OTP_VALIDATION, GOOGLE_AUTHENTICATOR_OTP_VALIDATION_FAILURE, GOOGLE_AUTHENTICATOR_OTP_VALIDATION_SUCCESS } from "../../action/types";


const INIT_STATE = {
  loading: false,
};

const googleLoginOTPValidationReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GOOGLE_AUTHENTICATOR_OTP_VALIDATION:
      return { ...state, loading: true };
    case GOOGLE_AUTHENTICATOR_OTP_VALIDATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GOOGLE_AUTHENTICATOR_OTP_VALIDATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default googleLoginOTPValidationReducer;
