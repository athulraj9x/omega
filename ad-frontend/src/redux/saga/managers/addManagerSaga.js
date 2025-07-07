import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_MANAGER } from "../../action/types";
import {
  addManagerFailure,
  addManagerSuccess,
} from "../../action/managers/addManagerAction";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addManagerRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/create-manager",
      action.payload.data
    );

    if (data?.meta?.code === 200) {
      yield put(addManagerSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addManagerFailure(data?.data));
      yield call(action.payload.callback, data);
      notifyDanger(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(addManagerFailure());
    yield call(action.payload.callback, error?.response?.data);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddManagerAPI() {
  yield takeEvery(ADD_MANAGER, addManagerRequest);
}

export default function* rootSaga() {
  yield all([watchAddManagerAPI()]);
}
