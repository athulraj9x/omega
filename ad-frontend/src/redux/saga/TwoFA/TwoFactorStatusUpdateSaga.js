import { all, call, put, takeEvery } from "redux-saga/effects";
import { updateTwoFactorStatusActionFailure, updateTwoFactorStatusActionSuccess } from "../../action";
import { notifySuccess, notifyWarning } from "../../../utils/helper";
import api from "../../../utils/api";
import { UPDATE_TWO_FACTOR_STATUS } from "../../action/types";


function* twoFactorStatusUpdateRequest(action) {
  try {
    const { data } = yield api.put(
      "/admin/two-factor-auth/update",
      action?.payload?.data
    );
    if (data?.meta?.code === 200) {
      if(data.data.status){
        notifySuccess(data?.meta?.message);
      }else{
        notifyWarning(data?.meta?.message);
      }
      yield put(updateTwoFactorStatusActionSuccess(data));
      yield call(action.payload.callback, data);
    } else if (data?.code === 400) {
      yield put(updateTwoFactorStatusActionFailure());
      notifyWarning(data?.message);
    } else if (data?.meta?.code !== 200) {
      yield put(updateTwoFactorStatusActionFailure());
      notifyWarning(data?.meta?.message);
    }
  } catch (error) {
    yield put(updateTwoFactorStatusActionFailure());
    notifyWarning(error?.response?.data?.message);
  }
}

export function* watchTwoFactorUpdateStatusAPI() {
  yield takeEvery(UPDATE_TWO_FACTOR_STATUS, twoFactorStatusUpdateRequest);
}

export default function* rootSaga() {
  yield all([watchTwoFactorUpdateStatusAPI()]);
}
