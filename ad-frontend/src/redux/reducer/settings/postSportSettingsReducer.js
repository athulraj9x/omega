import {
  POST_SPORT_SETTINGS,
  POST_SPORT_SETTINGS_FAILURE,
  POST_SPORT_SETTINGS_SUCCESS,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const postSportSettings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case POST_SPORT_SETTINGS:
      return { ...state, loading: true };
    case POST_SPORT_SETTINGS_SUCCESS:
      return { ...state, loading: false };
    case POST_SPORT_SETTINGS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default postSportSettings;
