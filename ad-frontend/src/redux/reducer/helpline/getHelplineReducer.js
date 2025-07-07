import {
  WHITELABEL_B2C_HELPLINE_GET,
  WHITELABEL_B2C_HELPLINE_GET_SUCCESS,
  WHITELABEL_B2C_HELPLINE_GET_FAILURE,
} from "../../action/types";

const INIT_STATE_GET = {
  loading: false,
  helpline: null, // Store helpline numbers
};

const GetHelplineReducer = (state = INIT_STATE_GET, action) => {
  switch (action.type) {
    case WHITELABEL_B2C_HELPLINE_GET:
      return { ...state, loading: true }; // Set loading true when GET request starts
    case WHITELABEL_B2C_HELPLINE_GET_SUCCESS:
      return { ...state, helplineNos: action.payload, loading: false }; // Store fetched helpline numbers
    case WHITELABEL_B2C_HELPLINE_GET_FAILURE:
      return { ...state, loading: false }; // Set loading false on failure
    default:
      return state;
  }
};

export default GetHelplineReducer;
