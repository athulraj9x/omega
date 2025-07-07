import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { CLIENT_2FA_DETAILS } from "../../action/types";
import {
  client2FADetailsSuccess,
  client2FADetailsFailure,
} from "../../action/users/client2FADetails";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifySuccess,
} from "../../../utils/helper";

function* client2FAdetailsRequestAPI(action) {
  try {
    let responseData;
    if(action?.payload?.data?.purpose === "fetchDetails"){
      const { data } = yield API.get(`admin/get-client-2fa-details/${action.payload.data.clientId}`);
      responseData = data
    }else if(action?.payload?.data?.purpose === "updateDetails"){
      const { data } = yield API.post('admin/get-client-2fa-details/update',action.payload.data);
      responseData = data
    }
    if (responseData?.meta?.code === 200) {
      yield put(client2FADetailsSuccess(responseData?.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }else{
      yield put(client2FADetailsFailure,(responseData?.data));
      yield call(action.payload.callback, responseData);
      notifyDanger(responseData?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    yield put(client2FADetailsFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchClient2FAdetailsRequestWatchAPI() {
  yield takeEvery(CLIENT_2FA_DETAILS, client2FAdetailsRequestAPI);
}

export default function* rootSaga() {
  yield all([watchClient2FAdetailsRequestWatchAPI()]);
}
