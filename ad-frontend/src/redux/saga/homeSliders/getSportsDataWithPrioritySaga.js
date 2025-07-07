import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_SPORTS_DATA_WITH_PRIORITY } from "../../action/types";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";
import { getSportsDataWithPriorityFailure, getSportsDataWithPrioritySuccess } from "../../action";

function* getSportsDataWithPriorityAPI(action) {
  try {
    const { data } = yield API.get("admin/sport-data-home");
    if (data?.meta?.code === 200) {
      yield put(getSportsDataWithPrioritySuccess(data?.data));
      yield call(action.payload.callback, data);
      // notifySuccess(data?.meta?.message, {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
    } else {
      yield put(getSportsDataWithPriorityFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(getSportsDataWithPriorityFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchSportsDataWithPriorityAPI() {
  yield takeEvery(GET_SPORTS_DATA_WITH_PRIORITY, getSportsDataWithPriorityAPI);
}

export default function* rootSaga() {
  yield all([watchSportsDataWithPriorityAPI()]);
}
