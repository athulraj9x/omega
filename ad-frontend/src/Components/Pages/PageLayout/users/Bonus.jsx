import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BsCheckLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { GrFormClose } from "react-icons/gr";
import { useRef } from "react";
import { addCreditReference, updateBonus } from "../../../../redux/action";
import {
  convertINRToCurrency,
  convertToINR,
  notifyWarning,
} from "../../../../utils/helper";
import { useSelector } from "react-redux";
import { CurrencyConversionRoles } from "../../../../Constant";

const Bonus = ({
  defaultValue,
  userId,
  inactive,
  fetchDefaultLayers,
  fetchInactiveLayers,
  adminBalance,
  currency,
}) => {
  const adminData = useSelector((state) => state.Login.userData);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("0.00");
  const [originalValue, setOriginalValue] = useState("0.00");
  const [isCheckVisible, setIsCheckVisible] = useState(false);
  const [convertedDefaultValue, setConvertedDefaultValue] = useState(0);
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const handleButtonClick = () => {
    setIsEditing(!isEditing);
    setIsCheckVisible(!isCheckVisible);
    if (!isEditing) {
      setOriginalValue(value); // Store the original value when editing starts
    }
  };

  const handleInputChange = (event) => {
    const val = Number(event.target.value);
    setValue(val);
  };

  useEffect(() => {
    let val;
    // val = convertINRToCurrency(
    //   defaultValue,
    //   parseFloat(adminData?.currencyId?.value),
    //   true
    // );
    val = defaultValue;
    if (currency) {
      // val = convertINRToCurrency(val, parseFloat(currency?.value?.value));
      val = val;
    }
    setConvertedDefaultValue(val);
    setValue(val);
  }, [defaultValue, currency]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (value !== convertedDefaultValue) {
      const data = {
        bonus: adminData.role < CurrencyConversionRoles ? convertToINR(
          value,
          parseFloat(adminData?.currencyId?.value)
        ) : value,
        user_id: userId,
      };
      if (data) {
        // setValue()
        dispatch(
          updateBonus({
            data,
            callback: () => {
              if (inactive) {
                fetchInactiveLayers();
              }
              else {
                fetchDefaultLayers();
              }
            },
          })
        );
        handleButtonClick();
      }
    } else {
      handleButtonClick();
    }
  };

  const handleClose = () => {
    setValue(convertedDefaultValue);
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div className="credit-reference d-flex align-items-center gap-3">
        <span className=" cursor-pointer fs-5 lh-1 m-0 p-1 " color="success">
          {isEditing ? (
            <>
              {value === convertedDefaultValue || value === "" ? (
                <BsCheckLg
                  className="align-text-top fs-5 pointer"
                  onClick={handleSubmit}
                />
              ) : (
                <BsCheckLg
                  className="align-text-top fs-5 pointer"
                  onClick={handleSubmit}
                />
              )}
            </>
          ) : (
            <CiEdit
              className="align-text-top fs-5 pointer"
              onClick={handleButtonClick}
            />
          )}
        </span>

        {isEditing ? (
          <input
            type="number"
            //defaultValue={value}
            value={value}
            onChange={handleInputChange}
            className="value fw-medium form-control px-2 shadow-none"
            style={{ width: "10rem" }}
            ref={inputRef}
          />
        ) : (
          <div className="value fw-medium">
            <span>
              {[null, undefined]?.includes(value) ? 0 : value?.toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
        {isEditing ? (
          <span className="cursor-pointer fs-5 lh-1 m-0 " color="success">
            <RxCross2
              className="align-text-top fs-5 pointer"
              onClick={handleClose}
            />
          </span>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Bonus;
