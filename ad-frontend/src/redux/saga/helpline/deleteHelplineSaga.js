import { all, call, put, takeEvery } from "redux-saga/effects";
import {
  WHITELABEL_B2C_HELPLINE_DELETE,
} from "../../action/types";
import { deleteHelplineSuccess, deleteHelplineFailure, getHelplineSuccess } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifySuccess,
  notifyWarning,
  notifyDanger,
} from "../../../utils/helper";

function* deleteHelplineRequest(action) {
  try {
    const { helplineId } = action.payload; // Assuming `helplineId` is part of the payload
    const { data } = yield API.post(
      `admin/delete-helplines`,
      { helplineId } 
    );
    if (data?.meta?.code === 200) {
      yield put(deleteHelplineSuccess());
      yield put(getHelplineSuccess(data?.data.helpline)); // Dispatch success action
      notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(deleteHelplineFailure());
      notifyWarning(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(deleteHelplineFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchDeleteHelplineAPI() {
  yield takeEvery(WHITELABEL_B2C_HELPLINE_DELETE, deleteHelplineRequest);
}

export default function* rootSaga() {
  yield all([watchDeleteHelplineAPI()]);
}
