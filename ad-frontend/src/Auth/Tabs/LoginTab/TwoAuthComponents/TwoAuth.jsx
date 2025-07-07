import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TWO_FACTOR_OTP_TIMER } from "../../../../utils/constants";
import "./style.css";
const TwoAuth = (props) => {
  const loading = useSelector((state) => state?.TwoFactorAuthencation.loading);
  const [twoFactorOTP, setTwoFactorOTP] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(TWO_FACTOR_OTP_TIMER);

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
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 my-auto">
          <div className="card">
            <div className="card-body px-lg-5 py-lg-5 text-center">
              <img
                className="dark-mode w-75 mb-3 rounded avatar-lg img-thumbnail mb-4"
                style={{ width: "12rem", marginTop: "-6px" }}
                src={props.iconLight}
                alt="Logo"
              />
              <h2 className="text-info">2FA Security</h2>
              <p className="mb-1">
                Enter 6-digit code from your authenticator app.
              </p>
              <form onSubmit={callbackValue}>
                <div className="timer">{seconds}</div>

                {/* THIS IS FOR ANIMATION TIMER BELOW 2F AUTHENTICATION */}
                <div class="loadingspinner">
                  <div id="square1"></div>
                  <div id="square2"></div>
                  <div id="square3"></div>
                  <div id="square4"></div>
                  <div id="square5"></div>
                </div>
                {/* THIS IS FOR ANIMATION TIMER BELOW 2F AUTHENTICATION */}

                <div className="row mb-1">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control text-lg text-center text-dark"
                      maxLength={6}
                      pattern="[0-9]*"
                      title="Please enter only numeric characters"
                      placeholder="Enter OTP"
                      value={twoFactorOTP}
                      onChange={handleOTPChange}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-lg text-center text-danger">{error}</p>
                  )}
                </div>
                {loading ? (
                  <div className="text-center">
                    <button disabled className="btn bg-info btn-lg my-4">
                      Processing...
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button type="submit" className="btn bg-info btn-lg my-4">
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
  );
};

export default TwoAuth;
