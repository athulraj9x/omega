const Transformer = require("object-transformer");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Response = require("../../services/Response");
const {
  ACTIVE,
  SUCCESS,
  BAD_REQUEST,
  FAIL,
  INTERNAL_SERVER,
  DELETE,
  USER_WALLET,
  PROFILE_PIC,
} = require("../../services/Constants");
const { makeRandomNumber } = require("../../services/Helper");
// const Mailer = require("../../services/Mailer");
const { Login } = require("../../transformers/user/userAuthTransformer");
const { User, Otp } = require("../../models");
const { issueUser } = require("../../services/User_jwtToken");
const formatUserData = require("../../services/formatUserData");
const { forgotPasswordValidation, resetPasswordValidation, logoutAndBlockValidation } = require("../../services/AdminValidation");


module.exports = {
  login: async (req, res) => {
    try {
      const requestParams = req.body;
      console.log("login", requestParams);
      loginValidation(requestParams, res, async (validate) => {
        if (validate) {
          console.log("login validate", validate);
          let user = null;
          let browser_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          const system_ip = req.clientIp;

          // if (requestParams.login_type === "google") {
          //   console.log("google login");
          //   // Google Login Flow
          //   if (!requestParams.google_id_token) {
          //     return Response.errorResponseWithoutData(res, "GoogleIDtokenIsRequired", FAIL);
          //   }

          //   // Verify Google token
          //   const ticket = await client.verifyIdToken({
          //     idToken: requestParams.google_id_token,
          //     audience: process.env.GOOGLE_CLIENT_ID,
          //   });

          //   const payload = ticket.getPayload();
          //   const googleEmail = payload.email;
          //   const googlePicture = payload.picture;

          //   // Find or create the user in the database
          //   user = await User.findOne({ email: googleEmail });
          //   if (!user) {
          //     user = await User.create({
          //       device_code: requestParams.device_code,
          //       email: googleEmail,
          //       username: payload.name,
          //       google_pic: googlePicture,
          //       email_verify: new Date(),
          //       google_id: payload.sub,
          //       status: ACTIVE,
          //     });

          //     let userWallet = await UserWallet.create({
          //       userId: user?._id,
          //       coin: USER_WALLET.COIN,
          //       diamond: USER_WALLET.DIAMOND,
          //     });

          //     await User.updateOne(
          //       { _id: user?._id },
          //       {
          //         wallet_id: userWallet?._id,
          //       }
          //     );
          //   }
          //   const payloadIssue = {
          //     id: user._id,
          //   };
          //   const token = issueUser(payloadIssue);
          //   const meta = { token };

          //   tokenUpdate = {
          //     $set: {
          //       last_login: new Date(),
          //       token: token,
          //       "ip_address.system_ip": system_ip,
          //       "ip_address.browser_ip": browser_ip,
          //     },
          //   };

          //   await User.updateOne({ _id: user?._id }, tokenUpdate);

          //   let userData = {
          //     id: user?._id,
          //     username: user?.username,
          //     profile_pic: user?.google_pic ? user?.google_pic : "",
          //     name: user?.name,
          //     email: user?.email,
          //     mobileNo: user?.mobileNo,
          //     guest_login: user?.guest_login,
          //     device_code: user?.device_code,
          //     status: user?.status,
          //     createdAt: user?.createdAt,
          //     updatedAt: user?.updatedAt,
          //   };

          //   return Response.successResponseData(
          //     res,
          //     new Transformer.Single(userData, Login).parse(),
          //     SUCCESS,
          //     res.locals.__("loginSucceeded"),
          //     meta
          //   );
          // } else if (requestParams.login_type === "guest_login") {
          //   // Find or create the user in the database
          //   user = await User.findOne({ guest_login: requestParams.device_code }).sort({ last_login: -1 });
          //   // console.log({ user })
          //   if (!user) {
          //     let userUniqueName = "Guest";
          //     let suffix = 1;

          //     while (await User.findOne({ username: userUniqueName })) {
          //       userUniqueName = `Guest_${Math.floor(Math.random() * 10000)}`;
          //     }
          //     user = await User.create({
          //       guest_login: requestParams.device_code,
          //       device_code: requestParams.device_code,
          //       username: userUniqueName,
          //       email_verify: new Date(),
          //       status: ACTIVE,
          //       is_guest: requestParams.login_type === "guest_login",
          //     });
          //     // console.log({ newUserCreated: user })

          //     let userWallet = await UserWallet.create({
          //       userId: user?._id,
          //       coin: USER_WALLET.COIN,
          //       diamond: USER_WALLET.DIAMOND,
          //     });
          //     // console.log({ userWallet: userWallet })

          //     const updatedUser = await User.findOneAndUpdate(
          //       { _id: user?._id },
          //       {
          //         wallet_id: userWallet?._id,
          //       }
          //     );
          //     // console.log({ updatedUser })
          //   }
          //   const payloadIssue = {
          //     id: user._id,
          //   };
          //   // console.log({ payloadIssue })
          //   const token = issueUser(payloadIssue);
          //   const meta = { token };
          //   // console.log({ token })
          //   // console.log({ meta })

          //   tokenUpdate = {
          //     $set: {
          //       last_login: new Date(),
          //       token: token,
          //       "ip_address.system_ip": system_ip,
          //       "ip_address.browser_ip": browser_ip,
          //     },
          //   };

          //   // console.log({ tokenUpdate })
          //   const updateToken = await User.updateOne({ _id: user?._id }, tokenUpdate);
          //   // console.log({ updateToken })

          //   return Response.successResponseData(
          //     res,
          //     new Transformer.Single(user, Login).parse(),
          //     SUCCESS,
          //     res.locals.__("loginSucceeded"),
          //     meta
          //   );
          // } else

          {
            console.log("not google login");
            let isPassword = true;
            const filters = [];

            if (requestParams.email) {
              filters.push({ email: requestParams.email.toLowerCase() });
            }
            if (requestParams.mobile_no) {
              filters.push({ mobile_no: requestParams.mobile_no });
            }

            if (requestParams.device_code) {
              filters.push({ device_code: requestParams.device_code.toLowerCase() });
            }

            let user;

            if (filters.length > 0) {
              user = await User.findOne({ $or: filters })
                .populate("currency_id")
                .populate("wallet_id")
                .sort({ last_login: -1 });
            }

            if (user) {
              if (user.email_verify === null) {
                Response.errorResponseWithoutData(res, res.locals.__("emailNotVerified"), FAIL);
              } else {
                if (user?.status === ACTIVE) {
                  if (requestParams.password) {
                    const comparePassword = await bcrypt.compare(requestParams.password, user.password);
                    if (comparePassword) {
                      isPassword = true;
                    } else {
                      isPassword = false;
                    }
                  }
                  if (isPassword) {
                    const payload = {
                      id: user._id,
                    };
                    const token = issueUser(payload);
                    const meta = { token };

                    tokenUpdate = {
                      $set: {
                        last_login: new Date(),
                        token: token,
                        device_code: requestParams.device_code,
                        "ip_address.system_ip": system_ip,
                        "ip_address.browser_ip": browser_ip,
                      },
                    };

                    // await User.updateOne({ _id: user?._id }, tokenUpdate);
                    const updatedUser = await User.findOneAndUpdate({ _id: user?._id }, tokenUpdate, { new: true });


                    let userData = formatUserData(user)

                    return Response.successResponseData(
                      res,
                      new Transformer.Single(userData, Login).parse(),
                      SUCCESS,
                      res.locals.__("loginSucceeded"),
                      meta
                    );
                  } else {
                    return Response.errorResponseWithoutData(res, res.locals.__("emailPasswordNotMatch"), FAIL);
                  }
                } else {
                  if (user?.status === DELETE) {
                    Response.errorResponseWithoutData(res, res.locals.__("accountIsDeleted"), FAIL);
                  } else {
                    Response.errorResponseWithoutData(res, res.locals.__("accountIsInactive"), FAIL);
                  }
                }
              }
            } else {
              Response.errorResponseWithoutData(res, res.locals.__("userNotExist"), FAIL);
            }
          }
        }
      });

      // const user = await User.findOne({ username:requestParams.username });
      // res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return Response.errorResponseData(res, res.__("internalError"), INTERNAL_SERVER);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const reqParam = req.body;
      forgotPasswordValidation(reqParam, res, async (validate) => {
        if (validate) {
          const minutesLater = new Date();
          const restTokenExpire = minutesLater.setMinutes(minutesLater.getMinutes() + 60);
          const otp = await makeRandomNumber(4);
          let user = await User.findOne({ email: reqParam.email }, { name: 1, status: 1 });

          if (user) {
            const locals = {
              appName: AppName,
              otp,
            };
            if (user?.status === ACTIVE) {
              await Otp.deleteMany({ user_id: user._id });
              await Otp.create({
                user_id: user._id,
                otp: otp,
                code_expiry: restTokenExpire,
              });

              await Mailer.sendMail(reqParam.email, "Forgot Password", forgotTemplate, locals);

              return Response.successResponseData(res, res.locals.__("forgotPasswordEmailSendSuccess"), SUCCESS);
            } else {
              Response.errorResponseWithoutData(res, res.locals.__("accountIsInactive"), FAIL);
            }
          } else {
            Response.errorResponseWithoutData(res, res.locals.__("emailNotExists"), FAIL);
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const reqParam = req.body;
      resetPasswordValidation(reqParam, res, async (validate) => {
        if (validate) {
          const valid = await Otp.findOne({ otp: reqParam.otp }, { otp: 1, user_id: 1, code_expiry: 1 }).populate(
            "user_id",
            "email name password"
          );
          if (valid && reqParam.email === valid.user_id?.email) {
            if (valid.code_expiry != null) {
              if (valid.code_expiry.getTime() >= Date.now()) {
                const passCheck = await bcrypt.compare(reqParam.password, valid?.user_id?.password);
                if (!passCheck) {
                  const hashPass = bcrypt.hashSync(reqParam?.password, 10);
                  await User.findByIdAndUpdate(valid?.user_id?._id, {
                    $set: { password: hashPass },
                  });
                  await Otp.findByIdAndDelete(valid._id);
                  return Response.successResponseWithoutData(res, res.locals.__("PasswordResetSuccessfully"), SUCCESS);
                } else {
                  return Response.errorResponseWithoutData(
                    res,
                    res.locals.__("existingPasswordNotAllowed"),
                    BAD_REQUEST
                  );
                }
              } else {
                return Response.errorResponseWithoutData(res, res.locals.__("otpExpired"), BAD_REQUEST);
              }
            } else {
              return Response.errorResponseWithoutData(res, res.locals.__("invalidOtp"), BAD_REQUEST);
            }
          } else {
            return Response.errorResponseWithoutData(res, res.locals.__("invalidOtp"), BAD_REQUEST);
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },

  logout: async (req, res) => {
    try {
      const requestParams = req.body;
      logoutAndBlockValidation(requestParams, res, async (validate) => {
        if (validate) {
          let browser_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

          const system_ip = req.clientIp;
          await User.updateOne(
            { username: requestParams.username.toLowerCase() },
            {
              $set: {
                token: null,
                "ip_address.system_ip": system_ip,
                "ip_address.browser_ip": browser_ip,
              },
            }
          );
          return Response.successResponseWithoutData(res, res.locals.__("logoutSuccessfully"), SUCCESS);
        }
      });
    } catch (error) {
      return Response.errorResponseWithoutData(res, res.locals.__("internalError"), INTERNAL_SERVER);
    }
  },

  resendOtp: async (req, res) => {
    try {
      const requestParams = req.body;
      resendEmailValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            email: requestParams.email
          }, { _id: 1, first_name: 1, email: 1 });
          if (user) {
            var currentDate = new Date();
            const system_ip = req.clientIp;
            let browser_ip =
              req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            var otpTokenExpire = new Date(currentDate.getTime() + USER_MODEL.EMAIL_VERIFY_OTP_EXPIRY_MINUTE * 60000); // 10 minutes * 60000 ms/min
            const otp = await makeRandomNumber(4);

            const otpObj = {
              user_id: user._id,
              otp: otp,
              code_expiry: otpTokenExpire,
            };
            await Otp.deleteMany({ user_id: user._id });
            await Otp.create(otpObj);

            await User.updateOne(
              { _id: user?._id },
              { $set: { "ip_address.system_ip": system_ip, "ip_address.browser_ip": browser_ip } }
            );

            let locals = {
              first_name: user.first_name,
              appName: AppName,
              otp: otp
            }

            Mailer.sendMail(user.email, "resend otp", resendOtp, locals);

            return Response.successResponseWithoutData(
              res,
              res.__('emailResend'),
              SUCCESS
            );
          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('emailNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      console.log("error", error);

      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  getUserName: async (req, res) => {
    try {
      const requestParams = req.query;
      userNameValidation(requestParams, res, async (validate) => {
        if (validate) {
          let user = await User.findOne({
            username: requestParams.username
          }, { _id: 1, username: 1 });
          if (user) {
            return Response.successResponseWithoutData(
              res,
              res.__('userAlreadyExist'),
              SUCCESS
            );
          } else {
            Response.errorResponseWithoutData(
              res,
              res.locals.__('userNotExist'),
              FAIL,
            );
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },
  getUserDetail: async (req, res) => {
    try {
      const requestParams = req.query;
      userDetailValidation(requestParams, res, async (validate) => {
        console.log(req.userData)
        if (validate) {
          const userId = req?.userData?._id
          const validUserId = mongoose.isValidObjectId(userId)
          console.log({ validUserId })
          if (!validUserId) {
            return Response.errorResponseWithoutData(
              res,
              INVALID_USER_ID,
              BAD_REQUEST,
              res.locals.__("failed"),
            );
          }

          let user = await User.findOne({
            _id: userId
          }, { password: 0, password_text: 0, createdAt: 0, }).populate({
            path: 'wallet_id',
            select: "coin diamond"
          });

          let userData = formatUserData(user)

          return Response.successResponseData(
            res,
            userData,
            SUCCESS,
            res.locals.__("success"),
          );
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },
};
