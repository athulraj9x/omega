import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_RESULT } from "../../action/types";
import {
  getResultFailure,
  getResultSuccess,
} from "../../action/result/getResultsAction";
import API from "../../../utils/api";
import { invalidTokenAction, notifyDanger, notifyWarning } from "../../../utils/helper";

function* getResultRequest(action) {
  try {
    const { type, page, perPage, search } = action.payload;
    const { data } = yield API.get(
      `admin/get-results-by-type?market_type=${type}&page=${page}&per_page=${perPage}&search=${search}`
    );
    if (data.meta.code === 200) {
      yield put(getResultSuccess(data.data));
      yield call(action.payload.callback, data);
      //   toast.success(data.meta.message);
    } else if (data.meta.code === 400) {
      yield put(getResultFailure());
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
    } else if (data.meta.code === 401) {
      yield put(getResultFailure());
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
      invalidTokenAction();
    } else {
      yield put(getResultFailure());
      notifyWarning(data.meta.message, { position: toast.POSITION.BOTTOM_CENTER });
    }
  } catch (error) {
    yield put(getResultFailure());
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

export function* watchGetResultAPI() {
  yield takeEvery(GET_RESULT, getResultRequest);
}

export default function* rootSaga() {
  yield all([watchGetResultAPI()]);
}
