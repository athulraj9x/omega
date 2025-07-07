const moment = require("moment");

const { Banner } = require("../../models");
const Constants = require("../../services/Constants");
const { makeRandomNumber } = require("../../services/Helper");
const Response = require("../../services/Response");
const {
  removeOldImage,
  s3MediaUrl,
  base64ImageUpload,
} = require("../../services/S3Bucket");
const { default: mongoose } = require("mongoose");

module.exports = {
  /**
   * @description "This function is to add new banner."
   * @param req
   * @param res
   */
  addBanner: async (req, res) => {
    try {
      const requestParams = req.body;

      let imageName = null;
      if (requestParams?.image && requestParams?.image !== "") {
        //image file modification
        const extension =
          requestParams.image && requestParams.image !== ""
            ? requestParams.image.split(";")[0].split("/")[1]
            : "";
        const randomNumber = await makeRandomNumber(5);
        imageName =
          requestParams.image && requestParams.image !== ""
            ? `${moment().unix()}${randomNumber}.${extension}`
            : "";
        let currentDate = new Date();

        // Format the date as a string (e.g., "11/15/2023" for November 15, 2023)
        let formattedDate = `${currentDate.getDate()}-${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;

        // console.log(formattedDate, "formattedDate upload");

        //profile pic upload
        const bucketRes = await base64ImageUpload(
          imageName,
          `${Constants.BANNER}/${formattedDate}`,
          requestParams.image,
          res
        );
        const bannerObj = {
          image: imageName,
          device: requestParams?.size,
          ...(requestParams?.key !== 'betxfair' && { whiteLabelId: requestParams?.key })
        }
        // console.log(bucketRes, "mm");
        if (bucketRes) {
          await Banner.create(bannerObj);
        } else {
          return Response.errorResponseWithoutData(
            res,
            res.locals.__("failedToUpload"),
            Constants.FAIL
          );
        }
        // console.log("created");
        return Response.successResponseWithoutData(
          res,
          res.locals.__("bannerAdded"),
          Constants.SUCCESS
        );
      } else {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("imageNotFound"),
          Constants.FAIL
        );
      }
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to get all banner."
   * @param req
   * @param res
   */

  getBanners: async (req, res) => {
    try {
      const requestParams = req.body;
      let bannerFilter

      if (requestParams?.keys === 'betxfair') {
        bannerFilter = {
          device: requestParams?.device,
          whiteLabelId: { $exists: false }
        };
      }
      else {
        const whiteLabelIds = requestParams.keys.map((id) => new mongoose.Types.ObjectId(id))
        bannerFilter = {
          device: requestParams?.device,
          whiteLabelId: { $in: whiteLabelIds }
        };
      }

      const banners = await Banner.find(bannerFilter);
      const bannerDatas = banners.map((data) => {
        const date = new Date(data?.createdAt);
        var formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        // console.log(formattedDate, "formattedDate get");
        return {
          _id: data?._id,
          image: s3MediaUrl(Constants.BANNER, formattedDate, data?.image),
          device: data?.device,
          status: data?.status,
        };
      });
      if (bannerDatas) {
        return Response.successResponseData(
          res,
          bannerDatas,
          Constants.SUCCESS,
          res.locals.__("success")
        );
      }
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to update Slider status."
   * @param req
   * @param res
   */

  updateSliderStatus: async (req, res) => {
    try {
      const requestParams = req.body;
      // console.log(requestParams, "io");

      await Banner.updateOne(
        { _id: requestParams?.id },
        {
          $set: { status: requestParams?.status },
        }
      );
      Response.successResponseWithoutData(
        res,
        res.locals.__("bannerStatusUpdated"),
        Constants.SUCCESS
      );
    } catch (error) {
      console.log(error);
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },

  /**
   * @description "This function is to delete Slider ."
   * @param req
   * @param res
   */

  deleteSlider: async (req, res) => {
    try {
      const requestParams = req.params.id;
      // console.log(requestParams, "params");
      const banner = await Banner.findOne({ _id: requestParams });
      // console.log(banner, "bbb");
      const date = new Date(banner?.createdAt);
      var formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
      const bucketRes = await removeOldImage(
        banner?.image,
        `${Constants.BANNER}/${formattedDate} `
      );

      // console.log(bucketRes, "bucketRes");

      if (bucketRes) {
        await Banner.deleteOne({ _id: requestParams });
        Response.successResponseWithoutData(
          res,
          res.locals.__("bannerDeleted"),
          Constants.SUCCESS
        );
      } else {
        return Response.errorResponseWithoutData(
          res,
          res.locals.__("failedToDelete"),
          Constants.BAD_REQUEST
        );
      }
    } catch (error) {
      console.log(error, "error");
      return Response.errorResponseWithoutData(
        res,
        res.locals.__("internalError"),
        Constants.INTERNAL_SERVER
      );
    }
  },
};
