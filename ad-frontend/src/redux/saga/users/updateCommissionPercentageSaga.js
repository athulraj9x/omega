import { all, call, put, takeEvery } from "redux-saga/effects";
import { UPDATE_COMMISSION_PERCENTAGE } from "../../action/types";
import {
  updateCommissionPercentageSuccess,
  updateCommissionPercentageFailure,
} from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* updateCommissionPercentageRequest(action) {

  try {
    const { data } = yield API.put(
      "admin/update-commission-percentage",
      action?.payload?.data
    );
    if (data.meta.code === 200) {
      yield put(updateCommissionPercentageSuccess(data));
      yield call(action.payload.callback, data);
      notifySuccess("Commission Percentage Updated", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (data.meta.code !== 200) {
      yield put(updateCommissionPercentageFailure());
      yield call(action.payload.callback, data);
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    notifyDanger("Commission Percentage not Updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    yield put(updateCommissionPercentageFailure());
  }
}

export function* updateCommissionPercentageAPI() {
  yield takeEvery(
    UPDATE_COMMISSION_PERCENTAGE,
    updateCommissionPercentageRequest
  );
}

export default function* rootSaga() {
  yield all([updateCommissionPercentageAPI()]);
}
