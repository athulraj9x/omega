import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_CREDIT_REFERENCE } from "../../action/types";
import {
  addCreditReferenceFailure,
  addCreditReferenceSuccess,
} from "../../action/users/addCreditReferenceAction";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifySuccess, notifyWarning } from "../../../utils/helper";

function* addCreditReferenceRequest(action) {
  try {
    const { data } = yield API.post(
      "admin/update-credit-reference",
      action.payload.data
    );
    let responseData = data;
    if (responseData.meta.code === 200) {
      yield put(addCreditReferenceSuccess(responseData.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 400) {
      yield put(addCreditReferenceFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (responseData.meta.code === 401) {
      yield put(addCreditReferenceFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      invalidTokenAction();
    } else {
      yield put(addCreditReferenceFailure());
      notifyWarning(responseData.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(addCreditReferenceFailure());
    if (error.response.data.code === 400) {
      notifyWarning(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      notifyDanger("Internal Server Error.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }
}

export function* watchAddCreditReferenceAPI() {
  yield takeEvery(ADD_CREDIT_REFERENCE, addCreditReferenceRequest);
}

export default function* rootSaga() {
  yield all([watchAddCreditReferenceAPI()]);
}
