import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TWO_FACTOR_OTP_TIMER } from "../../../utils/constants";
import "./style.css";
import { MdOutlineClose } from "react-icons/md";

const TwoAuth = (props) => {
  const loading = useSelector((state) => state?.TwoFactorStatusReducer.loading);
  const [seconds, setSeconds] = useState(60);
  const [twoFactorOTP, setTwoFactorOTP] = useState("");
  const [error, setError] = useState("");

  const handleOTPChange = (e) => {
    const inputValue = e.target.value;
    // ONLY ALLOW NUMERIC INPUT AND LIMIT TO 6 CHARACTERS
    const sanitizedInput = inputValue.replace(/\D/g, "").slice(0, 6);
    setTwoFactorOTP(sanitizedInput);
  };
  const callbackValue = (e) => {
    e.preventDefault();
    if (twoFactorOTP.length === 6) {
      setError("");
      props.callbackValue(twoFactorOTP);
    } else {
      setError("OTP Must contain 6 Digit");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timer);
          props.onTimeout();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [props.onTimeout]);
  return (


<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">
  <div className="fixed z-50 inset-0 bg-modalBackgroundBlur bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
    <div className="relative bg-modalBackground p-5 rounded-xl w-96">
      <button
        className="absolute top-4 right-3"
        type="button"
        onClick={props.closeTwoFactorAuth}
      >
        <MdOutlineClose className="text-primary text-3xl font-bold" />
      </button>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <img
                className="dark-mode w-75 mb-3 rounded avatar-lg img-thumbnail mb-4"
                style={{ width: "12rem", marginTop: "-6px" }}
                src={props.iconLight}
                alt="Logo"
              />
              <h2 className="text-info text-center">2FA Security</h2>
              <p className="text-center mb-4">
                Enter 6-digit code from your number.
              </p>
              <form onSubmit={callbackValue}>
                {/* <div className="timer">{seconds}</div> */}

                {/* THIS IS FOR ANIMATION TIMER BELOW 2F AUTHENTICATION */}
                {/* <div className="loadingspinner">
                  <div id="square1"></div>
                  <div id="square2"></div>
                  <div id="square3"></div>
                  <div id="square4"></div>
                  <div id="square5"></div>
                </div> */}
                {/* THIS IS FOR ANIMATION TIMER BELOW 2F AUTHENTICATION */}

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control text-lg text-center text-dark border border-gray-300 rounded py-2 px-4 block w-full"
                    maxLength={6}
                    pattern="[0-9]*"
                    title="Please enter only numeric characters"
                    placeholder="Enter OTP"
                    value={twoFactorOTP}
                    onChange={handleOTPChange}
                    required
                  />
                  {error && (
                    <p className="text-lg text-center text-red-500">{error}</p>
                  )}
                </div>
                {loading ? (
                  <div className="text-center">
                    <button disabled className="bg-skin-loginBtn text-skin-textPrimaryColor p-2 rounded-lg">
                      Processing...
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button type="submit" className="bg-skin-loginBtn text-skin-textPrimaryColor p-2 rounded-lg">
                      Continue
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>






  );
};

export default TwoAuth;
