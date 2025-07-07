import {
  UPDATE_SLIDER,
  UPDATE_SLIDER_SUCCESS,
  UPDATE_SLIDER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateSlider = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SLIDER:
      return { ...state, loading: true };
    case UPDATE_SLIDER_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_SLIDER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateSlider;
