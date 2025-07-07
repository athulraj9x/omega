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
      white_label_id: Joi.alternatives().try(Joi.string().trim(), Joi.array().items(Joi.string().trim())).optional(),
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
  /**
   * @description This function is used to validate request from mobile.
   * @param req
   * @param res
   */
  MobileGetLatestDataValidation: (req, res, callback) => {
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

  /**
   * @description This function is used to validate layers fields.
   * @param req
   * @param res
   */
  layerValidation: (req, res, callback) => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
      username: Joi.string().trim().required(),
      groupname: Joi.string().trim().allow("").optional(),
      password: Joi.string()
        .trim()
        .min(6)
        .regex(/^(?=.*[A-Z])[a-zA-Z0-9@$!%*?&]{6,}$/)
        .required(),
      email: Joi.string().email().allow("").trim().optional(),
      mobileNo: Joi.string().allow("").optional(),
      role: Joi.number().valid(2, 3, 4, 5, 6, 7).required(), //1- director, 2- super admin, 3- admin, 4- super master, 5- master, 6- agent, 7- user,
      creditReference: Joi.string().required(),
      balance: Joi.string().optional().allow(""),
      currencyId: Joi.string(),
      sportShares: Joi.number().optional(),
      commissionPercentage: Joi.number(),
      casino: Joi.array().optional().allow(""),
      exposureLimit: Joi.number().optional(),
      commission: Joi.number().required(),
      session_commission: Joi.number().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("layerValidation", error)));
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate user layers fields.
   * @param req
   * @param res
   */
  userlayerValidation: (req, res, callback) => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
      username: Joi.string().trim().required(),
      groupname: Joi.string().trim().allow("").optional(),
      password: Joi.string().trim().required(),
      email: Joi.string().email().allow("").trim().optional(),
      mobileNo: Joi.string().allow("").optional(),
      currencyId: Joi.string(),
      balance: Joi.string().optional().allow(""),
      // casino: Joi.array().optional(),
      casino: Joi.alternatives()
        .try(
          Joi.string().allow(""), // String when empty
          Joi.array() // Array when not empty
        )
        .optional(),
      creditReference: Joi.number().required(),
      sportShares: Joi.string().allow("").optional(),
      commissionPercentage: Joi.number(),
      role: Joi.number().valid(7).required(), // 7- user
      commission: Joi.number().required(),
      whiteLabelType: Joi.string().allow().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userlayerValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate exchange fields.
   * @param req
   * @param res
   */
  exchangeValidation: (req, res, callback) => {
    // const schema = Joi.object({
    //   sports_name: Joi.string().trim().required(),
    //   sports_slugName: Joi.string().trim().required(),
    //   sports_code: Joi.string().trim().required(),

    //   league_name: Joi.string().trim().required(),
    //   league_slugName: Joi.string().trim().required(),
    //   league_code: Joi.string().trim().required(),

    //   event: Joi.array().items({
    //     events_name: Joi.string().trim().required(),
    //     events_slugName: Joi.string().trim().required(),
    //     events_code: Joi.string().trim().required(),
    //     events_eventDate: Joi.string().trim().required(),
    //     markets: Joi.array().items({
    //       markets_name: Joi.string().trim().required(),
    //       markets_slugName: Joi.string().trim().required(),
    //       markets_code: Joi.string().trim().required(),
    //       markets_type: Joi.string().trim().optional(),
    //       runners: Joi.array().items({
    //         runner_name: Joi.string().trim().required(),
    //         runner_code: Joi.string().trim().required(),
    //       }),
    //     }),
    //   }),
    // });
    const schema = Joi.object({
      sports_name: Joi.string().trim().required(),
      sports_slugName: Joi.string().trim().required(),
      sports_code: Joi.string().trim().required(),
      league_name: Joi.string().trim().required(),
      league_slugName: Joi.string().trim().required(),
      league_code: Joi.string().trim().required(),
      events: Joi.array()
        .items({
          events_name: Joi.string().trim().required(),
          events_slugName: Joi.string().trim().required(),
          events_code: Joi.string().trim().required(),
          events_eventDate: Joi.string().trim().required(),
        })
        .optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("exchangeValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate race fields.
   * @param req
   * @param res
   */

  raceValidation: (req, res, callback) => {
    const schema = Joi.object({
      eventTypeId: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      venue: Joi.string().trim().required(),
      sports_name: Joi.string().trim().required(),
      sports_slugName: Joi.string().trim().required(),
      // timings: Joi.array()
      //   .items({
      //     from: Joi.string().trim().required(),
      //     to: Joi.string().trim().required(),
      //   })
      //   .optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("raceValidation", error)));
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate exchange fields.
   * @param req
   * @param res
   */
  sportValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string(),
      stakeSize: Joi.array().items({
        minExch: Joi.number(),
        maxExch: Joi.number(),
        minBookMaker: Joi.number(),
        maxBookMaker: Joi.number(),
        minFancy: Joi.number(),
        maxFancy: Joi.number(),
      }),
      betDelay: Joi.array().items({
        betExch: Joi.number(),
        betBookMaker: Joi.number(),
        betFancy: Joi.number(),
      }),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("exchangeValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate changeStatusEventManagement fields.
   * @param req
   * @param res
   */
  changeStatusEventManagementValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      type: Joi.number().valid(1, 2, 3, 4, 5).required(),
      delete: Joi.boolean().optional(),
      sportsCode: Joi.optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("changeStatusEventManagementValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate event results fields.
   * @param req
   * @param res
   */
  eventResultValidation: (req, res, callback) => {
    const schema = Joi.object({
      sportsId: Joi.string().trim().required(),
      leagueId: Joi.string().trim().required(),
      eventId: Joi.string().trim().required(),
      market_type: Joi.string().valid("exchange", "bookmaker", "fancy").required(),
      marketId: Joi.string().trim().required(),
      result: Joi.string().trim().required(),
      declared_by: Joi.string().valid("auto", "manual").optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("eventResultValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  rollbackValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      sportsId: Joi.string().trim().required(),
      leagueId: Joi.string().trim().required(),
      eventId: Joi.string().trim().required(),
      marketId: Joi.string().trim().required(),
      market_type: Joi.string().valid("exchange", "bookmaker", "fancy").required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("rollbackValidation", error))
      );
    }
    return callback(true);
  },
  horseRollbackValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      sportsId: Joi.string().trim().required(),
      countryId: Joi.string().trim().required(),
      eventId: Joi.string().trim().required(),
      marketId: Joi.string().trim().required(),
      market_type: Joi.string().valid("exchange", "bookmaker", "fancy").required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("rollbackValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate get bets and book validation fields.
   * @param req
   * @param res
   */
  getBetAndBooksValidation: (req, res, callback) => {
    const schema = Joi.object({
      eventId: Joi.string().trim().invalid("undefined").required(),
      del: Joi.boolean().required(),
      type: Joi.string().trim().required(),
      currencyId: Joi.string().trim().optional(),
      per_page: Joi.string().optional(),
      page: Joi.string().optional(),
      filterBetAmount: Joi.string().optional(),
      horse: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getBetAndBooksValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate get market analysis validation fields.
   * @param req
   * @param res
   */
  getMarketAnalysisDataValidation: (req, res, callback) => {
    const schema = Joi.object({
      sportId: Joi.string().trim().invalid("undefined").required(),
      leagueId: Joi.string().trim().invalid("undefined").required(),
      eventId: Joi.string().trim().invalid("undefined").required(),
      type: Joi.string().trim().allow(""),
      venueId: Joi.string().trim().optional(),
      horse: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getMarketAnalysisDataValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  getActiveFaniesOfEventValidation: (req, res, callback) => {
    const schema = Joi.object({
      event_id: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getActiveFaniesOfEventValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  getLineMarketBetsValidation: (req, res, callback) => {
    const schema = Joi.object({
      eventId: Joi.string().trim().required(),
      filterBetAmount: Joi.string().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getLineMarketBetsValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  getBetsOfRunningMarketValidation: (req, res, callback) => {
    const schema = Joi.object({
      currencyId: Joi.string().trim().optional(),
      eventId: Joi.string().trim().invalid("undefined").required(),
      type: Joi.string().trim().required(),
      del: Joi.boolean().required(),
      per_page: Joi.string().trim().required(),
      page: Joi.string().trim().required(),
      filterBetAmount: Joi.string().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getBetsOfRunningMarketValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  getViewBetsOfRunningMarketValidation: (req, res, callback) => {
    const schema = Joi.object({
      eventId: Joi.string().trim().invalid("undefined").required(),
      marketId: Joi.string().trim().allow("").optional(),
      username: Joi.string().trim().required(),
      isMultiple: Joi.boolean().required(),
      currencyId: Joi.string().trim().optional(),
      type: Joi.string().trim().allow("").required(),
      del: Joi.boolean().required(),
      per_page: Joi.string().trim().required(),
      page: Joi.string().trim().required(),
      filterBetAmount: Joi.string().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getViewBetsOfRunningMarketValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  newdashboardDataValidation: (req, res, callback) => {
    const schema = Joi.object({
      selectedOption: Joi.number().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("newdashboardDataValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  getDashboardDetailsValidation: (req, res, callback) => {
    const schema = Joi.object({
      type: Joi.string().required(),
      page: Joi.string().required(),
      perPage: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("getDashboardDetailsValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  newLiveExposureValidation: (req, res, callback) => {
    const schema = Joi.object({
      status: Joi.string().required(),
      onlyExposure: Joi.boolean().required(),
      page: Joi.string().required(),
      perPage: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("newLiveExposureValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  fetchWhiteLabelValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().invalid("undefined").required(),
      whiteLabelId: Joi.string().trim().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("rollbackValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate id fields.
   * @param req
   * @param res
   */
  settlementRollbackValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().invalid("undefined").required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("settlementRollbackValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate transaction fields.
   * @param req
   * @param res
   */
  transactionValidation: (req, res, callback) => {
    const schema = Joi.object({
      toId: Joi.string().trim().required(),
      transaction_type: Joi.string()
        .trim()
        .valid(Constants?.TRANSACTION_TYPE?.DEPOSIT, Constants?.TRANSACTION_TYPE?.WITHDRAWL)
        .required(),
      amount: Joi.number().required(),
      description: Joi.string().optional().allow(""),
      password: Joi.string().trim().required(),
      whiteLabelType: Joi.string().trim().valid("NONE", "B2B", "B2C")?.required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("transactionValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update credit reference fields.
   * @param req
   * @param res
   */
  updateCreditRefenceValidation: (req, res, callback) => {
    const schema = Joi.object({
      user_id: Joi.string().trim().required(),
      creditReference: Joi.number().required(),
      // password: Joi.string().trim().required(),
      // transaction_type: Joi.string()
      //   .trim()
      //   .valid(
      //     Constants?.TRANSACTION_TYPE?.DEPOSIT,
      //     Constants?.TRANSACTION_TYPE?.WITHDRAWL
      //   )
      //   .required(),
      // amount: Joi.number().required(),
      // description: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("transactionValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update credit bonus fields.
   * @param req
   * @param res
   */
  updateBonusValidation: (req, res, callback) => {
    const schema = Joi.object({
      user_id: Joi.string().trim().required(),
      bonus: Joi.number().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateBonusValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update groupname fields.
   * @param req
   * @param res
   */
  updateGroupNameValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      groupName: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateGroupNameValidation", error))
      );
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate update groupname fields.
   * @param req
   * @param res
   */
  GroupNameValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      groupName: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateGroupNameValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update betfairShare fields.
   * @param req
   * @param res
   */
  updatebetfairShareValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      betfairShare: Joi.number().required(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updatebetfairShareValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update betfairShare fields.
   * @param req
   * @param res
   */
  updateClientShareValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      clientShare: Joi.number().required(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updateClientShareValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate update commissionPercentage fields.
   * @param req
   * @param res
   */
  updatecommissionPercentageValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      commissionPercentage: Joi.number().required(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("updatecommissionPercentageValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate allowDisAllow and blockAndUnblock fields.
   * @param req
   * @param res
   */
  allowDisAllowBetAndBlockUnblockUserValidation: (req, res, callback) => {
    const schema = Joi.object({
      ids: Joi.array().items(Joi.string()),
      betAllow: Joi.string().optional(),
      status: Joi.string().valid(Constants.ACTIVE, Constants.INACTIVE).optional(),
      password: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("allowDisAllowBetAndBlockUnblockUserValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate create Manager  fields.
   * @param req
   * @param res
   */

  managerValidation: (req, res, callback) => {
    const schema = Joi.object({
      name: Joi.string().trim().required(),
      username: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
      currencyId: Joi.string().trim().required(),
      email: Joi.string().email().allow("").trim().optional(),
      mobileNo: Joi.string().allow("").optional(),
      sportShares: Joi.number().required(),
      role: Joi.number().valid(1.1, 1.2, 1.25, 1.3, 1.4).required(), //1.2- Accounts Manager, 1.25- Fancy Manager  1.3- Operational Manager, 1.4- Monitoring Manager,
      monitoring_manager_accessibility: Joi.string()
        .trim()
        .valid(Constants.MONITORING_MANAGER_ACCESSIBILLITY.DIRECTOR, Constants.MONITORING_MANAGER_ACCESSIBILLITY.OTHERS)
        .optional(),
      layers: Joi.array().items(Joi.string()).optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("managerValidation", error)));
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate accessbility for Manager fields.
   * @param req
   * @param res
   */
  layerAccessibilityUpdateForManagerValidation: (req, res, callback) => {
    const schema = Joi.object({
      layers: Joi.array()
        .items(
          Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required(), // Ensures value is a 24-character hex string
          })
        )
        .min(1)
        .required(),
      manager_id: Joi.string().required(), // Ensures it's a 24-character hex string
      isSingle: Joi.boolean().required(), // Ensures it's a 24-character hex string
    });

    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("managerAccessbilityValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate client settlement.
   * @param req
   * @param res
   */

  clientSettlementValidation: (req, res, callback) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      settlementIds: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().length(24).required(), // Assuming MongoDB ObjectId format
            currency: Joi.object().required(), // Adjust the currency object schema as needed
            clientBalance: Joi.number().required(),
            clientPl: Joi.number().required(),
          })
        )
        .min(1) // At least one item in the array
        .required(), // The settlementIds array is mandatory
    });

    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("clientSettlementValidation", error))
      );
    }
    return callback(true);
  },

  commissionStatusUpdateValidation: (req, res, callback) => {
    const schema = Joi.object({
      isChecked: Joi.alternatives().try(Joi.boolean(), Joi.string()),
      _id: Joi.string().trim().required(),
      isCommissionPrimary: Joi.optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log("error", error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("Commission error", error)));
    }
    return callback(true);
  },
  settingValidation: (req, res, callback) => {
    const schema = Joi.object({
      sportId: Joi.string().required(),
      currencyId: Joi.string().required(),
      stakeSize: Joi.array().items({
        minExch: Joi.number(),
        maxExch: Joi.number(),
        minBookMaker: Joi.number(),
        maxBookMaker: Joi.number(),
        minFancy: Joi.number(),
        maxFancy: Joi.number(),
      }),
      whiteLabelId: Joi.string().optional(),
      fancyLimit: Joi.number().required(),
      betDelay: Joi.array().items({
        betExch: Joi.number(),
        betBookMaker: Joi.number(),
        betFancy: Joi.number(),
      }),
    });
    const { error } = schema.validate(req);
    console.log("error", error);
    if (error) {
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("setting", error)));
    }
    return callback(true);
  },

  usersBonusValidation: (req, res, callback) => {
    const schema = Joi.object({
      bonus: Joi.number().optional(),
      bonusPercentage: Joi.number().optional(),
      cryptoPaymentLimit: Joi.number().optional(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("userBonusValidation", error))
      );
    }
    return callback(true);
  },

  leagueValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string(),
      stakeSize: Joi.array().items({
        minExch: Joi.number(),
        maxExch: Joi.number(),
        minBookMaker: Joi.number(),
        maxBookMaker: Joi.number(),
        minFancy: Joi.number(),
        maxFancy: Joi.number(),
      }),
      betDelay: Joi.array().items({
        betExch: Joi.number(),
        betBookMaker: Joi.number(),
        betFancy: Joi.number(),
      }),
      fancyLimit: Joi.number(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("exchangeValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate user layers fields.
   * @param req
   * @param res
   */
  addWhiteLabelValidation: (req, res, callback) => {
    const schema = Joi.object({
      userId: Joi.string().trim().required(),
      userName: Joi.string().trim().required(),
      groupname: Joi.string().trim().optional(),
      password: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      currency: Joi.string().trim().required(),
      sharing: Joi.string().trim().required(),
      domain: Joi.string().trim().required(),
      admin_domain: Joi.string().trim().required(),
      logo_light: Joi.string().trim().allow(null).optional(),
      logo_dark: Joi.string().trim().allow(null).optional(),
      whiteLabelType: Joi.string().valid("B2C", "B2B").required(),
      whiteLabelBankServices: Joi.valid(null, "Bank", "Bank/Crypto", "Crypto").optional(),
      whiteLabelBrandName: Joi.string().trim().required(),
      whiteLabelLayout: Joi.number().valid(1, 2).required(),
      whiteLabelLightTheme: Joi.string().trim().required(),
      whiteLabelDarkTheme: Joi.string().trim().required(),
    });

    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("addWhiteLabelValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate add bonud fields.
   * @param req
   * @param res
   */
  addBonusValidation: (req, res, callback) => {
    const schema = Joi.object({
      type: Joi.string().trim().required(),
      value: Joi.number().required(),
      minAmount: Joi.number().required(),
      expiry: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("addBonusValidationValidation", error))
      );
    }
    return callback(true);
  },
  /**
   * @description This function is used to validate deposit fields.
   * @param req
   * @param res
   */

  depositValidation: (req, res, callback) => {
    const schema = Joi.object({
      status: Joi.string()
        .trim()
        .valid(
          Constants.DEPOSITED_STATUS.ACCEPTED,
          Constants.DEPOSITED_STATUS.REJECTED,
          Constants.DEPOSITED_STATUS.PENDING,
          Constants.DEPOSITED_STATUS.ALL
        )
        .required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("depositValidation", error)));
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate the fields of bank details.
   * @param req
   * @param res
   */

  addNewBankDetailsValidation: (req, res, callback) => {
    const titleImageSchema = Joi.object({
      type: Joi.string().valid("QRCODE").required(),
      title: Joi.string().trim().required(),
      image: Joi.string().trim().required(),
    });

    const accountSchema = Joi.object({
      type: Joi.string().valid("ACCOUNTDETAILS").required(),
      accountName: Joi.string().trim().required(),
      accountNumber: Joi.string().trim().required(),
      ifscCode: Joi.string().trim().required(),
      bankName: Joi.string().trim().required(),
      accountType: Joi.string().trim().valid("saving", "current").required(),
    });

    const upiSchema = Joi.object({
      type: Joi.string().valid("UPIID").required(),
      upiId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    });

    const cryptoValidate = Joi.object({
      type: Joi.string().valid("Bank", "Crypto").required(),
      bankServiceType: Joi.string().valid("Crypto").required(),
      APIAddress: Joi.string().trim().required(),
      accountName: Joi.string().trim().required(),
      bankName: Joi.string().trim().required(),
      title: Joi.string().trim().required(),
    });

    // Use Joi.alternatives().try() to validate against either schema
    const schema = Joi.alternatives().try(titleImageSchema, accountSchema, upiSchema, cryptoValidate);

    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(
        res,

        res.__(Helper.validationMessageKey("addNewBankDetailsValidation", error))
      );
    }
    return callback(true);
  },

  /**
 
 * @description This function is used to validate the fields of bank.
 * @param req
 * @param res
 */

  deleteBankAccountValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,

        res.__(Helper.validationMessageKey("deleteBankAccountValidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate the fields of withdrawl.
   * @param req
   * @param res
   */

  withdrawlValidation: (req, res, callback) => {
    const schema = Joi.object({
      status: Joi.string()
        .trim()
        .valid(
          Constants.DEPOSITED_STATUS.ACCEPTED,
          Constants.DEPOSITED_STATUS.REJECTED,
          Constants.DEPOSITED_STATUS.PENDING,
          Constants.DEPOSITED_STATUS.ALL
        )
        .required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("withdrawalvalidation", error))
      );
    }
    return callback(true);
  },

  /**
   * @description This function is used to validate the fields of deposits request.
   * @param req
   * @param res
   */

  acceptOrRejectTransactionRequestValidation: (req, res, callback) => {
    const schema = Joi.object({
      transaction: Joi.string()
        .trim()
        .valid(Constants.TRANSACTION_TYPE.DEPOSIT, Constants.TRANSACTION_TYPE.WITHDRAWL)
        .required(),

      id: Joi.string().trim().required(),

      status: Joi.string()
        .trim()
        .valid(Constants.DEPOSITED_STATUS.ACCEPTED, Constants.DEPOSITED_STATUS.REJECTED)
        .required(),
      whiteLabelType: Joi.string().trim().valid("NONE", "B2B", "B2C")?.required(),
    });

    const { error } = schema.validate(req);

    if (error) {
      return Response.validationErrorResponseData(
        res,

        res.__(Helper.validationMessageKey("acceptOrRejectTransactionRequestValidation", error))
      );
    }

    return callback(true);
  },
  transactionCryptoPaymentUpdateRequestValidation: (req, res, callback) => {
    const schema = Joi.object({
      transaction: Joi.string()
        .trim()
        .valid(Constants.TRANSACTION_TYPE.DEPOSIT, Constants.TRANSACTION_TYPE.WITHDRAWL)
        .required(),

      id: Joi.string().trim().required(),
      withdrawalMethod: Joi.string().trim().optional(),

      status: Joi.string()
        .trim()
        .valid(Constants.DEPOSITED_STATUS.ACCEPTED, Constants.DEPOSITED_STATUS.REJECTED)
        .required(),
      whiteLabelType: Joi.string().trim().valid("NONE", "B2B", "B2C")?.required(),
    });

    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,

        res.__(Helper.validationMessageKey("acceptOrRejectTransactionRequestValidation", error))
      );
    }

    return callback(true);
  },
  transactionCryptoPaymentManualUpdationValidation: (req, res, callback) => {
    const schema = Joi.object({
      _id: Joi.string().trim().required(),
      transactionNumber: Joi.string().trim().optional(),
      status: Joi.string()
        .trim()
        .valid(Constants.DEPOSITED_STATUS.ACCEPTED, Constants.DEPOSITED_STATUS.REJECTED)
        .required(),
      remark: Joi.string()?.required(),
    });

    const { error } = schema.validate(req);
    if (error) {
      return Response.validationErrorResponseData(
        res,

        res.__(Helper.validationMessageKey("acceptOrRejectTransactionRequestValidation", error))
      );
    }

    return callback(true);
  },
};
