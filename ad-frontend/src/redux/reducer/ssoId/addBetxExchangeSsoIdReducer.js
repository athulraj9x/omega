import { ADD_BETXEXCHANGE_SSOID , ADD_BETXEXCHANGE_SSOID_SUCCESS , ADD_BETXEXCHANGE_SSOID_FAILURE } from "../../action/types";
const INIT_STATE ={
    loading :false
}

const AddBetxExchangeSsoid =(state = INIT_STATE , action)=>{
    switch(action?.type){
        case ADD_BETXEXCHANGE_SSOID :
            return {...state , loading : true};
        case ADD_BETXEXCHANGE_SSOID_SUCCESS:
            return {...state , loading : false};
        case ADD_BETXEXCHANGE_SSOID_FAILURE:
            return {...state , loading : false};
        default:
            return state;
    }
}
export default AddBetxExchangeSsoid;