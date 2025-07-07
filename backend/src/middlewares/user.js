const Response = require("../services/Response");
const jwToken = require("../services/User_jwtToken.js");
const { User } = require("../models");
const { INACTIVE, ACTIVE, BLOCK } = require("../services/Constants");
const Constants = require("../services/Constants");

module.exports = {
  /**
   * @description "This function is used to authenticate and authorize a user."
   * @param req
   * @param res
   */
  userTokenAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      // console.log({ token })
      if (!token) {
        Response.errorResponseWithoutData(
          res,
          res.locals.__("authorizationError"),
          401
        );
      } else {
        const tokenData = await jwToken.decode(token);
        if (tokenData) {
          const decoded = await jwToken.verify(tokenData);
          // console.log({ decoded })

          if (decoded.id) {
            req.authUserId = decoded.id;
            console.log("decoded.id", decoded.id)
            // console.log({ decoded })
            // eslint-disable-next-line consistent-return
            const user = await User.findById(
              decoded.id,
              { status: 1, token: 1 }
            );
            // console.log("user++", user)

            let user_token = `Bearer ${user.token}`;
            if (user && user_token === token) {
              if (user && user.status === INACTIVE) {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("accountIsInactive"),
                  401
                );
              }
              if (user && user.status === ACTIVE) {
                return next();
              } else {
                return Response.errorResponseWithoutData(
                  res,
                  res.locals.__("accountBlocked"),
                  401
                );
              }
            } else {
              return Response.errorResponseWithoutData(
                res,
                res.locals.__("invalidToken"),
                401
              );
            }
          } else {
            return Response.errorResponseWithoutData(
              res,
              res.locals.__("invalidToken"),
              401
            );
          }
        } else {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("invalidToken"),
            401
          );
        }
      }
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  }
}
