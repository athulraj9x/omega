module.exports = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  PAGE_NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER: 500,
  NOT_ACCEPTABLE: 406,
  DATA_CONFLICT: 409,
  CREATED: 201,
  FAIL: 400,
  ACTIVE: "1",
  INACTIVE: "0",
  DELETE: "2",
  BLOCK: "3",
  PER_PAGE: 10,

  DEFAULT_PAGE: 1,
  VERIFIED: "1",
  NOT_VERIFIED: "0",
  S3_ENABLE: "true",
  PROFILE_PIC: "profilePicture",

  CURRENCY_MAP: {
    AED: { name: "United Arab Emirates Dirham", symbol: "د.إ" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    USD: { name: "US Dollar", symbol: "$" },
  },
  ROLES: {
    USER: { name: "user", level: 1 },
    SALES_MANAGER: { name: "sales_manager", level: 2 },
    PRODUCT_MANAGER: { name: "product_manager", level: 3 },
    MARKETING_MANAGER: { name: "marketing_manager", level: 4 },
    ADMIN: { name: "admin", level: 5 },
  }
};
