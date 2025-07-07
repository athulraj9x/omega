import {
  EVENT_DEACTIVATED,
  EVENT_DEACTIVATED_SUCCESS,
  EVENT_DEACTIVATED_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const eventDeActivatedReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case EVENT_DEACTIVATED:
      return { ...state, loading: true };
    case EVENT_DEACTIVATED_SUCCESS:
      return { ...state, loading: false };
    case EVENT_DEACTIVATED_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default eventDeActivatedReducer;
