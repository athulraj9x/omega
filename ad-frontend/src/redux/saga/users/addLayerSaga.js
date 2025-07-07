import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ADD_LAYERS } from "../../action/types";
import {
  addLayerFailure,
  addLayerSuccess,
} from "../../action/users/addLayerAction";
import API from "../../../utils/api";
import {
  invalidTokenAction,
  notifyDanger,
  notifySuccess,
  notifyWarning,
} from "../../../utils/helper";

function* addLayerRequest(action) {
  try {
    var responseData;
    if (action?.payload?.data?.role === 7) {
      const { data } = yield API.post("admin/create-user", action.payload.data);
      responseData = data;
    } else {
      const { data } = yield API.post("admin/layer", action.payload.data);
      responseData = data;
    }
 
    if (responseData?.meta?.code === 200) {
      yield put(addLayerSuccess(responseData?.data));
      yield call(action.payload.callback, responseData);
      notifySuccess(responseData?.meta?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }else{
      yield put(addLayerFailure(responseData?.data));
      yield call(action.payload.callback, responseData);
    }
  } catch (error) {
    yield put(addLayerFailure());
    notifyDanger("Internal Server Error.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export function* watchAddLayerAPI() {
  yield takeEvery(ADD_LAYERS, addLayerRequest);
}

export default function* rootSaga() {
  yield all([watchAddLayerAPI()]);
}
