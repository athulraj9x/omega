import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Hindi, English, Español, Arabic, Urdu } from "../../../Constant";
import { useDispatch } from "react-redux";
import { getCurrency, globalCurrencyValue } from "../../../redux/action";
import { useSelector } from "react-redux";
import currencySymbolMap from "currency-symbol-map";

const CurrencyChange = () => {
  const [currencydropdown, setCurrencydropdown] = useState(false);
  const currencyData = useSelector((state) => state?.GetCurrency?.currencyData);
  const adminData = useSelector((state) => state.Login.userData);
  // const defaultCurrency = currencyData?.find(
  //   (element) => element?.code === "INR"
  // );
  // Find INR currency
  // const dispatch = useDispatch();
  const [selectedCurrencyValue] = useState(
    adminData?.currencyId ? adminData?.currencyId?.value : "1"
  );

  const [selected] = useState(
    adminData?.currecyId ? adminData?.currencyId?.code : "INR"
  );
  // const { i18n } = useTranslation();

  // useEffect(() => {
  //   dispatch(globalCurrencyValue({ data: selectedCurrencyValue }));
  // }, [selectedCurrencyValue, dispatch]);

  // const currencyValue = useSelector(
  //   (state) => state?.globalCurrencyValueReducer?.globalCurrencyValue
  // );

  // useEffect(() => {
  //   if (defaultCurrency) {
  //     i18n.changeLanguage(defaultCurrency?.code);
  //     dispatch(globalCurrencyValue({ data: defaultCurrency?.value }));
  //   }
  // }, [defaultCurrency, dispatch, i18n]);

  // const changeCurrency = (crry, value) => {
  //   i18n.changeLanguage(crry);
  //   setSelected(crry);
  //   setSelectedCurrencyValue(value); // Store the selected currency value
  // };

  // const CurrencySelection = (currency) => {
  //   if (currency) {
  //     setCurrencydropdown(!currency);
  //   } else {
  //     setCurrencydropdown(!currency);
  //   }
  // };

  // useEffect(() => {
  //   dispatch(getCurrency());
  // }, []);

  // if (!currencyData) {
  //   return null; // Return loading state or placeholder if currencyData is not available
  // }

  return (
    <li className="language-nav rounded border bg-white">
      <div className={`translate_wrapper ${currencydropdown ? "active" : ""}`}>
        <div className="current_lang">
          <div
            className="lang d-flex align-items-center"
            // onClick={() => CurrencySelection(currencydropdown)}
          >
            <span className="lang-txt m-0">
              {selected} - {currencySymbolMap(selected)} {selectedCurrencyValue}
            </span>
            {/* Use currencySymbolMap(selected) to get the currency symbol */}
          </div>
        </div>
        <div className={`more_lang ${currencydropdown ? "active" : ""}`}>
          {currencyData?.map((element, index) => {
            return (
              <div
                key={index}
                className="lang"
                // onClick={() => {
                //   changeCurrency(element?.code, element?.value);
                //   setCurrencydropdown(false);
                // }}
              >
                <span className="lang-txt m-0">
                  {element?.code} - {currencySymbolMap(element?.code)}{" "}
                  {element?.value}
                  {/* Use currencySymbolMap(element?.code) to get the currency symbol */}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </li>
  );
};

export default CurrencyChange;
