import { ADD_SSOID , ADD_SSOID_FAILURE ,  ADD_SSOID_SUCCESS } from "../types";

export const addssoId =(payload)=>({
    type : ADD_SSOID,
    payload
});

export const addSsoIdSuccess =(payload)=>({
    type : ADD_SSOID_SUCCESS,
    payload
});

export const addSsoIdFailure =()=>({
    type : ADD_SSOID_FAILURE
})