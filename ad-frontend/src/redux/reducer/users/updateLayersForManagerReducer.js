import {
  UPDATE_LAYERS_FOR_MANAGER,
  UPDATE_LAYERS_FOR_MANAGER_SUCCESS,
  UPDATE_LAYERS_FOR_MANAGER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
};

const updateLayersForManager = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_LAYERS_FOR_MANAGER:
      return { ...state, loading: true };
    case UPDATE_LAYERS_FOR_MANAGER_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_LAYERS_FOR_MANAGER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default updateLayersForManager;
