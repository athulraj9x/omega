import {
  WHITELABEL_B2C_HELPLINE_ADD,
  WHITELABEL_B2C_HELPLINE_ADD_SUCCESS,
  WHITELABEL_B2C_HELPLINE_ADD_FAILURE,
} from "../../action/types";

const INIT_STATE_ADD = {
  loading: false, // For managing loading state during the ADD request
};

const AddHelplineReducer = (state = INIT_STATE_ADD, action) => {
  switch (action.type) {
    case WHITELABEL_B2C_HELPLINE_ADD:
      return { ...state, loading: true }; // Set loading true when ADD request starts
    case WHITELABEL_B2C_HELPLINE_ADD_SUCCESS:
      return { ...state, loading: false }; // Set loading false on successful ADD
    case WHITELABEL_B2C_HELPLINE_ADD_FAILURE:
      return { ...state, loading: false }; // Set loading false on failure
    default:
      return state;
  }
};

export default AddHelplineReducer;
