import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../types/authTypes";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
