import { ADD_SSOID , ADD_SSOID_SUCCESS , ADD_SSOID_FAILURE } from "../../action/types";
const INIT_STATE ={
    loading :false
}

const AddSsoId =(state = INIT_STATE , action)=>{
    switch(action?.type){
        case ADD_SSOID :
            return {...state , loading : true};
        case ADD_SSOID_SUCCESS:
            return {...state , loading : false};
        case ADD_SSOID_FAILURE:
            return {...state , loading : false};
        default:
            return state;
    }
}
export default AddSsoId;