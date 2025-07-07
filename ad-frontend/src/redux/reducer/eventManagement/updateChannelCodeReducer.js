import {
  UPDATE_CHANNEL_CODE,
  UPDATE_CHANNEL_CODE_SUCCESS,
  UPDATE_CHANNEL_CODE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateChannelCodeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_CHANNEL_CODE:
      return { ...state, loading: true };
    case UPDATE_CHANNEL_CODE_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_CHANNEL_CODE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateChannelCodeReducer;
