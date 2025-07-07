import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_BETXEXCHANGE_SSOID } from "../../action/types";
import {
    addBetxExchangeSsoIdSuccess,
    addBetxExchangeSsoIdFailure,
} from "../../action/ssoId/betxExchangeSsoidAction";
import API from "../../../utils/betxExchangeApi";
import { notifyDanger, notifySuccess,betxexchangeid } from "../../../utils/helper";

function* addBetxExchangeSsoIdRequest(action) {
  try {
    let responseData;
    if (action?.payload?.betxparam?.get) {
      const { data } = yield API.get(
        `/ssoids?id=${betxexchangeid}`,
      );
      responseData = data;
    }
    else {
      const { data } = yield API.post(`/ssoid`, action.payload?.param);
      responseData = data;
    }

    if (responseData?.meta?.code === 200) {
      yield put(addBetxExchangeSsoIdSuccess(responseData));
      yield call(action.payload.callback, responseData);
      if (!action?.payload?.betxparam?.get) {
        notifySuccess(responseData?.meta?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      yield put(addBetxExchangeSsoIdFailure(responseData?.data));
      yield call(action.payload.callback, responseData);
    }
  } catch (error) {
    console.log(error);
    yield put(addBetxExchangeSsoIdFailure());
    yield call(action.payload.callback, error);
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchBETXEXCHANGESSOIDAPI() {
  yield takeEvery(ADD_BETXEXCHANGE_SSOID, addBetxExchangeSsoIdRequest);
}

export default function* rootSaga() {
  yield all([watchBETXEXCHANGESSOIDAPI()]);
}
