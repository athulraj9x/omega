// import { all, call, put, takeEvery } from "redux-saga/effects";
// import { toast } from "react-toastify";
// import { LOGIN } from "../action/types";
// import { loginSuccess, loginFailure } from "../action/loginAction";
// import API from "../../utils/api";
// // import { setLocalStorageItem } from "../../utils/helper";
// import {
//   ErrorToast,
//   notifyDanger,
//   notifySuccess,
//   setLocalStorageItem,
//   SuccessToast,
// } from "../../utils/helper";

// function* loginRequest(action) {
//   try {
//     const { data } = yield API.post("admin/login", action?.payload?.form);
//     if (data.meta.code === 200) {
//       yield put(loginSuccess(data.data));
//       yield call(setLocalStorageItem, "userData", JSON.stringify(data.data));
//       yield call(setLocalStorageItem, "token", data.meta.token);
//       yield call(action.payload.callback, data?.data);
//       notifyDanger(<ErrorToast msg={data.meta.message} />, {position: toast.POSITION.BOTTOM_CENTER});
//     } else if (data.meta.code !== 200) {
//       yield put(loginFailure());
//       yield call(action.payload.callback, data.meta);
//       yield notifyDanger(<ErrorToast msg={data.meta.message} />);
//     }
//   } catch (error) {
//     yield put(loginFailure());
//     yield notifyDanger(<ErrorToast msg="Internal Server Error." />, {position: toast.POSITION.BOTTOM_CENTER});
//   }
// }

// export function* watchLoginAPI() {
//   yield takeEvery(LOGIN, loginRequest);
// }

// export default function* rootSaga() {
//   yield all([watchLoginAPI()]);
// }
