import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_HORSE_RACE_MATCH_ALL } from "../../action/types";
import { addRaceEventAllSuccess, addRaceEventAllFailure } from "../../action";
import horseRaceApi from "../../../utils/horseRaceApi";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addRaceEventsAllRequest(action) {
  try {
    const { data } = yield horseRaceApi.get("admin/add-race-all");
    if (data?.meta?.code === 200) {
      yield put(addRaceEventAllSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addRaceEventAllFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(addRaceEventAllFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddRaceEventAllAPI() {
  yield takeEvery(ADD_HORSE_RACE_MATCH_ALL, addRaceEventsAllRequest);
}

export default function* rootSaga() {
  yield all([watchAddRaceEventAllAPI()]);
}
