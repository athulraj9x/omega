import { GETALLUSERS, GETALLUSERSSUCCESS, GETALLUSERSFAILURE } from "../types";

export const getAllusers = (payload) => ({
  type: GETALLUSERS,
  payload,
});

export const getAllusersSuccess = (payload) => ({
  type: GETALLUSERSSUCCESS,
  payload,
});

export const getAllusersFailure = () => ({
  type: GETALLUSERSFAILURE,
});
