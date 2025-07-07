import React, { useLayoutEffect } from "react";
import { WhiteLabels } from "../utils/constants";
import { useSelector } from "react-redux";
export const WhiteLabelContext = React.createContext();
const WhiteLabel = ({ children }) => {
  const domain = window.location.origin;
  let WhiteLabelBrandName;
  const matchedWhiteLabel = WhiteLabels.find((WhiteLabels) => {
    return domain === WhiteLabels.domain;
  });
  if (matchedWhiteLabel) {
    WhiteLabelBrandName = matchedWhiteLabel.brandName;
  }
  useLayoutEffect(() => {
    if (WhiteLabelBrandName) {
      document.title = `${WhiteLabelBrandName} - Admin`;
    }
  }, [WhiteLabelBrandName]);


  return (
    <WhiteLabelContext.Provider value={{ domain, WhiteLabelBrandName }}>
      {children}
    </WhiteLabelContext.Provider>
  );
};
export default WhiteLabel;
