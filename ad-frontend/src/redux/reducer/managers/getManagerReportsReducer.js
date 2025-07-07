import {
  GET_ACCOUNTS_MANAGER_REPORTS,
  GET_ACCOUNTS_MANAGER_REPORTS_SUCCESS,
  GET_ACCOUNTS_MANAGER_REPORTS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  reportsData: null,
};

const managerReportsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACCOUNTS_MANAGER_REPORTS:
      return { ...state, loading: true };
    case GET_ACCOUNTS_MANAGER_REPORTS_SUCCESS:
      return { ...state, reportsData: action.payload, loading: false };
    case GET_ACCOUNTS_MANAGER_REPORTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default managerReportsReducer;
