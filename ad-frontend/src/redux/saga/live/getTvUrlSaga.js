import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_TV_URL } from "../../action/types";
import { getTvUrlSuccess, getTvUrlFailure } from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* getTvUrlRequest(action) {
  try {
    const { data } = yield API.post("admin/get-tv-url");
    if (data?.meta?.code === 200) {
      yield put(getTvUrlSuccess(data));
      yield call(action.payload.callback, data);  
      toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    else if (data?.meta?.code !== 200) {
      yield put(getTvUrlFailure());
      notifyDanger(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(getTvUrlFailure());
    notifyDanger(error?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
  }
}

export function* watchgetTvUrlAPI() {
  yield takeEvery(GET_TV_URL, getTvUrlRequest);
}

export default function* rootSaga() {
  yield all([watchgetTvUrlAPI()]);
}