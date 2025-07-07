import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { DELETE_SLIDER } from "../../action/types";
import {
  deleteSliderFailure,
  deleteSliderSuccess,
} from "../../action/homeSliders/deleteSliderAction";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* deleteSliderRequest(action) {
  try {
    const { data } = yield API.delete(
      `admin/home-slider/${action?.payload?.id}`
    );
    if (data?.meta?.code === 200) {
      yield put(deleteSliderSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(deleteSliderFailure(data?.data));
      yield call(action.payload.callback, data);
      notifyDanger(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error);
    yield call(action.payload.callback, error?.response);
    yield put(deleteSliderFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDeleteSliderStatusAPI() {
  yield takeEvery(DELETE_SLIDER, deleteSliderRequest);
}

export default function* rootSaga() {
  yield all([watchDeleteSliderStatusAPI()]);
}
