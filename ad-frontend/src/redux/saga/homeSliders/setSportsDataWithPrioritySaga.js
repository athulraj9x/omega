import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { SET_SPORTS_DATA_WITH_PRIORITY } from "../../action/types";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";
import { setSportsPriorityFailure, setSportsPrioritySuccess } from "../../action";

function* setSportsDataWithPriorityAPI(action) {
  try {
    const { data } = yield API.post("admin/update-home-sport",action.payload.data);
    if (data?.meta?.code === 200) {
      yield put(setSportsPrioritySuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(setSportsPriorityFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(setSportsPriorityFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchSetSportsDataWithPriorityAPI() {
  yield takeEvery(SET_SPORTS_DATA_WITH_PRIORITY, setSportsDataWithPriorityAPI);
}

export default function* rootSaga() {
  yield all([watchSetSportsDataWithPriorityAPI()]);
}
