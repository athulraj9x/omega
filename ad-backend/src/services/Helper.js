const { default: axios } = require("axios");
module.exports = {
  AppName: "Omega",

  toUpperCase: (str) => {
    if (str?.length > 0) {
      const newStr = str
        .toLowerCase()
        .replace(/_([a-z])/, (m) => m.toUpperCase())
        .replace(/_/, "");
      return str.charAt(0).toUpperCase() + newStr.slice(1);
    }
    return "";
  },
}
