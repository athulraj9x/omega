const Response = require("../services/Response");
const jwToken = require("../services/Admin_jwtToken");
const { User } = require("../models");
const { ROLES, INTERNAL_SERVER } = require("../services/Constants");

module.exports = {
  adminTokenAuth: async (req, res, next) => {
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

      const admin = await User.findOne(
        { _id: decoded.id },
        { _id: 1, token: 1, role: 1, roleLevel: 1 }
      );

      if (!admin || `Bearer ${admin.token}` !== token) {
        return Response.errorResponseWithoutData(res, res.locals.__("invalidToken"), 401);
      }

      // Check if admin roleLevel is higher than user
      if (admin.roleLevel <= ROLES.USER.level) {
        return Response.errorResponseWithoutData(res, res.locals.__("unauthorizedRole"), 403);
      }

      req.authAdminId = admin._id;
      req.adminData = admin;
      next();

    } catch (error) {
      console.error("adminTokenAuth Error:", error);
      return Response.errorResponseData(res, res.__("internalError"), INTERNAL_SERVER);
    }
  }
};
