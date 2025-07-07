import {
  GET_WHITELABEL,
  GET_WHITELABEL_SUCCESS,
  GET_WHITELABEL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  whiteLabels: null,
};

const getWhiteLabelReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WHITELABEL:
      return { ...state, loading: true };
    case GET_WHITELABEL_SUCCESS:
      return { ...state, whiteLabels: action.payload, loading: false };
    case GET_WHITELABEL_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getWhiteLabelReducer;
