import {
  CRYPTO_PAYMENT_MANUAL_UPDATEION,
  CRYPTO_PAYMENT_MANUAL_UPDATEION_SUCCESS,
  CRYPTO_PAYMENT_MANUAL_UPDATEION_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  data: null,
  loading: false,
};

const cryptoManualUpdate = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CRYPTO_PAYMENT_MANUAL_UPDATEION:
      return { ...state, loading: true };
    case CRYPTO_PAYMENT_MANUAL_UPDATEION_SUCCESS:
      return { ...state, data: action?.payload?.data, loading: false };
    case CRYPTO_PAYMENT_MANUAL_UPDATEION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default cryptoManualUpdate;
