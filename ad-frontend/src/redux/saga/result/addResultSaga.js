import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_RESULT } from "../../action/types";
import {
  addResultFailure,
  addResultSuccess,
} from "../../action/result/resultAction";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addResultRequest(action) {
  try {
    let responseData;
    if (action?.payload?.data?.market_type === "fancy") {
      const { data } = yield API.post(
        "admin/fancy-results",
        action.payload.data
      );
      responseData = data;
    } else {
      const { data } = yield API.post("admin/results", action.payload.data);
      responseData = data;
    }
 
    if (responseData.meta.code === 200) {
      yield put(addResultSuccess(responseData.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 400) {
      yield put(addResultFailure());
      yield call(action.payload.callback, responseData.data);
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 401) {
      yield put(addResultFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, responseData.data);
      invalidTokenAction();
    } else {
      yield put(addResultFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, responseData.data);
    }
  } catch (error) {
    yield put(addResultFailure());
    if (error.response.data.code === 400) {
      notifyWarning(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, "");
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchAddResultAPI() {
  yield takeEvery(ADD_RESULT, addResultRequest);
}

export default function* rootSaga() {
  yield all([watchAddResultAPI()]);
}
