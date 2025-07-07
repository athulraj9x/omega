const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");
const Constants = require("../services/Constants");

module.exports = {
  /**
   * @description This function is used to validate Admin Login fields.
   * @param req
   * @param res
   */
  loginValidation: (req, res, callback) => {
    const schema = Joi.object({
      username: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate Admin Login fields.
   * @param req
   * @param res
   */
  TwoFactorLoginValidation: (req, res, callback) => {
    const schema = Joi.object({
      username: Joi.string().trim().required(),
      passcode: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate Admin Login fields.
   * @param req
   * @param res
   */
  TwoFactorOTPValidation: (req, res, callback) => {
    const schema = Joi.object({
      OTPValue: Joi.string().max(6).required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },

  TwoFactorChangePasscodeValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      passcode: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate Admin Login fields.
   * @param req
   * @param res
   */
  RegenerateTwoFactorCodeVerification: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate forget password fields.
   * @param req
   * @param res
   */
  forgotPasswordValidation: (req, res, callback) => {
    const schema = Joi.object({
      email: Joi.string().email().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("forgotPasswordValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate reset password fields.
   * @param req
   * @param res
   */
  resetPasswordValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      resetPassword: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("resetPasswordValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate change password fields.
   * @param req
   * @param res
   */
  changePasswordValidation: (req, res, callback) => {
    const schema = Joi.object({
      old_password: Joi.string().trim().required(),
      password: Joi.string()
        .trim()
        .min(6)
        .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/)
        .required(),
      confirm_password: Joi.string()
        .trim()
        .min(6)
        .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/)
        .required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("changePasswordValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate logout and block fields.
   * @param req
   * @param res
   */
  logoutAndBlockValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      action_type: Joi.string().valid("logout", "block").required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("logoutAndBlockValidation", error))
      );
    }
    return callback(true);
  },
};
