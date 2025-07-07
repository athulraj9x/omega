import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { LAYERCURRENCY  } from "../../action/types";
import {
getLayerCurrencySuccess,
getLayerCurrencyFailure
} from "../../action";
import API from "../../../utils/api";
import {
  invalidTokenAction,
} from "../../../utils/helper";

function* getLayerCurrencyRequest(action) {
  try {
    if(action?.payload?.layerId){
      const { data } = yield API.get(
        `admin/layerCurrency/${action?.payload?.layerId}`
      );
      if (data.meta.code === 200) {
        yield put(getLayerCurrencySuccess(data));
        yield call(action.payload.callback, data.data);
      } else if (data.meta.code === 401) {
        yield put(getLayerCurrencyFailure());
        invalidTokenAction();
      } else if (data.meta.code !== 200) {
        yield put(getLayerCurrencyFailure());
      }
    }
  } catch (error) {
    yield put(getLayerCurrencyFailure());
  }
}

export function* watchLayerCurrencyAPI() {
    yield takeEvery(LAYERCURRENCY, getLayerCurrencyRequest);
  }
  
  export default function* rootSaga() {
    yield all([watchLayerCurrencyAPI()]);
  }