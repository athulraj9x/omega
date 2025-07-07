const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");

module.exports = {
  currencyValidation: (req, res, callback) => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
      code: Joi.string().trim().required(),
      value: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("currencyValidation", error))
      );
    }
    return callback(true);
  },

  currencyupdateValidation: (req, res, callback) => {
    const schema = Joi.object({
      _id: Joi.string().trim().required(),
      name: Joi.string().trim().required(),
      code: Joi.string().trim().required(),
      value: Joi.number().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateCurrencyValidation", error))
      );
    }
    return callback(true);
  },
};
