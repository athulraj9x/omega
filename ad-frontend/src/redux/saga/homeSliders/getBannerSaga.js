import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_BANNER } from "../../action/types";
import { getBannerSuccess, getBannerFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction } from "../../../utils/helper";

function* getBannersRequest(action) {
  try {
    const { data } = yield API.post(
      `admin/home-sliders?device`,action?.payload?.payload
    );
    if (data.meta.code === 200) {
      yield put(getBannerSuccess(data?.data));
      yield call(action.payload.callback, data.data);
    } else if (data.meta.code === 401) {
      yield put(getBannerFailure());
      invalidTokenAction();
    } else if (data.meta.code !== 200) {
      yield put(getBannerFailure());
    }
  } catch (error) {
    yield put(getBannerFailure());
  }
}

export function* watchGetBannersAPI() {
  yield takeEvery(GET_BANNER, getBannersRequest);
}

export default function* rootSaga() {
  yield all([watchGetBannersAPI()]);
}
