import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GET_USERS_GROUPS } from "../../action/types";
import {
  getUsersGroupFunctionsFailure,
  getUsersGroupFunctionsSuccess,
} from "../../action";
import API from "../../../utils/api";
import {
  notifyDanger,
  notifyWarning,
} from "../../../utils/helper";

function* getGroupNames(action) {
  try {
    let data = null;
    if (action.payload.review && !action.payload.update) {
      const response = yield API.get(
        "admin/get-users-group",
        action.payload.data
      );
      data = response?.data;
    } else {
      const response = yield API.post(
        "admin/get-users-group",
        action.payload.data
      );
      data = response?.data;
    }

    if (data?.meta.code === 200) {
      yield put(getUsersGroupFunctionsSuccess(data?.data));
      yield call(action.payload.callback, data);
    } else if (data?.meta.code !== 400) {
      yield put(getUsersGroupFunctionsFailure());
      notifyWarning(data?.meta.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    console.log(error)
    yield put(getUsersGroupFunctionsFailure());
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

export function* watchUsersGroupRequest() {
  yield takeEvery(GET_USERS_GROUPS, getGroupNames);
}

export default function* rootSaga() {
  yield all([watchUsersGroupRequest()]);
}
