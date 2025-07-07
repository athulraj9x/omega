import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_SLIDER } from "../../action/types";
import {
  updateSliderFailure,
  updateSliderSuccess,
} from "../../action/homeSliders/updateStatusAction";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* updateSliderRequest(action) {
  try {
    const { data } = yield API.put("admin/home-slider", action?.payload?.data);
    if (data?.meta?.code === 200) {
      yield put(updateSliderSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(updateSliderFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(updateSliderFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchUpdateSliderStatusAPI() {
  yield takeEvery(UPDATE_SLIDER, updateSliderRequest);
}

export default function* rootSaga() {
  yield all([watchUpdateSliderStatusAPI()]);
}
