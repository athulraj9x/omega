const ROLES = require("../constants/roles");

/**
 * Checks access for:
 * - exact user match (`user`)
 * - level comparison for higher roles (admin, manager)
 *
 * @param {Object} options - Check options
 * @param {String} [options.exactRole] - Exact role name (e.g., "user")
 * @param {Number} [options.minLevel] - Minimum role level allowed
 * @param {Number} [options.maxLevel] - Maximum role level allowed
 */
const checkRole = ({ exactRole, minLevel, maxLevel } = {}) => {
    return (req, res, next) => {
        const user = req.user; // assumes user is set after auth middleware

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (exactRole && user.role === exactRole) {
            return next(); // exact role match, allow
        }

        if (typeof user.roleLevel !== "number") {
            return res.status(403).json({ message: "Invalid role level" });
        }

        if (minLevel !== undefined && user.roleLevel < minLevel) {
            return res.status(403).json({ message: "Insufficient role level" });
        }

        if (maxLevel !== undefined && user.roleLevel > maxLevel) {
            return res.status(403).json({ message: "Role level too high" });
        }

        return next(); // passed all checks
    };
};

module.exports = checkRole;
