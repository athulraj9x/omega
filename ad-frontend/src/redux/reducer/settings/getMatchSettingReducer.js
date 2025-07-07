import {
  GET_MATCH_SETTING,
  GET_MATCH_SETTING_SUCCESS,
  GET_MATCH_SETTING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  matchSetting: null,
};

const getMatchSettingReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MATCH_SETTING:
      return { ...state, loading: true };
    case GET_MATCH_SETTING_SUCCESS:
      return { ...state, matchSetting: action.payload, loading: false };
    case GET_MATCH_SETTING_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getMatchSettingReducer;
