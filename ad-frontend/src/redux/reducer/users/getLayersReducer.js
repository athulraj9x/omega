import {
  GET_LAYERS,
  GET_LAYERS_SUCCESS,
  GET_LAYERS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  layersData: null,
};

const layersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAYERS:
      return { ...state, loading: true };
    case GET_LAYERS_SUCCESS:
      return { ...state, layersData: action.payload, loading: false };
    case GET_LAYERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default layersReducer;
