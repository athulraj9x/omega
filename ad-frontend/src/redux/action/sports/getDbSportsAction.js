import {
  GET_DBSPORTS,
  GET_DBSPORTS_SUCCESS,
  GET_DBSPORTS_FAILURE,
} from "../types";

export const getDbSports = () => ({
  type: GET_DBSPORTS,
});

export const getDbSportsSuccess = (payload) => ({
  type: GET_DBSPORTS_SUCCESS,
  payload,
});

export const getDbSportsFailure = () => ({
  type: GET_DBSPORTS_FAILURE,
});
