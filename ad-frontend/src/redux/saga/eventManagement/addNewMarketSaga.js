import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_NEW_MARKET } from "../../action/types";
import {
  addNewMarketSuccess,
  addNewMarketFailure,
} from "../../action";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* addNewMarketRequest(action) {
  try {
    const { data } = yield API.post("admin/add-new-markets", action?.payload);
    if (data.meta.code === 200) {
      yield put(addNewMarketSuccess(data.data));
      yield call(action.payload.callback, data);
      toast.dismiss();

      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(addNewMarketFailure());
      toast.dismiss();
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(addNewMarketFailure());
    }
  } catch (error) {
    yield put(addNewMarketFailure());
    toast.dismiss();
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddNewMarketAPI() {
  yield takeEvery(ADD_NEW_MARKET, addNewMarketRequest);
}

export default function* rootSaga() {
  yield all([watchAddNewMarketAPI()]);
}
