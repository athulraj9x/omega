import { all, call, put, takeEvery } from "redux-saga/effects";
import { DELETE_USERBET } from "../../action/types";
import { deleteUserBetSuccess, deleteUserBetFailure } from "../../action";
import API from "../../../utils/api";
import { invalidTokenAction, notifySuccess, notifyWarning } from "../../../utils/helper";
import { toast } from "react-toastify";

function* deleteUserBetRequest(action) {
  try {
    let horseRace = false;
    let data = null;
    if(action?.payload?.data) {
      horseRace = action?.payload?.data?.bet[0]?.isHorseRace
    }

    if(horseRace){
      const response = yield API.post(
        "/admin/delete-unmatch-bet-horse",
        action?.payload?.data
      );
      data = response?.data;
    }else{
      const response = yield API.post(
        "/admin/delete-unmatch-bet",
        action?.payload?.data
      );
      data = response?.data;
    }

    if (data.meta.code === 200) {
      yield put(deleteUserBetSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data?.meta?.code === 401) {
      yield put(deleteUserBetFailure());
      invalidTokenAction();
    }else if (data.meta.code !== 200) {
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      yield put(deleteUserBetFailure());
    }
  } catch (error) {
    yield put(deleteUserBetFailure());
  }
}

export function* watchDeleteUserBetAPI() {
  yield takeEvery(DELETE_USERBET, deleteUserBetRequest);
}

export default function* rootSaga() {
  yield all([watchDeleteUserBetAPI()]);
}
