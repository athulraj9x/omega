import {
  UPDATE_SETTING,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateSetting = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SETTING:
      return { ...state, loading: true };
    case UPDATE_SETTING_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_SETTING_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateSetting;
