import React from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { notifyWarning } from "../../../../../utils/helper";

const Googlelogin = (props) => {
  const onSuccess = (response) => {
    props.callbackData(jwtDecode(response?.credential));
  }

  const handleFailure = (error) => {
    notifyWarning(error?.message || error)
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess} 
      onFailure={handleFailure} 
    />
  );
};

export default Googlelogin;

