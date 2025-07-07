import {
  GET_COMMISSION_REPORTS,
  GET_COMMISSION_REPORTS_SUCCESS,
  GET_COMMISSION_REPORTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  commissionReportsData: null,
};

const getCommissionReportsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COMMISSION_REPORTS:
      return { ...state, loading: true };
    case GET_COMMISSION_REPORTS_SUCCESS:
      return {
        ...state,
        commissionReportsData: action.payload,
        loading: false,
      };
    case GET_COMMISSION_REPORTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default getCommissionReportsReducer;
 