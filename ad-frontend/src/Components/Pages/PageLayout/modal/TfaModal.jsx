import React, { useRef, useState } from "react";
import { Modal, Button, Table, Image, ModalFooter } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Googlelogin from "../2FAComponents/GoogleLogin/Googlelogin";
import { useDispatch } from "react-redux";
import {
  GenerateQRcode,
  authDetail,
  googleAuthenticatorOTPValidation,
  googleloginValidation,
  updateTwoFactorStatusAction,
} from "../../../../redux/action";
import { notifyDanger } from "../../../../utils/helper";
import { useSelector } from "react-redux";
import googleAuthLogo from "../../../../assets/images/googleAuthLogo.png";
import GoogleAuthenticatorLogo from "../../../../assets/images/authenticator/Google_Authenticator_logo.png";
import AndroidIcon from "../../../../assets/images/authenticator/androidIcon.jpg";
import AppleIcon from "../../../../assets/images/authenticator/appleIcon.png";
import { useEffect } from "react";
import "./style.css";
import DownloadButton from "../2FAComponents/DownloadButton/DownloadButton";
import { Link } from "react-router-dom";

const TfaModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state?.Login?.userData);
  const [twoFactorOTP, setTwoFactorOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDisableing, setLoadingDisableing] = useState(false);
  const [newDataReceived, setNewDataReceived] = useState(false);
  const [showQRcode, setShowQRcode] = useState(false);
  const [googleAuthQRcodeUrl, setGoogleAuthQRcodeUrl] = useState("");
  const [setUpKey, setSetUpKey] = useState("");
  const [isCopied, setIsCopied] = useState(null);

  const [currentTFAmethod, setCurrentTFAmethod] = useState(
    userData.twoFactorMethod
  );

  const toggleNewDataReceived = () => {
    setNewDataReceived(!newDataReceived);
  };

  const handleOTPChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedInput = inputValue.replace(/\D/g, "").slice(0, 6);
    setTwoFactorOTP(sanitizedInput);
  };

  const handleGoogleAuth = (responseData) => {
    const responseObject = {
      authType: "google",
      response: responseData,
      twoFactorMethod: "google",
      status: responseData?.email_verified,
    };

    dispatch(
      googleloginValidation({
        data: responseObject,
        callback: (data) => {
          if (data) {
            setTwoFactorOTP("");
            props.toggler();
          }
        },
      })
    );
  };

  const handleAppAuth = () => {
    setLoading(true);
    if (twoFactorOTP?.length === 6) {
      const responseObject = {
        authType: "app",
        OTPValue: twoFactorOTP,
        twoFactorMethod: "app",
        status: true,
      };

      dispatch(
        googleloginValidation({
          data: responseObject,
          callback: (data) => {
            if (data) {
              setTwoFactorOTP("");
              toggleNewDataReceived();
              props.toggler();

              // dispatch(
              //   authDetail({
              //     data: responseObject,
              //     callback: (data) => {
              //       if (data) {
              //         setTwoFactorOTP("");
              //         setCurrentTFAmethod(data?.twoFactorMethod);
              //       }
              //     },
              //   })
              // );
            }
          },
        })
      );
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      notifyDanger("Code contain 6 digit");
    }
  };

  const handleGoogleAuthenticator = () => {
    if (twoFactorOTP?.length === 6) {
      // setError("");
      const responseObject = {
        authType: "GoogleAuthenticator",
        OTPValue: twoFactorOTP,
        twoFactorMethod: "GoogleAuthenticator",
        status: true,
        validateOTP: false,
        // secret: secret,
      };
      dispatch(
        googleAuthenticatorOTPValidation({
          data: responseObject,
          callback: (data) => {
            if (data) {
              setTwoFactorOTP("");
              if (data?.data?.data === true) {
                props.toggler();
                toggleNewDataReceived();
              }
            }
          },
        })
      );
      return;
    } else {
      notifyDanger("Code contain 6 digit");
      return;
    }
  };

  const getQRCode = () => {
    dispatch(
      GenerateQRcode({
        callback: (data) => {
          setGoogleAuthQRcodeUrl(data.data.url);
          setSetUpKey(data.data.setupKey);
          setShowQRcode(true);
          // setLoading(false);
        },
      })
    );
  };

  const handleSelection = (method) => {
    setCurrentTFAmethod(method);
  };

  //IN THIS FUNCTION
  const handleDisable2FA = () => {
    setLoadingDisableing(true);
    if (currentTFAmethod === "" || currentTFAmethod === undefined) {
      notifyDanger("2FA method is already disabled");
      props.toggler();
    } else {
      const responseObject = {
        status: !currentTFAmethod,
      };
      dispatch(
        updateTwoFactorStatusAction({
          data: responseObject,
          callback: (data) => {
            if (data) {
              toggleNewDataReceived();
              setLoadingDisableing(false);
              props.toggler();
              // dispatch(
              //   authDetail({
              //     data: responseObject,
              //     callback: (data) => {
              //       if (data) {
              //         setCurrentTFAmethod(data?.twoFactorMethod);
              //         props.toggler();
              //       }
              //     },
              //   })
              // );
            }
          },
        })
      );
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(setUpKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(
      authDetail({
        callback: (data) => {
          if (data) {
            setTwoFactorOTP("");
            setCurrentTFAmethod(data?.twoFactorMethod);
          }
        },
      })
    );
  }, [newDataReceived]);

  return (
    <Modal
      show={props.isOpen}
      onHide={props.toggler}
      size="xl"
    // dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>

        <div className="ml-auto">
          {loadingDisableing ? (
            <button className="btn btn-outline-warning m-1">
              Disabling 2FA ...
            </button>
          ) : (
            <button
              className="btn btn-outline-warning m-1"
              onClick={handleDisable2FA}
            >
              Disable 2FA
            </button>
          )}
        </div>
      </Modal.Header>

      <Modal.Body className={props.bodyClass} style={{ padding: "10px" }}>
        <div className="row">
          <div
            className="col-md-4"
            onClick={() => handleSelection("googleAuthenticator")}
          >
            <div
              className={`${currentTFAmethod === "googleAuthenticator"
                  ? "border-3 border-primary rounded-4"
                  : ""
                } pointer container p-3 border rounded h-100 d-flex flex-column justify-content-between`}
            >
              {currentTFAmethod === "googleAuthenticator" && (
                <div className="ml-auto d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle ml-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM7.5 10.793l-2.647-2.647a.5.5 0 1 1 .707-.707l2.095 2.095 4.385-4.385a.5.5 0 0 1 .707.707l-4.892 4.892a.5.5 0 0 1-.708 0z"
                    />
                  </svg>
                </div>
              )}
              <h6 className="text-center text-uppercase">
                {t("GOOGLE AUTHENTICATOR")}
              </h6>
              <div className="text-center mb-3">
                <Image
                  className="img-fluid"
                  src={`${showQRcode ? googleAuthQRcodeUrl : GoogleAuthenticatorLogo
                    }`}
                  alt="Your Image"
                  style={{ maxWidth: "100%", height: "150px" }}
                />
              </div>
              <p className="text-center">
                google Authenticator requires you to verify OTP when you Turn ON
                This.
              </p>

              {showQRcode ? (
                <>
                  {currentTFAmethod === "googleAuthenticator" && (
                    <div className="text-center">
                      <input
                        value={twoFactorOTP}
                        className="form-control mb-3"
                        placeholder="Enter OTP"
                        maxLength={6}
                        onChange={handleOTPChange}
                      />

                      <input
                        id="website-url"
                        type="text"
                        className="form-control bg-gray-50 border border-gray-300 text-gray-500 dark:text-gray-400 text-sm border-l-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={setUpKey}
                        readOnly
                        disabled
                      />
                      {/* <button
      onClick={handleCopy}
      className="btn btn-primary py-3 px-4 text-sm font-medium text-center rounded-r-lg hover:bg-dark-800"
      type="button"
    >
      <span className={isCopied ? 'hidden' : 'inline-block'}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      <span className={isCopied ? 'inline-block' : 'hidden'}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </button>
  </div>
</div> */}

                      {loading ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-dark mt-3"
                            disabled={true}
                          >
                            Verifing...
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleGoogleAuthenticator}
                          type="button"
                          className="btn btn-outline-dark mt-3"
                        >
                          {/* {currentTFAmethod === "googleAuthenticator"
                      ? "Verifed"
                      : "Verify"} */}
                          Continue with Google Authenticator
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button className="btn btn-outline-dark" onClick={getQRCode}>
                    Show QR Code
                  </button>

                  <div className="d-flex justify-content-start">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US&pli=1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="d-flex">
                        <button className="btn border border-secondary border-1 hover:border-dark m-1">
                          <img
                            src={AndroidIcon}
                            height="30px"
                            style={{ background: "transparent" }}
                            width="30px"
                            alt="Android"
                          />
                          Android App
                        </button>
                      </div>
                    </a>

                    <a
                      href="https://apps.apple.com/in/app/google-authenticator/id388497605"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="d-flex text-center justify-content-center">
                        <button className="btn border border-secondary border-1 hover:border-dark m-1">
                          <img
                            src={AppleIcon}
                            height="30px"
                            className="mr-2"
                            style={{ background: "transparent" }}
                            width="30px"
                            alt="Android"
                          />
                          IOS
                        </button>
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="col-md-4" onClick={() => handleSelection("app")}>
            <div
              className={`${currentTFAmethod === "app"
                  ? "border-3 border-primary rounded-4"
                  : ""
                } pointer container p-3 border rounded h-100 d-flex flex-column justify-content-between`}
            >
              {currentTFAmethod === "app" && (
                <div className="ml-auto d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle ml-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM7.5 10.793l-2.647-2.647a.5.5 0 1 1 .707-.707l2.095 2.095 4.385-4.385a.5.5 0 0 1 .707.707l-4.892 4.892a.5.5 0 0 1-.708 0z"
                    />
                  </svg>
                </div>
              )}
              <h6 className="text-center text-uppercase">
                {t("Betxfair APP AUTHENTICATION")}
              </h6>
              <div className="text-center mb-3">
                <img
                  src="https://art-u1.infcdn.net/articles_uploads/3/3635/Authenticat.png"
                  alt="logo"
                  style={{ maxWidth: "100%", height: "150px" }}
                />
              </div>

              <div className="d-flex ">
                <p className="text-left ">
                  Betxfair APP requires you to verify OTP when you Turn ON This.
                </p>
                <DownloadButton />
              </div>

              {currentTFAmethod === "app" && (
                <div className="text-center">
                  <input
                    value={twoFactorOTP}
                    className="form-control mb-3"
                    placeholder="Enter OTP"
                    maxLength={6}
                    onChange={handleOTPChange}
                  />
                  {/* Verify button */}
                  {loading ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        disabled={true}
                      >
                        Verifing...
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAppAuth}
                      type="button"
                      className="btn btn-outline-dark"
                    >
                      {/* {currentTFAmethod === "app" ? "Verifed" : "Verify"} */}
                      Verify
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            style={{ height: "40vh" }}
            className="col-md-4 mb-3"
            onClick={() => handleSelection("google")}
          >
            <div
              className={`${currentTFAmethod === "google"
                  ? "border-3 border-primary rounded-4"
                  : ""
                } pointer container p-3 border rounded h-100 d-flex flex-column justify-content-between`}
            >
              {currentTFAmethod === "google" && (
                <div className="ml-auto d-flex align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle ml-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM7.5 10.793l-2.647-2.647a.5.5 0 1 1 .707-.707l2.095 2.095 4.385-4.385a.5.5 0 0 1 .707.707l-4.892 4.892a.5.5 0 0 1-.708 0z"
                    />
                  </svg>
                </div>
              )}

              <h6 className="text-center text-uppercase">
                {t("GOOGLE LOGIN")}
              </h6>

              <div className="text-center mb-3">
                <img
                  src={googleAuthLogo}
                  alt="Your Image"
                  style={{ maxWidth: "100%", height: "150px" }}
                />
              </div>
              <p className="text-center">
                Google requires you to sign in with your Google account.
              </p>

              <div className="google-login-wrapper">
                <Googlelogin callbackData={handleGoogleAuth} />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default TfaModal;
