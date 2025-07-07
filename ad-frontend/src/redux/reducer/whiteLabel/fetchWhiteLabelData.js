import {
  FETCH_WHITELABEL_DATA,
  FETCH_WHITELABEL_DATA_SUCCESS,
  FETCH_WHITELABEL_DATA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: true,
  data: null,
};

const fetchWhiteLabelDataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_WHITELABEL_DATA:
      return { ...state, loading: true };
    case FETCH_WHITELABEL_DATA_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case FETCH_WHITELABEL_DATA_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default fetchWhiteLabelDataReducer;
