import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_BANK } from "../../action/types";
import { getBankSuccess, getBankFailure } from "../../action";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* getBankRequest(action) {
  try {
    const { data } = yield API.get("admin/bank");
    if (data?.meta?.code === 200) {
      yield put(getBankSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else {
      yield put(getBankFailure(data?.data));
    }
  } catch (error) {
    console.log("error",error);
    yield put(getBankFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchGetBankAPI() {
  yield takeEvery(GET_BANK, getBankRequest);
}

export default function* rootSaga() {
  yield all([watchGetBankAPI()]);
}
