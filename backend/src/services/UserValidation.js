const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");
const { GAME_TYPE } = require("./Constants");

module.exports = {

  loginValidation: (req, res, callback) => {
    const schema = Joi.object({
      device_code: Joi.string().trim().optional(),
      email: Joi.string().trim().optional(),
      password: Joi.string().trim().optional(),
      login_type: Joi.string().trim().optional(),
      google_id_token: Joi.string().trim().optional(),
      mobile_no: Joi.number().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log({ error })
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("loginValidation", error))
      );
    }
    return callback(true);
  },

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

  resetPassValidation: (req, res, callback) => {
    const schema = Joi.object({
      email: Joi.string()
        .pattern(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/)
        .required(),
      otp: Joi.string().trim().required(),
      password: Joi.string()
        .trim()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'))
        .required(), //.regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userOtpValidation", error))
      );
    }
    return callback(true);
  },
  resendEmailValidation: (req, res, callback) => {
    const schema = Joi.object({
      email: Joi.string().email().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("resendEmailValidation", error))
      );
    }
    return callback(true);
  },

  logoutValidation: (req, res, callback) => {
    const schema = Joi.object({
      username: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("logoutValidation", error))
      );
    }
    return callback(true);
  },

  userRegisterValidation: (req, res, callback) => {
    const schema = Joi.object({
      first_name: Joi.string().trim().required(),
      last_name: Joi.string().trim().required(),
      username: Joi.string().trim().required(),
      password: Joi.string().trim()
        // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'))
        .required(),
      email: Joi.string().email().trim().required(),
      mobile_no: Joi.string().trim().max(15).required(),
      device_code: Joi.string().trim().required(),
      currency_code: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log({ error })
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userRegisterValidation", error))
      );
    }
    return callback(true);
  },

  verifyEmailValidation: (req, res, callback) => {
    const schema = Joi.object({
      email: Joi.string().email().trim().required(),
      otp: Joi.string().trim().max(4).required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("verifyEmailValidation", error))
      );
    }
    return callback(true);
  },

  userNameValidation: (req, res, callback) => {
    const schema = Joi.object({
      username: Joi.string().trim().required()
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userNameValidation", error))
      );
    }
    return callback(true);
  },
  userDetailValidation: (req, res, callback) => {
    const schema = Joi.object({
      user_id: Joi.string().trim().required()
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userDetailValidation", error))
      );
    }
    return callback(true);
  },
};
