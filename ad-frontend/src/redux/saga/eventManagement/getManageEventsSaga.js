import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_MANAGE_EVENTDATA } from "../../action/types";
import {
  getManageEventDataSuccess,
  getManageEventDataFailure,
} from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getManageEventRequest(action) {
  try {
    let responseData;
    if (action?.payload?.result) {
      // FOR FETCHING THE DATA TO SUBMIT RESULT
      const { data } = yield API.get(
        `/admin/get-sports-db?sportId=${action.payload?.id}`
      );
      responseData = data;
    } else {
      // FOR GETTING THE SPORTS DATA FOR EVENT MANAGEMENT
      const { data } = yield API.get(
        `/admin/exchange-book?sportId=${action.payload?.data?.id}&&page=${action.payload?.data?.currentPage}`
      );
      responseData = data;
    }
    if (responseData.meta.code === 200) {
      yield put(getManageEventDataSuccess(responseData));
      yield call(action.payload.callback, responseData);
      
    } else if (responseData.meta.code === 401) {
      yield put(getManageEventDataFailure());
      invalidTokenAction();
    } else if (responseData.meta.code !== 200) {
      yield put(getManageEventDataFailure());
      yield call(action.payload.callback, responseData.meta);
    }
  } catch (error) {
    yield put(getManageEventDataFailure());
  }
}

export function* watchManageEventAPI() {
  yield takeEvery(GET_MANAGE_EVENTDATA, getManageEventRequest);
}

export default function* rootSaga() {
  yield all([watchManageEventAPI()]);
}
