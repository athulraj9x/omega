import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import PropTypes from "prop-types";
import Routers from "./Route";
import CustomizerProvider from "./_helper/Customizer/CustomizerProvider";
import store from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import WhiteLabel from "./context/whiteLabelContext";
import { socket } from "./context/socketContext";
import { playNotificationSound } from "./utils/helper";

const CloseButton = ({ closeToast }) => (
  <i
    className="fa fa-times-circle align-self-center f-18"
    onClick={closeToast}
  />
);
CloseButton.propTypes = {
  closeToast: PropTypes.func,
};

const App = () => {
  useEffect(() => {
    clearListCookies();
  }, []);

  function clearListCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var spcook = cookies[i].split("=");
      deleteCookie(spcook[0]);
    }

    function deleteCookie(cookiename) {
      var d = new Date();
      d.setTime(d.getTime() - 1);
      var expires = "expires=" + d.toUTCString();
      var name = cookiename;
      document.cookie = name + "=; " + expires + "; path=/";
    }
  }

  // HANDLE CONTEXT MENU DISABLING FUNCTION
  // THIS FUNCTION WILL DISABLE RIGHT CLICK AND ALL THE KEYS RELATED TO CONTEXT MENU
  const handleContextMenu = (e) => {
    e.preventDefault();
  };


  return (
    <div className="App" onContextMenu={handleContextMenu}>
      <GoogleOAuthProvider clientId="948940810866-db1ricgtepnoiot1mnh0oia3b2luirmn.apps.googleusercontent.com">
        <CustomizerProvider>
          <Provider store={store}>
            <WhiteLabel>
              <Routers />
            </WhiteLabel>
          </Provider>
        </CustomizerProvider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
