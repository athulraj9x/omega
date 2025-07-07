import {
  GET_LAYERS_FOR_MANAGER, GET_LAYERS_FOR_MANAGER_SUCCESS, GET_LAYERS_FOR_MANAGER_FAILURE
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  managerLayers: null,
};

const layersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAYERS_FOR_MANAGER:
      return { ...state, loading: true };
    case GET_LAYERS_FOR_MANAGER_SUCCESS:
      return { ...state, managerLayers: action.payload, loading: false };
    case GET_LAYERS_FOR_MANAGER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default layersReducer;
