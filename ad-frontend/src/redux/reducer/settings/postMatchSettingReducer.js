import {
  POST_MATCH_SETTING,
  POST_MATCH_SETTING_SUCCESS,
  POST_MATCH_SETTING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const postMatchSetting = (state = INIT_STATE, action) => {
  switch (action.type) {
    case POST_MATCH_SETTING:
      return { ...state, loading: true };
    case POST_MATCH_SETTING_SUCCESS:
      return { ...state, loading: false };
    case POST_MATCH_SETTING_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default postMatchSetting;
