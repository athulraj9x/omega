const mongoose = require("mongoose");
config = require("./config").getConfig();
const fs = require("fs");
const path = require("path");
const logger = require("../services/logger");
const connect = () => {
  const url = config.MONGO_CONNECTION_STRING;
  logger.info(
    "process.env.MONGO_CONNECTION_STRING :::" +
    process.env.MONGO_CONNECTION_STRING
  );

  const pemFilePath = process.env.PEM_FILE_PATH;

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //  tls: true,
    //  tlsAllowInvalidCertificates: true, // Equivalent to `sslValidate: false`
    //  tlsCAFile: pemFilePath.toString(), // Provide the CA certificate file for SSL connections
    // Please Uncomment when pushing the code to github
  };

  mongoose.connect(url, mongooseOptions);

  mongoose.connection.once("open", async () => {
    logger.info("Connected to database");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err, 'errr--- err')
    logger.error("Error connecting to database  ", err);
  });
};

const disconnect = () => {
  if (!mongoose.connection) {
    return;
  }

  mongoose.disconnect();

  mongoose.once("close", async () => {
    console.log("Diconnected  to database");
  });
};

module.exports = {
  connect,
  disconnect,
};
