import React, { Fragment, useEffect, useState, useLayoutEffect } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Btn, H4, P } from "../../../AbstractElements";
import OfficialIconLight from "../../../assets/images/logo/logo-light-white.png";
import OfficialIconDark from "../../../assets/images/logo/logo-dark.png";
import GoogleAuthenticator from "../../../assets/images/authenticator/GoogleAuthenticator.jpg";
import {
  ForgotPassword,
  ManagerRoles,
  Password,
  RememberPassword,
  SignIn,
  Username,
} from "../../../Constant";
import {
  fetchWhiteLabelData,
  googleAuthenticatorOTPValidation,
  login,
  twoAuthentication,
} from "../../../redux/action";
import validateLogin from "../../../validations/login";
import Loader from "../../../Layout/Loader/index";
import { useForm } from "react-hook-form";
import TwoAuth from "./TwoAuthComponents/TwoAuth";
import { socket } from "../../../context/socketContext";
import googleLogo from "../../../assets/images/googleAuthLogo.png";
import {
  notifyWarning,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "../../../utils/helper";
import Googlelogin from "../../../Components/Pages/PageLayout/2FAComponents/GoogleLogin/Googlelogin";
import adminLogo from "../../../assets/images/adminLogo.png";
const LoginTab = () => {
  const [loading, setLoading]= useState(true);
  const { logins, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState({});
  const [togglePassword, setTogglePassword] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const loginState = useSelector((state) => state.Login);
  const [twoFactorAuthGoogle, setTwoFactorAuthGoogle] = useState(false);
  const [twoFactorGoogleAuthenticator, setTwoFactorGoogleAuthenticator] =
    useState(false);
  const [twoFactorGoogleAuthenticatorOTP, setTwoFactorGoogleAuthenticatorOTP] =
    useState("");
  const [
    twoFactorGoogleAuthenticatorOTPError,
    setTwoFactorGoogleAuthenticatorOTPError,
  ] = useState("");
  const [islogin, setIslogin] = useState(true);
  const [whiteLabelData, setWhiteLabelData] = useState(null);

  useLayoutEffect(() => {
    dispatch(
      fetchWhiteLabelData({
        domain: window.location.origin,
        callback: (data) => {
          setWhiteLabelData(data?.data);
          setLoading(false);    
        },
      })
    );
  }, []);

  useLayoutEffect(() => {
    if(window.location.origin!==process.env.REACT_APP_BETXFAIR_DOMAIN_ADMIN){
      const favicon = document.getElementById('favicon');
      const brandFaviconURL = whiteLabelData ? whiteLabelData.logo_dark : "" ;
      if (favicon && brandFaviconURL) {
        favicon.href = brandFaviconURL;
      }
    } else {
      document.title="Betxfair - Admin"
    }
    }, [whiteLabelData]);

  //THIS FUNCTION IS FOR TIMER
  const handleTimeout = () => {
    removeLocalStorageItem("token");
    window.location.reload();
    return;
  };

  const handleChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAuth = (formData) => {
    if (formData && formData.length === 6) {
      let OTP = { OTPValue: formData };
      dispatch(
        twoAuthentication({
          data: OTP,
          callback: (data) => {
            if (data) {
              setIslogin(true);
              setLocalStorageItem("userData", JSON.stringify(adminData));
              setLocalStorageItem("token", adminData.token);
              navigate("/dashboard");
              return;
            }
          },
        })
      );
    } else {
      notifyWarning("Please enter 6 digit OTP");
    }
  };

  const handleGoogleSignIn = (data) => {
    if (data.email_verified && data.email !== null) {
      if (adminData.TFA_email === data?.email) {
        setIslogin(true);
        setTwoFactorAuthGoogle(false);
        setLocalStorageItem("userData", JSON.stringify(adminData));
        setLocalStorageItem("token", adminData.token);
        navigate("/dashboard");
      } else {
        notifyWarning("Email Was mismatch with your 2FA email");
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setTwoFactorGoogleAuthenticatorOTP(value);
  };

  const handleSubmitGoogleOTP = (e) => {
    e.preventDefault();
    if (
      twoFactorGoogleAuthenticatorOTP.length === null ||
      undefined ||
      twoFactorGoogleAuthenticatorOTP.length < 5
    ) {
      setTwoFactorGoogleAuthenticatorOTPError(
        "This Field is required Max length is 6"
      );
      return;
    } else if (twoFactorGoogleAuthenticatorOTP.length === 6) {
      setTwoFactorGoogleAuthenticatorOTPError("");
      const responseObject = {
        withoutAuth: true,
        OTPValue: twoFactorGoogleAuthenticatorOTP,
        validateOTP: true,
        userId: adminData?.userId,
      };

      dispatch(
        googleAuthenticatorOTPValidation({
          data: responseObject,
          callback: (data) => {
            if (data?.data !== null) {
              setIslogin(true);
              setTwoFactorGoogleAuthenticator(false);
              setLocalStorageItem("userData", JSON.stringify(adminData));
              setLocalStorageItem("token", adminData.token);
              navigate("/dashboard");
              return;
            } else {
              twoFactorGoogleAuthenticatorOTP("");
              setTwoFactorGoogleAuthenticatorOTPError("Invalid OTP");
              return;
            }
          },
        })
      );
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = validateLogin(form);
    let data = form;
    if (whiteLabelData) {
      data = { ...form, white_label_id: whiteLabelData?.whitelabelIds };
    }

    if (isValid) {
      setError("");
      dispatch(
        login({
          data,
          callback: (data) => {
            if (data) {
              //IN YOUR CASE WE HAVE MULTIPLE WAY TO ENTER INTO YOUR SYSTEM
              //IF THE ENABLE APP THEN THEY WILL BE GO TO BELOW CODE AND SHOW A DETAILS TO ENTER OTP
              if (
                data?.twoFactorEnabled === true &&
                data?.twoFactorMethod === "app"
              ) {
                setTwoFactorAuth(true);
                return;
              } else if (
                // IN THIS CASE CLIENT ENABLE GOOGLE AUTHENTICATION CODE WILL BE GO HERE
                // HERE ACTUALLY FROM BACKEND WE ARE GETTING SOME DATA WITH A VALIDATOR
                // HERE EXPIIRED === FALSE WHICH MEANS TOKEN IS NOT EXPIRED
                // SO WE CAN REDIRECT INTO OUR DASHBOARD
                data?.twoFactorEnabled === true &&
                data?.twoFactorMethod === "google" &&
                data?.TFA_Token?.expired === false
              ) {
                setLocalStorageItem("userData", JSON.stringify(data));
                setLocalStorageItem("token", data.token);
                navigate("/dashboard");
                return;
              } else if (
                // IN THIS CASE CLIENT ENABLE GOOGLE AUTHENTICATION CODE WILL BE GO HERE
                // HERE ACTUALLY FROM BACKEND WE ARE GETTING SOME DATA WITH A VALIDATOR
                // HERE EXPIIRED === FALSE WHICH MEANS TOKEN IS NOT EXPIRED
                // SO WE CAN REDIRECT INTO OUR DASHBOARD
                data?.twoFactorEnabled === true &&
                data?.twoFactorMethod === "googleAuthenticator" &&
                data?.TFA_Token?.expired === false
              ) {
                setLocalStorageItem("userData", JSON.stringify(data));
                setLocalStorageItem("token", data.token);
                navigate("/dashboard");
                return;
              } else if (
                // IN THIS CASE CLIENT ENABLE GOOGLE AUTHENTICATION CODE WILL BE GO HERE
                // HERE ACTUALLY FROM BACKEND WE ARE GETTING SOME DATA WITH A VALIDATOR
                // HERE EXPIIRED === FALSE WHICH MEANS TOKEN IS NOT EXPIRED
                // SO WE CAN REDIRECT INTO OUR DASHBOARD
                data?.twoFactorEnabled === true &&
                data?.twoFactorMethod === "googleAuthenticator" &&
                data?.TFA_Token?.expired === true
              ) {
                setIslogin(false);
                setAdminData(data);
                setTwoFactorGoogleAuthenticator(true);

                return;
              } else if (
                // IN THIS CASE CLIENT SELECTED GOOGLE AUTHENICATION BUT MAYBE SOME REASON TOKEN IS EXPIRED
                // SO WE WILL OPEN A MODAL TO LOGIN WITH GOOGLE AUTHENTICATION
                // AFTER EACH LOGOUT TOKEN WILL BE REMOVED FROM LOCAL STORAGE AND BACKEND
                data?.twoFactorEnabled === true &&
                data?.twoFactorMethod === "google" &&
                data?.TFA_Token?.expired === true
              ) {
                setIslogin(false);
                setTwoFactorAuthGoogle(true);
                setAdminData(data);
              } else {
                // TESTING CASE ONLY IF MERGE REMOVE THIS FORM HERE
                // socket.emit("2FA-login-notification",JSON.stringify(socketData));
                // TESTING CASE ONLY IF MERGE REMOVE THIS FORM HERE

                // IN THIS DEFAULT CASE WHICH MEANS CLIENT IS NOT ENABLED 2FA
                // SO WE WILL REDIRECT INTO OUR DASHBOARD
                setLocalStorageItem("userData", JSON.stringify(data));
                setLocalStorageItem("token", data.token);
                if(data?.role === ManagerRoles.FANCY_MANAGER){
                  navigate("/running-markets/bookmaker-fancy");
                }
                else{
                  navigate("/dashboard");
                } 
                return;
              }
            }
          },
        })
      );
    } else {
      setError(errors);
    }
  };

  const darkMode = document.querySelector(".dark-only");

  return (
    <Fragment>
      {loginState.loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      ) : (
        <>
          {twoFactorAuth ? (
            <TwoAuth
              iconLight={OfficialIconLight}
              iconDark={OfficialIconLight}
              callbackValue={handleAuth}
              onTimeout={handleTimeout}
            />
          ) : (
            <>
              {islogin && (
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <h4 className="text-dark text-center">
                    {darkMode ? (
                      <img
                        className="dark-mode w-75 mb-3"
                        style={{ width: "12rem", marginTop: "-6px" }}
                        src={`${!loading ? whiteLabelData ? whiteLabelData?.whiteLabel[0]?.logo_dark : adminLogo : ""}`}
                        alt=""
                      />
                    ) : (
                      <img
                        className="dark-mode w-75 mb-3"
                        style={{ width: "12rem", marginTop: "-6px" }}
                        src={`${!loading ? whiteLabelData ? whiteLabelData?.whiteLabel[0]?.logo_light : adminLogo : ""}`}
                        alt=""
                      />
                    )}
                  </h4>
                  {/* <P className="text-dark">{"Enter your username & password to login"}</P> */}
                  <FormGroup>
                    <Label className="col-form-label text-dark">
                      {Username}
                    </Label>
                    <Input
                      className="form-control"
                      name="username"
                      type="text"
                      onChange={handleChange}
                      value={form.username}
                    />
                    <span style={{ color: "red" }}>{error.username}</span>
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label text-dark">
                      {Password}
                    </Label>
                    <div className="position-relative">
                      <Input
                        className="form-control"
                        name="password"
                        type={togglePassword ? "text" : "password"}
                        onChange={handleChange}
                        value={form.password}
                      />
                      <span style={{ color: "red" }}>{error.password}</span>

                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>
                  <div className="position-relative form-group mb-0">
                    <Btn
                      attrBtn={{
                        type: "submit",
                        color: "primary",
                        className: "d-block w-100 mt-4",
                        onClick: (e) => onSubmit(e),
                        disable: loginState.loading,
                      }}
                    >
                      {SignIn}
                    </Btn>
                  </div>
                </Form>
              )}
            </>
          )}

          {twoFactorAuthGoogle && (
            <div className="relative inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">
              <div className="fixed z-[100] inset-0 bg-skin-modalBackgroundBlur bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
                <div className="relative bg-skin-modalBackground p-5 rounded-xl w-96">
                  <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50 flex flex-col items-center justify-center min-h-screen py-2">
                    <div className="bg-[#ffffffd7] shadow-md rounded-lg px-8 pb-8 w-full max-w-md">
                      <div className="flex justify-center mb-6 text-center">
                        <img
                          className="w-50 h-50 rounded-full"
                          src={googleLogo}
                          alt="Google logo"
                        />
                        <h1 className="text-center text-2xl font-medium text-center mb-4">
                          Complete 2FA with Google
                        </h1>
                      </div>
                      <Googlelogin callbackData={handleGoogleSignIn} />
                      <div className="flex justify-between items-center mt-6 text-gray-600">
                        <p className="p-3">English (United States)</p>
                        {/* <div className="flex items-center">
                          <p className="text-sm mr-2">Help</p>
                          <p className="text-sm">Privacy</p>
                          <p className="text-sm">Terms</p>
                        </div> */}
                      </div>
                      <Link to="/">
                        <button className="btn btn btn-outline-dark">
                          Back to login
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {twoFactorGoogleAuthenticator && (
            <div className="fixed inset-0 flex items-center justify-center bg-skin-modalBackgroundBlur bg-opacity-25 backdrop-blur-sm">
              <div className="bg-skin-modalBackground p-5 rounded-xl w-full sm:w-auto max-w-lg">
                <div className="bg-white shadow-md rounded-lg px-8 pb-8">
                  <div className="text-center mb-6">
                    <img
                      className="w-20 h-50 rounded mt-2"
                      src={GoogleAuthenticator}
                      alt="Google logo"
                    />
                  </div>
                  <h4 className="text-2xl font-medium text-center mb-4">
                    Complete with Google Authenticator Extra Layer Security
                  </h4>
                  <div className="max-w-md mx-auto">
                    <p className="text-sm text-gray-500">
                      Enter the 6-digit verification code that in your Google
                      Authenticator App.
                    </p>
                    <form onSubmit={handleSubmitGoogleOTP}>
                      <div className="flex justify-center mt-4">
                        <input
                          type="text"
                          className="form-control text-center form-control-lg"
                          pattern="\d*"
                          maxLength="6"
                          value={twoFactorGoogleAuthenticatorOTP}
                          onChange={handleInputChange}
                        />
                      </div>

                      {twoFactorGoogleAuthenticatorOTPError && (
                        <p className="text-danger mt-2">
                          {twoFactorGoogleAuthenticatorOTPError}
                        </p>
                      )}

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="btn btn-outline-dark btn-lg btn-block"
                        >
                          Verify Passcode
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </Fragment>
  );
};

export default LoginTab;

//change here
