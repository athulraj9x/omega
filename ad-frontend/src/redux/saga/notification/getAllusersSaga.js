import { all, call, put, takeEvery } from "redux-saga/effects";
import { GETALLUSERS } from "../../action/types";
import {
  getAllusersSuccess,
  getAllusersFailure,
} from "../../action/notification/getAllusers";
import API from "../../../utils/api";

function* getAllusersRequest(action) {
  try {
    const { data } = yield API.get("admin/allusers", action.payload);
    if (data.meta?.code === 200) {
      yield put(getAllusersSuccess(data));
      yield call(action.payload.callback, data);
    } else {
      yield put(getAllusersFailure(data));
    }
  } catch (error) {
    yield put(getAllusersFailure());
  }
}
export function* watchgetAllusersAPI() {
  yield takeEvery(GETALLUSERS, getAllusersRequest);
}

export default function* rootSaga() {
  yield all([watchgetAllusersAPI()]);
}
