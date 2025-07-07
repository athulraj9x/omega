import {
  WHITELABEL_B2C_HELPLINE_DELETE,
  WHITELABEL_B2C_HELPLINE_DELETE_SUCCESS,
  WHITELABEL_B2C_HELPLINE_DELETE_FAILURE,
} from "../../action/types";

const INIT_STATE_DELETE = {
  loading: false,
};

const DeleteHelplineReducer = (state = INIT_STATE_DELETE, action) => {
  switch (action.type) {
    case WHITELABEL_B2C_HELPLINE_DELETE:
      return { ...state, loading: true }; // Set loading true when DELETE request starts
    case WHITELABEL_B2C_HELPLINE_DELETE_SUCCESS:
      return { ...state, loading: false }; // Set loading false on success
    case WHITELABEL_B2C_HELPLINE_DELETE_FAILURE:
      return { ...state, loading: false }; // Set loading false on failure
    default:
      return state;
  }
};

export default DeleteHelplineReducer;
