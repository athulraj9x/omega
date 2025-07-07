import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { RESTRICT_LAYERS_BETS } from "../../action/types";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";
import { restrictLayersBetsFailure, restrictLayersBetsSuccess } from "../../action";

function* restrictClientBets(action) {
  try {
    const { data } = yield API.put(`admin/restrict-bets?status=${action.payload.status}`);

    if (data.meta.code === 200) {
      yield put(restrictLayersBetsSuccess(data.data));
      yield call(action.payload.callback, data);
      notifySuccess(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 400) {
      yield put(restrictLayersBetsFailure());
      yield call(action.payload.callback, data.data);
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code === 401) {
      yield put(restrictLayersBetsFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.data);
      invalidTokenAction();
    } else {
      yield put(restrictLayersBetsFailure());
      notifyWarning(data.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, data.data);
    }
  } catch (error) {
    yield put(restrictLayersBetsFailure());
    if (error.response.data.code === 400) {
      notifyWarning(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield call(action.payload.callback, "");
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* restrictClientBetsAPI() {
  yield takeEvery(RESTRICT_LAYERS_BETS, restrictClientBets);
}

export default function* rootSaga() {
  yield all([restrictClientBetsAPI()]);
}
