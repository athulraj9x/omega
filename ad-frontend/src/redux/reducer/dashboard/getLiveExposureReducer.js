import { LIVEEXPOSURE , LIVEEXPOSURE_FAIL , LIVEEXPOSURE_SUCCESS } from "../../action/types";

const INIT_STATE = {
    loading: false,
    exposure: null,
  };

  const getLiveExposureDataReducer =(state =INIT_STATE , action)=>{
    switch(action.type){
        case LIVEEXPOSURE:
          return {...state, exposure :action.payload , loading : true};
        case LIVEEXPOSURE_SUCCESS :
          return {...state , exposure : action.payload , loading : false};
        case LIVEEXPOSURE_FAIL :
            return {...state , loading : false}
        default:
            return state;
    }
  }
  
  export default getLiveExposureDataReducer