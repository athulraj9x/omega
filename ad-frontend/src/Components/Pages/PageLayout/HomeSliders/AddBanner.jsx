import React, { Fragment, useState } from "react";
import { Breadcrumbs, H3 } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Form,
  Label,
  Media,
  Row,
} from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { notifyWarning } from "../../../../utils/helper";
import { useDispatch } from "react-redux";
import { addBanner } from "../../../../redux/action";
import { useSelector } from "react-redux";

const AddBanner = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const userData = useSelector((state) => state.Login.userData);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleToggleChange = () => {
    setMobile((prevMobile) => !prevMobile);
    handleClear();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
      } else {
        notifyWarning("Selected file type not allowed.");
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    reset();
    // setIsSubmit(false);
  };
  const onSubmit = () => {
    const key = userData?.whiteLabelId ? userData?.whiteLabelId : 'betxfair'
    if (imagePreview) {
      const datas = {
        size: mobile ? "mobile" : "desktop",
        image: imagePreview,
        key: key,
      };

      setIsSubmit(true);
      dispatch(
        addBanner({
          data: datas,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              handleClear();
              setIsSubmit(false);
            } else {
              setIsSubmit(false);
            }
          },
        })
      );
    } else {
      setIsSubmit(false);
      notifyWarning("Please choose an Image.");
    }
  };
  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={t("ADD_HOME_SLIDER")}
        title={title?.title}
        parent={title?.parent}
      />

      <Row>
        <Col sm="12" className="px-3">
          <Card className="px-2">
            <CardBody>
              <Form
                className="needs-validation"
                noValidate=""
                id="create"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Row className="d-flex flex-col flex-wrap ">
                  <Col md="4 mb-3">
                    <Label
                      className="col-form-label py-0"
                      htmlFor="validationCustom00"
                    >
                      {t("IMAGE")}
                    </Label>
                    <Controller
                      name="banner"
                      control={control}
                      rules={{
                        required: "This field is required.",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder={t("ENTER_NAME")}
                          className="form-control"
                          value={field.value || ""}
                          type="file"
                          onChange={(e) => {
                            handleImageChange(e);
                            field.onChange(e.target.value);
                          }}
                        />
                      )}
                    />
                    <span className="text-danger">
                      {errors.name && errors.name.message}
                    </span>
                  </Col>
                  <Col>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          height: "200px",
                          width: "450px",
                          border: "10px solid #ccc", // Add this line for a gray border
                          borderRadius: "5px", // Optional: Add border radius
                        }}
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col className="ml-2">
                    <Media
                      body
                      className={`${"text-left"} d-flex align-items-center justify-content-start gap-2`}
                    >
                      <span
                        onClick={(e) => handleToggleChange(e)}
                        style={{ cursor: "pointer" }}
                        className="border d-flex align-items-center justify-content-end gap-2 px-2 py-2 rounded-3"
                      >
                        <span className="fw-semibold fs-6 d-flex align-items-center">
                          {mobile ? t("MOBILE") : t("DESKTOP")}
                        </span>
                        <Label className={`m-0 ${"switch"}`}>
                          <input
                            type="checkbox"
                            checked={mobile}
                            onChange={handleToggleChange}
                          />
                          <span
                            className="switch-state"
                            style={{
                              backgroundColor: mobile
                                ? "limegreen"
                                : "lightgray",
                            }}
                          />
                        </Label>
                      </span>
                    </Media>
                  </Col>
                </Row>
              </Form>
            </CardBody>
            <CardFooter className="py-3 text-center text-md-start">
              <button
                form="create"
                type="submit"
                className="btn btn-success "
                color="success"
                disabled={isSubmit}
              >
                {t("ADD_SLIDER")}
              </button>
              <button
                className="btn ms-2"
                style={{ backgroundColor: "#CCC" }}
                onClick={handleClear}
              >
                {t("RESET")}
              </button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddBanner;
