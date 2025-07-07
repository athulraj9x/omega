import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Hindi, English, Español, Arabic, Urdu } from "../../../Constant";

const Language = () => {
  const [langdropdown, setLangdropdown] = useState(false);
  const [selected, setSelected] = useState("en");
  const { i18n } = useTranslation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    i18n.changeLanguage(selected);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    event.stopPropagation();
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setLangdropdown(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelected(lng);
  };

  const LanguageSelection = (language) => {
    if (language) {
      setLangdropdown(!language);
    } else {
      setLangdropdown(!language);
    }
  };

  return (
    <li
      ref={dropdownRef}
      className="language-nav rounded"
      style={{ border: "1px solid #EEE" }}
    >
      <div className={`translate_wrapper ${langdropdown ? "active" : ""}`}>
        <div className="current_lang">
          <div className="lang" onClick={() => LanguageSelection(langdropdown)}>
            <i
              className={`flag-icon flag-icon-${
                selected === "en" ? "us" : selected === "es" ? "es" : selected
              }`}
            ></i>
            <span className="lang-txt">
              {selected === "af"
                ? "یو آر"
                : selected === "ae"
                ? "عبد اللطيف"
                : selected}
            </span>
            {/* <span className="lang-txt">
              {selected === "ae" ? "عبد اللطيف" : selected}
            </span> */}
          </div>
        </div>
        <div className={`more_lang ${langdropdown ? "active" : ""}`}>
          <div
            className="lang"
            onClick={() => {
              changeLanguage("en");
              setLangdropdown(false);
            }}
          >
            <i className="flag-icon flag-icon-us"></i>
            <span className="lang-txt">
              {English}
              <span> {"(US)"}</span>
            </span>
          </div>
          <div
            className="lang"
            onClick={() => {
              changeLanguage("in");
              setLangdropdown(false);
            }}
          >
            <i className="flag-icon flag-icon-in"></i>
            <span className="lang-txt">
              {Hindi}
              <span> {"(IN)"}</span>
            </span>
          </div>
          <div
            className="lang"
            onClick={() => {
              changeLanguage("es");
              setLangdropdown(false);
            }}
          >
            <i className="flag-icon flag-icon-es"></i>
            <span className="lang-txt">
              {Español}
              <span> {"(ES)"}</span>
            </span>
          </div>
          <div
            className="lang"
            onClick={() => {
              changeLanguage("ae");
              setLangdropdown(false);
            }}
          >
            <i className="flag-icon flag-icon-ae"></i>
            <span className="lang-txt">
              {Arabic}
              <span> {"(AE)"}</span>
            </span>
          </div>
          <div
            className="lang"
            onClick={() => {
              changeLanguage("pk");
              setLangdropdown(false);
            }}
          >
            <i className="flag-icon flag-icon-pk"></i>
            <span className="lang-txt">
              {Urdu}
              <span> {"(PK)"}</span>
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Language;
