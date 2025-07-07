import { getDefaultState } from "../../../utils/helper";
import {
  GLOBAL_MARKET_CODES_SUCCESS,
  GLOBAL_MARKET_CODES,
} from "../../action/types";

const defaultValues = getDefaultState("globalMarketCodes");

const INIT_STATE = {
  globalMarketCodes: defaultValues,
};

const globalMarketCodesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GLOBAL_MARKET_CODES:
      return { ...state };
    case GLOBAL_MARKET_CODES_SUCCESS:
      return { ...state, globalMarketCodes: action?.payload };
    default:
      return state;
  }
};

export default globalMarketCodesReducer;
