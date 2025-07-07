module.exports = {
  AppName: "Omega",
  forgotTemplate: "forgotPassword",
  userEmailVerification: "userEmailVerification",
  resendOtp: "resendOtp",

  makeRandomNumberWithLetter: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  makeRandomNumber: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  makeRandomOTPNumber: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  checkNumberType: (value) => {
    if (Number.isInteger(value)) {
      return true; //integer
    } else if (typeof value === "number" && !Number.isInteger(value)) {
      return false; //float
    } else {
      return false; //NaN
    }
  },

  toUpperCase: (str) => {
    if (str.length > 0) {
      const newStr = str
        .toLowerCase()
        .replace(/_([a-z])/, (m) => m.toUpperCase())
        .replace(/_/, "");
      return str.charAt(0).toUpperCase() + newStr.slice(1);
    }
    return "";
  },

  validationMessageKey: (apiTag, error) => {
    let key = module.exports.toUpperCase(error.details[0].context.key);
    let type = error.details[0].type.split(".");
    type = module.exports.toUpperCase(type[1]);
    key = apiTag + key + type;
    return key;
  },

  generateUniqueSessionId: () => {
    return Math.random().toString(36).substring(2, 15); // Example session ID generation
  },

  resolveAvatarUrl: (userData) => {
    return userData?.google_pic
      ? mediaUrlForS3(`${PROFILE_PIC}`, userData._id, userData.google_pic)
      : userData?.profile_pic
        ? mediaUrlForS3(`${PROFILE_PIC}`, userData._id, userData.profile_pic)
        : "";
  },

  validateObjectIds: (ids) => {
    const idList = Array.isArray(ids) ? ids : [ids];

    const validIds = [];
    const invalidIds = [];

    for (const id of idList) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        validIds.push(id);
      } else {
        invalidIds.push(id);
      }
    }

    return {
      validIds,
      invalidIds,
      allValid: invalidIds.length === 0,
    };
  },
};
