import {
  GET_LEAGUE_SETTING,
  GET_LEAGUE_SETTING_SUCCESS,
  GET_LEAGUE_SETTING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  leagueSetting: null,
};

const getLeagueSettingReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LEAGUE_SETTING:
      return { ...state, loading: true };
    case GET_LEAGUE_SETTING_SUCCESS:
      return { ...state, leagueSetting: action.payload, loading: false };
    case GET_LEAGUE_SETTING_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getLeagueSettingReducer;
