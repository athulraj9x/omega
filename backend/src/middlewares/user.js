const Response = require("../services/Response");
const jwToken = require("../services/User_jwtToken.js");
const { User } = require("../models");
const { INACTIVE, ACTIVE, BLOCK, ROLES, INTERNAL_SERVER } = require("../services/Constants");

module.exports = {
  userTokenAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("authorizationError"),
          401
        );
      }

      const tokenData = await jwToken.decode(token);
      if (!tokenData) {
        return Response.errorResponseWithoutData(res, res.locals.__("invalidToken"), 401);
      }

      const decoded = await jwToken.verify(tokenData);
      if (!decoded?.id) {
        return Response.errorResponseWithoutData(res, res.locals.__("invalidToken"), 401);
      }

      const user = await User.findOne(
        { _id: decoded.id, role: ROLES.USER.name },
        { status: 1, token: 1, role: 1, roleLevel: 1 }
      );

      if (!user || `Bearer ${user.token}` !== token) {
        return Response.errorResponseWithoutData(res, res.locals.__("invalidToken"), 401);
      }

      if (user.status === INACTIVE) {
        return Response.errorResponseWithoutData(res, res.locals.__("accountIsInactive"), 401);
      }

      if (user.status === BLOCK) {
        return Response.errorResponseWithoutData(res, res.locals.__("accountBlocked"), 401);
      }

      if (user.role !== ROLES.USER.name) {
        return Response.errorResponseWithoutData(res, res.locals.__("unauthorizedRole"), 403);
      }

      req.authUserId = user._id;
      req.userData = user;
      next();

    } catch (error) {
      console.error("userTokenAuth Error:", error);
      return Response.errorResponseData(res, res.__("internalError"), INTERNAL_SERVER);
    }
  }
};
