import {
    LAYERCURRENCY,
    LAYERCURRENCY_FAILURE,
    LAYERCURRENCY_SUCCESS
  } from "../../action/types";
  
  const INIT_STATE = {
    loading: false,
    currencyData: null,
  };
  
  const currencyLayerReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case LAYERCURRENCY:
        return { ...state, loading: true };
      case LAYERCURRENCY_SUCCESS:
        return { ...state, currencyData: action?.payload?.data
          , loading: false };
      case LAYERCURRENCY_FAILURE:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default currencyLayerReducer;