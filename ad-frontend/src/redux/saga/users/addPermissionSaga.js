import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_PERMISSION } from "../../action/types";
import {
  addPermissionFailure,
  addPermissionSuccess,
} from "../../action/users/addPermissionAction";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addPermissionRequest(action) {
  
  try {
    const { data } = yield API.post(
      "admin/allow-disallow-bet-block-unblock-user",
      action.payload.data
    );
    let responseData = data;    
    if (responseData.meta.code === 200) {
      yield put(addPermissionSuccess(responseData.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 400) {
      yield put(addPermissionFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, responseData);
    } else if (responseData.meta.code === 401) {
      yield put(addPermissionFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, responseData);
      invalidTokenAction();
    } else {
      yield put(addPermissionFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(addPermissionFailure());
    if (error.response.data.code === 400) {
      notifyWarning(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchAddPermissionAPI() {
  yield takeEvery(ADD_PERMISSION, addPermissionRequest);
}

export default function* rootSaga() {
  yield all([watchAddPermissionAPI()]);
}
