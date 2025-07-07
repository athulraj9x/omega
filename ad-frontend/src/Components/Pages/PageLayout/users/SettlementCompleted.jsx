import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clientSettilementCompleteUpdation } from "../../../../redux/action";

const SettlementCompleted = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [showInputBox, setShowInputBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showClientSettlementButton, setshowClientSettlementButton] =
    useState(true);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  const clientSettlementCompleted = () => {
    setShowInputBox(true);
    setshowClientSettlementButton(false);
  };

  const handleSubmit = () => {
    if (password.trim() === "") {
      alert("Password cannot be empty");
      return;
    }

    const data = { password };

    try {
      dispatch(
        clientSettilementCompleteUpdation({
          data,
          callback: (data) => {
            if (data.meta.code === 200) {
              setshowClientSettlementButton(true);
              setShowInputBox(false);
              setPassword("");
              setIsPasswordIncorrect(false); 
            } else if (data.meta.code === 401) {

              setIsPasswordIncorrect(true);
            }
          },
        })
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleCancel = () => {
    setshowClientSettlementButton(true);
    setShowInputBox(false);
    setPassword("");
    setIsPasswordIncorrect(false);
  };

  return (
    <div className="m-1 mt-0">
      {showClientSettlementButton && (
        <button
          className="btn btn-outline-danger d-flex align-items-center gap-1 justify-content-center mx-2 relative"
          onClick={clientSettlementCompleted}
        >
          Settlement Completed
        </button>
      )}

      {showInputBox && (
        <div className="m-0">
          <div className="input-group mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className={`form-control ${isPasswordIncorrect ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordIncorrect(false); // Reset error state on input change
              }}
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {isPasswordIncorrect && (
            <div className="text-danger mb-2">Incorrect password. Please try again.</div>
          )}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlementCompleted;
