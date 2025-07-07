import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_SSOID } from "../../action/types";
import {
  addSsoIdSuccess,
  addSsoIdFailure,
} from "../../action/ssoId/addSsoIDAction";
import API from "../../../utils/api";
import { notifyDanger, notifySuccess } from "../../../utils/helper";

function* addSSOIDRequest(action) {
  try {
    let responseData;
    if (action?.payload?.param?.get) {
      const { data } = yield API.get(
        `admin/ssoid?type=${action?.payload?.param?.val}`
      );
      responseData = data;
    } else {
      const { data } = yield API.post("admin/ssoid", action.payload?.param);
      responseData = data;
    }

    if (responseData?.meta?.code === 200) {
      yield put(addSsoIdSuccess(responseData));
      yield call(action.payload.callback, responseData);
      if (!action?.payload?.param?.get) {
        notifySuccess(responseData?.meta?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      yield put(addSsoIdFailure(responseData?.data));
      yield call(action.payload.callback, responseData);
    }
  } catch (error) {
    console.log(error);
    yield put(addSsoIdFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchSSOIDAPI() {
  yield takeEvery(ADD_SSOID, addSSOIDRequest);
}

export default function* rootSaga() {
  yield all([watchSSOIDAPI()]);
}
