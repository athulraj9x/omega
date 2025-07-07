import {
  POST_LEAGUE_SETTING,
  POST_LEAGUE_SETTING_SUCCESS,
  POST_LEAGUE_SETTING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const postLeagueSetting = (state = INIT_STATE, action) => {
  switch (action.type) {
    case POST_LEAGUE_SETTING:
      return { ...state, loading: true };
    case POST_LEAGUE_SETTING_SUCCESS:
      return { ...state, loading: false };
    case POST_LEAGUE_SETTING_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default postLeagueSetting;
