import {
  SET_COMMISSION_VALUE,
  SET_COMMISSION_VALUE_SUCCESS,
  SET_COMMISSION_VALUE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  commission: null,
};

const setCommissionValueReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_COMMISSION_VALUE:
      return { ...state, loading: true };
    case SET_COMMISSION_VALUE_SUCCESS:
      return { ...state, currencyData: action?.payload?.data
        , loading: false };
    case SET_COMMISSION_VALUE_FAILURE:
      return { ...state, loading: false };
    default :
      return {
        ...state
      };
  }
};

export default setCommissionValueReducer;
