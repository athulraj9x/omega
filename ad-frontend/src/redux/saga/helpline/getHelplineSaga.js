import { all, call, put, takeEvery } from "redux-saga/effects";
import { WHITELABEL_B2C_HELPLINE_GET } from "../../action/types";
import { getHelplineSuccess, getHelplineFailure } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifySuccess,
  notifyWarning,
  notifyDanger,
} from "../../../utils/helper";

function* getHelplineRequest(action) {
  try {
    const { data } = yield API.get("admin/helplines"); // Replace with actual URL to fetch helplines
    if (data?.meta?.code === 200) {
      yield put(getHelplineSuccess(data?.data.helpline)); // Dispatch success action with data
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(getHelplineFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(getHelplineFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchGetHelplineAPI() {
  yield takeEvery(WHITELABEL_B2C_HELPLINE_GET, getHelplineRequest);
}

export default function* rootSaga() {
  yield all([watchGetHelplineAPI()]);
}
