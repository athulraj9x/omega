import {
    CHANGE_ERROR_BETS, CHANGE_ERROR_BETS_SUCCESS, CHANGE_ERROR_BETS_FAILURE
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    status: null
};

const changeErrorBetReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_ERROR_BETS:
            return { ...state, loading: true };
        case CHANGE_ERROR_BETS_SUCCESS:
            return { ...state, status: action.payload, loading: false };
        case CHANGE_ERROR_BETS_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default changeErrorBetReducer;
