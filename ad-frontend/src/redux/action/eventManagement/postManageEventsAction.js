import {
  UPDATE_EVENTMANAGEMENT_DATAS,
  UPDATE_EVENTMANAGEMENT_DATAS_SUCCESS,
  UPDATE_EVENTMANAGEMENT_DATAS_FAILURE,
} from "../types";

export const updateEventManagementDatas = (
  payload,
  eventDatas,
  indexOne,
  indexTwo,
  indexThree,
  countryIndex,
) => ({
  type: UPDATE_EVENTMANAGEMENT_DATAS,
  payload,
  eventDatas,
  indexOne,
  indexTwo,
  indexThree,
  countryIndex,
});

export const updateEventManagementDataSuccess = () => ({
  type: UPDATE_EVENTMANAGEMENT_DATAS_SUCCESS,
});

export const updateEventManagementDataFailure = () => ({
  type: UPDATE_EVENTMANAGEMENT_DATAS_FAILURE,
});
