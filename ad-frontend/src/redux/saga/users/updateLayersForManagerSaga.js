import { all, call, put, takeEvery } from "redux-saga/effects";
import { UPDATE_LAYERS_FOR_MANAGER } from "../../action/types";
import { updateLayersForManagerSuccess, updateLayersForManagerFailure } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import { notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* updateLayersForManagerRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-layers-for-manager",
      action?.payload?.data
    );

    if (data.meta.code === 200) {
      yield put(updateLayersForManagerSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess("Updated", {position: toast.POSITION.BOTTOM_CENTER});
    } else if (data.meta.code !== 200) {
      yield put(updateLayersForManagerFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {position: toast.POSITION.BOTTOM_CENTER});
    }
  } catch (error) {
    notifyDanger("password is not updated", {position: toast.POSITION.BOTTOM_CENTER});
    yield put(updateLayersForManagerFailure());
  }
}

export function* watchUpdateLayersForManagerRequestAPI() {
  yield takeEvery(UPDATE_LAYERS_FOR_MANAGER, updateLayersForManagerRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateLayersForManagerRequestAPI()]);
}
