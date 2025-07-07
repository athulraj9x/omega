import { GOOGLE_LOGIN_VALIDATION, GOOGLE_LOGIN_VALIDATION_FAILURE, GOOGLE_LOGIN_VALIDATION_SUCCESS } from "../../action/types";



const INIT_STATE = {
  loading: false,
};

const googleLoginValidationReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GOOGLE_LOGIN_VALIDATION:
      return { ...state, loading: true };
    case GOOGLE_LOGIN_VALIDATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GOOGLE_LOGIN_VALIDATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default googleLoginValidationReducer;
