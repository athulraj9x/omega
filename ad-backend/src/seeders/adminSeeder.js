const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../../.env" });
const { User, UserLoginHistory, Sports } = require("./../models");
const logger = require("../logger/logger");
config = require("../config/config").getConfig();
const { slugName } = require("./../services/Helper");
const { ACTIVE, ROLES } = require("../services/Constants");
const createAdmin = async () => {
  try {
    const url = config.MONGO_CONNECTION_STRING;
    logger.info("process.env.MONGO_CONNECTION_STRING :::" + process.env.MONGO_CONNECTION_STRING);
    //const pemFilePath = process.env.PEM_FILE_PATH;
    const projectRoot = path.resolve(__dirname, "../..");

    const pemFilePath = path.join(projectRoot, "global-bundle.pem");
    console.log("Pem File Path:", pemFilePath);
    // console.log("Current Working Directory:", process.cwd());

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ssl: true,
      // sslValidate: false,
      // sslCA: pemFilePath.toString(), // Provide the CA certificate file for SSL connections
      // Add other options if necessary
    };
    // console.log("admin mongooseOptions", mongooseOptions);

    mongoose.connect(url, mongooseOptions);

    mongoose.connection.once("open", async () => {
      logger.info("Connected to database");
      const userName = process.env.ADMIN_USERNAME || "admin123"
      const userPassword = process.env.ADMIN_PASSWORD || "admin@123"
      const userEmail = process.env.ADMIN_EMAIL || "admin@gmail.com"
      const userMobileNo = process.env.ADMIN_MOBILE_NO || 8877445511
      const hash = await bcrypt.hashSync(userPassword, 10);;
      const adminRole = ROLES.ADMIN.name;
      const roleData = Object.values(ROLES).find(r => r.name === adminRole) || ROLES.USER;
      await User.deleteOne({ username: userName });
      let user = await User.create({
        name: userName,
        email: userEmail,
        username: userName,
        status: ACTIVE,
        role: roleData.name,
        roleLevel: roleData.level,
        password: hash,
        passwordText: userPassword,
        email_verify: new Date(),
        device_code: "device_xyz",
        mobile_no: userMobileNo,

      });


      let loginHistory = await UserLoginHistory.create({ userId: user?._id });
      await User.updateOne(
        { _id: user?._id },
        {
          $set: {
            loginHistory: loginHistory?._id,
          },
        }
      );
    });
  } catch (error) {
    logger.error("Error", error);
  }
};

createAdmin();
