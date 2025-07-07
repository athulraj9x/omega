import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../assets/images/dashboard/profile.png";

import { LI, UL, Image, P } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";
import { Account, Admin, Inbox, LogOut, Taskboard } from "../../../Constant";
import { loginHistory, logout } from "../../../redux/action";
import { capitalizeFirstLetter } from "../../../utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PasswordChangeModal from "../../../Components/Pages/PageLayout/modal/PasswordChangeModal";
import LoginHistoryModal from "../../../Components/Pages/PageLayout/modal/LoginHistoryModal";
import TfaModal from "../../../Components/Pages/PageLayout/modal/TfaModal";

const UserHeader = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState("");

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [loginHistoryModal, setLoginHistoryModal] = useState(false);
  const [twoFAModal, setTwoFAModal] = useState(false);

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };


  const [name, setName] = useState("Admin1");
  const [isDropdown, setIsDropdown] = useState(false);
  const { layoutURL } = useContext(CustomizerContext);
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
  const userData = useSelector((state) => state?.Login?.userData);
  const loginHistoryData = useSelector(
    (state) => state?.LoginHistory?.userHistory
  );

  useEffect(() => {
    setProfile(localStorage.getItem("profileURL") || man);
    setName(userData.name ? userData?.name : name);
    dispatch(loginHistory());
  }, [userData]);

  const Logout = () => {
    dispatch(logout())
   setTimeout(() => {
    localStorage.clear();
    history(`/login`);
    window.location.reload();
   }, 1000);
  };

  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  const handleTwoFA = () => {
    setTwoFAModal(!twoFAModal);
  }

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div
        // className="media profile-media"
        className="media profile-media"
        onClick={() => {
          setIsDropdown(!isDropdown);
        }}
      >
        <div className="media-body">
          <span>
            {authenticated
              ? capitalizeFirstLetter(auth0_profile.name)
              : capitalizeFirstLetter(name)}
          </span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {authenticated
              ? capitalizeFirstLetter(auth0_profile.name)
              : capitalizeFirstLetter(userData?.username)}{" "}
            <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      {isDropdown ? (
        <>
          <ul
            className="simple-list profile-dropdown "
            style={{
              position: "absolute",
              left: "-90px",
              padding: "0px",
              backgroundColor: "#FFF",
              transition: "all linear 0.3s",
              borderRadius: "5px",
              // border:"1px solid"
            }}
          >
            <LI
              attrLI={{
                onClick: () => {
                  handleChangePassword();
                },
              }}
            >
              <span>{t("CHANGE_PASSWORD")} </span>
            </LI>
            <LI
              attrLI={{
                onClick: () => {
                  setLoginHistoryModal(true);
                },
              }}
            >
              <span>{t("LOGIN_HISTORY")}</span>
            </LI>
            <LI
              attrLI={{onClick:() =>{
                setTwoFAModal(true)
              }}}
            >
              <span>{t("2FA Authentication")}</span>
            </LI>

            <LI attrLI={{ onClick: Logout }}>
              <span>{t("LOGOUT")}</span>
            </LI>
          </ul>
        </>
      ) : null}
      {changePasswordModal && (
        <PasswordChangeModal
          isOpen={changePasswordModal}
          title={t("CHANGE_MY_PASSWORD")}
          toggler={setChangePasswordModal}
          size="md"
          currentPassword={t("CURRENT_PASSWORD")}
          newPassword={t("NEW_PASSWORD")}
          confirmPassword={t("CONFIRM_PASSWORD")}
        />
      )}

      {loginHistoryModal && (
        <LoginHistoryModal
          isOpen={loginHistoryModal}
          title={t("LOGIN_HISTORY")}
          toggler={setLoginHistoryModal}
          size="lg"
          pagination={true}
          modalData={loginHistoryData?.loginDetails}
        />
      )}
    
      {twoFAModal && (
        <TfaModal
          isOpen={twoFAModal}
          title={t("2FA Authentication")}
          toggler={handleTwoFA}
          size="lg"
          pagination={true}
          // modalData={loginHistoryData?.loginDetails}
          />
      )}
    </li>
  );
};

export default UserHeader;
