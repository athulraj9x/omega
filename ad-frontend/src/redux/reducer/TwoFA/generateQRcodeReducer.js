import { GENERATE_QR_CODE, GENERATE_QR_CODE_FAILURE, GENERATE_QR_CODE_SUCCESS } from "../../action/types";


const INIT_STATE = {
  loading: false,
};

const generateQRcodeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GENERATE_QR_CODE:
      return { ...state, loading: true };
    case GENERATE_QR_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GENERATE_QR_CODE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default generateQRcodeReducer;
