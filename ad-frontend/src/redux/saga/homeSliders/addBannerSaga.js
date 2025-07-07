import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_BANNER } from "../../action/types";
import {
  addBannerFailure,
  addBannerSuccess,
} from "../../action/homeSliders/addBannerAction";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addBannerRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/add-home-slider",
      action.payload.data
    );
    if (data?.meta?.code === 200) {
      yield put(addBannerSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addBannerFailure(data?.data));
      yield call(action.payload.callback, data);
      notifyDanger(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error);
    yield put(addBannerFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddBannerAPI() {
  yield takeEvery(ADD_BANNER, addBannerRequest);
}

export default function* rootSaga() {
  yield all([watchAddBannerAPI()]);
}
