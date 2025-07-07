import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_RACE_EVENTS } from "../../action/types";
import { addRaceEventFailure, addRaceEventSuccess } from "../../action";
import horseRaceApi from "../../../utils/horseRaceApi";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addRaceEventsRequest(action) {
  try {
    const { data } = yield horseRaceApi.post("admin/add-race", action.payload.data);
    if (data?.meta?.code === 200) {
      yield put(addRaceEventSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addRaceEventFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    console.log(error);
    yield put(addRaceEventFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddRaceEventAPI() {
  yield takeEvery(ADD_RACE_EVENTS, addRaceEventsRequest);
}

export default function* rootSaga() {
  yield all([watchAddRaceEventAPI()]);
}
