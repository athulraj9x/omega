import {
    ERRORBETS, ERRORBETSFAILURE, ERRORBETSSUCCESS
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    errorBets: null,
};

const errorBetReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case ERRORBETS:
            return { ...state, loading: true };
        case ERRORBETSSUCCESS:
            return { ...state, errorBets: action.payload, loading: false };
        case ERRORBETSFAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default errorBetReducer;