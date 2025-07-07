const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { User, UserWallet } = require("../../models"); // Assuming you have a User model to save profile picture information
const { SUCCESS, FAIL, INTERNAL_SERVER, PROFILE_PIC } = require("../../services/Constants");
const Response = require("../../services/Response");
const { makeRandomOTPNumber } = require("../../services/Helper");
const { removeOldImage, mediaUrlForS3 } = require("../../services/s3Bucket");
const { base64ImageUpload } = require("../../services/s3Bucket");
const moment = require("moment");

module.exports = {
  uploadProfilePic: async (req, res) => {
    try {
      const { userId, userName, image, fee } = req.body;

      if (!userId) {
        return Response.errorResponseWithoutData(
          res,
          'Missing required fields: userId',
          FAIL
        );
      }

      const user = await User.findById(userId);
      if (!user) {
        return Response.errorResponseWithoutData(
          res,
          'User not found',
          FAIL
        );
      }

      let imageName = "";
      if (image) {
        const extension = image.split(";")[0].split("/")[1];
        const randomNumber = await makeRandomOTPNumber(5);
        imageName = `${moment().unix()}${randomNumber}.${extension}`;
        let userImage = user.profile_pic;
        removeOldImage(userImage, `${PROFILE_PIC}/${userId}`)
        const profileImage = await base64ImageUpload(
          imageName,
          `${PROFILE_PIC}/${userId}`,
          image,
          res
        );
        if (profileImage) {
          user.profile_pic = imageName;
        }
        console.log("profile pic is : ", user.profile_pic);
      }


      if (userName) {
        user.username = userName;
        console.log("profile pic is : ", user.username);
      }



      let imageUrl = image ? mediaUrlForS3(`${PROFILE_PIC}`,
        userId, imageName) : ""



      let wallet = await UserWallet.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      console.log("wallet", wallet);
      let updatedWalletDiamond = 0;
      updatedWalletDiamond = wallet?.diamond - fee;
      updatedWalletDiamond = parseInt(updatedWalletDiamond);
      await UserWallet.updateOne(
        { userId: new mongoose.Types.ObjectId(userId) }, // Use mongoose.Types.ObjectId for ObjectId
        { $set: { diamond: updatedWalletDiamond } } // Update the socketId
      );

      await user.save();

      // Respond with success and the new profile picture URL
      return Response.successResponseWithData(
        res,
        { profilePicUrl: imageUrl },
        'profileUpdated',
        SUCCESS
      );
    } catch (error) {
      console.log("Error uploading profile picture:", error);
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },

  editProfile: async (req, res) => {
    try {
      const { firstName, lastName, image } = req.body;
      const { authUserId } = req;
      // Validate all the fields passed in the body
      editProfileValidation(req.body, res, async (validate) => {
        if (validate) {
          const userObj = {};

          // Check and handle image upload if provided
          if (image) {
            const extension = image.split(";")[0].split("/")[1];
            const randomNumber = await makeRandomOTPNumber(5);
            const imageName = `${moment().unix()}${randomNumber}.${extension}`;
            let userImage = await User.findOne({ _id: authUserId }, { image: 1 }).lean();
            removeOldImage(userImage.image, `${PROFILE_PIC}/${authUserId}`)
            // Upload the image to the specified location
            const profileImage = await base64ImageUpload(
              imageName,
              `${PROFILE_PIC}/${authUserId}`,
              image,
              res
            );

            if (profileImage) {
              userObj.image = imageName;
            }
          }

          // Dynamically add other fields to the user object
          if (firstName) userObj.firstName = firstName;
          if (lastName) userObj.lastName = lastName;

          // Update the user's profile in the database
          await User.updateOne(
            { _id: authUserId },
            {
              $set: userObj,
            }
          );

          return Response.successResponseWithoutData(
            res,
            res.locals.__("profileUpdated"),
            SUCCESS
          );
        }
      });
    } catch (error) {
      return Response.errorResponseData(
        res,
        res.locals.__("internalServerError"),
        INTERNAL_SERVER
      );
    }
  },
};
