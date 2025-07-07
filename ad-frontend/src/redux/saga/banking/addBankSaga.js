import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_BANK } from "../../action/types";
import {
  addBankSuccess,
  addBankFailure,
} from "../../action";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addBankRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/add-bank",
      action.payload.data
    );
    if (data?.meta?.code === 200) {
      yield put(addBankSuccess(data?.data));
      yield call(action.payload.callback, data);
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addBankFailure(data?.data));
      yield call(action.payload.callback, data);
    }
  } catch (error) {
    yield put(addBankFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddBankAPI() {
  yield takeEvery(ADD_BANK, addBankRequest);
}

export default function* rootSaga() {
  yield all([watchAddBankAPI()]);
}
