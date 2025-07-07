import {
    GET_INACTIVE_LAYERS,
    GET_INACTIVE_LAYERS_SUCCESS,
    GET_INACTIVE_LAYERS_FAILURE,
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    inactiveLayersData: null,
  };
  
  const getInactiveLayers = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_INACTIVE_LAYERS:
        return { ...state, loading: true };
      case GET_INACTIVE_LAYERS_SUCCESS:
        return { ...state, layersData: action.payload, loading: false };
      case GET_INACTIVE_LAYERS_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default getInactiveLayers;
  