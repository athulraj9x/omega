import { UPLOAD_APK, UPLOAD_APK_SUCCESS, UPLOAD_APK_FAILURE } from "../../action/types";

const INIT_STATE = {
  loading: false,
  authDetailData: null,
};

const UploadApkReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPLOAD_APK:
      return { ...state, loading: true };
    case UPLOAD_APK_SUCCESS:
      return { ...state, authDetailData: action?.payload, loading: false };
    case UPLOAD_APK_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default UploadApkReducer;
