import {
  GET_MANAGE_EVENTDATA,
  GET_MANAGE_EVENTDATA_SUCCESS,
  GET_MANAGE_EVENTDATA_FAILURE,
} from "../types";

export const getManageEventData = (payload) => ({
  type: GET_MANAGE_EVENTDATA,
  payload,
});

export const getManageEventDataSuccess = (payload) => ({
  type: GET_MANAGE_EVENTDATA_SUCCESS,
  payload,
});

export const getManageEventDataFailure = () => ({
  type: GET_MANAGE_EVENTDATA_FAILURE,
});
