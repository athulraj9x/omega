import {
 CHECK_WHITELABEL_PRESENCE,
 CHECK_WHITELABEL_PRESENCE_SUCCESS,
 CHECK_WHITELABEL_PRESENCE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,

};

const CheckWhiteLabelPresence = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHECK_WHITELABEL_PRESENCE:
      return { ...state, loading: true };
    case CHECK_WHITELABEL_PRESENCE_SUCCESS:
      return { ...state, loading: false };
    case CHECK_WHITELABEL_PRESENCE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default CheckWhiteLabelPresence;
