import {
  ADD_WHITELABEL,
  ADD_WHITELABEL_SUCCESS,
  ADD_WHITELABEL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addWhiteLabel = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_WHITELABEL:
      return { ...state, loading: true };
    case ADD_WHITELABEL_SUCCESS:
      return { ...state, loading: false };
    case ADD_WHITELABEL_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addWhiteLabel;
