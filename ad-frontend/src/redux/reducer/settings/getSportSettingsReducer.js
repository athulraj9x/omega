//this is for fetching Runners from external Api

import {
  GET_SPORT_SETTINGS,
  GET_SPORT_SETTINGS_SUCCESS,
  GET_SPORT_SETTINGS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  sportSetting: null,
};

const getSportSettingsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SPORT_SETTINGS:
      return { ...state, loading: true };
    case GET_SPORT_SETTINGS_SUCCESS:
      return { ...state, sportSetting: action.payload, loading: false };
    case GET_SPORT_SETTINGS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getSportSettingsReducer;
