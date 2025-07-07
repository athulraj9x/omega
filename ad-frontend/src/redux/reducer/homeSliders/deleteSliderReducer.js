import {
  DELETE_SLIDER,
  DELETE_SLIDER_SUCCESS,
  DELETE_SLIDER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const deleteSlider = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_SLIDER:
      return { ...state, loading: true };
    case DELETE_SLIDER_SUCCESS:
      return { ...state, loading: false };
    case DELETE_SLIDER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default deleteSlider;
