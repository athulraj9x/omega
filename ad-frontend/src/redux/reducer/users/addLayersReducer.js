import {
  ADD_LAYERS,
  ADD_LAYERS_SUCCESS,
  ADD_LAYERS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const addLayer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_LAYERS:
      return { ...state, loading: true };
    case ADD_LAYERS_SUCCESS:
      return { ...state, loading: false };
    case ADD_LAYERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default addLayer;
