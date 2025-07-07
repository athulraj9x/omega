import { ADD_BETXEXCHANGE_SSOID , ADD_BETXEXCHANGE_SSOID_SUCCESS ,  ADD_BETXEXCHANGE_SSOID_FAILURE } from "../types";

export const addBetxExchangeSsoId =(payload)=>({
    type : ADD_BETXEXCHANGE_SSOID,
    payload
});

export const addBetxExchangeSsoIdSuccess =(payload)=>({
    type : ADD_BETXEXCHANGE_SSOID_SUCCESS,
    payload
});

export const addBetxExchangeSsoIdFailure =()=>({
    type : ADD_BETXEXCHANGE_SSOID_FAILURE
})