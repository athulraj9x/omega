// import { getDefaultState } from "../../../utils/helper";
import {
  GLOBAL_CURRENCY_VALUE_SUCCESS,
  GLOBAL_CURRENCY_VALUE,
} from "../../action/types";

// const defaultValues = getDefaultState("globalCurrencyValue");

const INIT_STATE = {
  globalCurrencyValue: null,
};

const globalCurrencyValueReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GLOBAL_CURRENCY_VALUE:
      return { ...state };
    case GLOBAL_CURRENCY_VALUE_SUCCESS:
      return { ...state, globalCurrencyValue: action?.payload };
    default:
      return state;
  }
};

export default globalCurrencyValueReducer;
