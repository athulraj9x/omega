import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_GROUP_NAME } from "../../action/types";
import {
  addGroupNameFailure,
  addGroupNameSuccess,
} from "../../action";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addGroupNameRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-groupname",
      action.payload.data
    );
    let responseData = data;
    if (responseData.meta.code === 200) {
      yield put(addGroupNameSuccess(responseData.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code !== 400) {
      yield put(addGroupNameFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(addGroupNameFailure());
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

export function* watchAddGroupNameAPI() {
  yield takeEvery(ADD_GROUP_NAME, addGroupNameRequest);
}

export default function* rootSaga() {
  yield all([watchAddGroupNameAPI()]);
}
