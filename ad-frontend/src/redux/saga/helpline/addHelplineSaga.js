import { all, call, put, takeEvery } from "redux-saga/effects";
import { WHITELABEL_B2C_HELPLINE_ADD } from "../../action/types";
import { addHelplineSuccess, addHelplineFailure, getHelplineSuccess } from "../../action";
import API from "../../../utils/api";
import { toast } from "react-toastify";
import {
  notifySuccess,
  notifyWarning,
  notifyDanger,
} from "../../../utils/helper";

function* addHelplineRequest(action) {
  try {
    const { data } = yield API.post("admin/add-helplines", action?.payload.link); // Replace with actual URL to add helplines
    if (data?.meta?.code === 200) {
      yield put(addHelplineSuccess(data?.data));
      yield put(getHelplineSuccess(data.data.helpline)); 
      yield call(action?.payload?.callback, data);
        notifySuccess(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    
    } else if (data?.code === 400) {
      yield put(addHelplineFailure());
  
      notifyWarning(data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      yield put(addHelplineFailure());
     
      notifyDanger(data?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error, "error");
    yield put(addHelplineFailure());
    yield call(action?.payload?.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddHelplineAPI() {
  yield takeEvery(WHITELABEL_B2C_HELPLINE_ADD, addHelplineRequest);
}

export default function* rootSaga() {
  yield all([watchAddHelplineAPI()]);
}
