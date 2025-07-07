import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    Form,
    Label,
    Row,
} from "reactstrap";
import { Controller } from "react-hook-form";
import BankAccountForm from "./AddBankAccountForm";
import { useTranslation } from "react-i18next";


const BankDetailsForm = ({
    handleSubmit,
    onSubmit,
    control,
    errors,
    handleImageChange,
    imagePreview,
    isSubmit,
    handleClear,
    setBankList}) => {
    const { t } = useTranslation();
    return (
        <>
            <Col sm="12" className="px-3 bg-add-bank-relative">
                <Card className="px-2">
                    <CardBody>
                        <Form
                            className="needs-validation"
                            noValidate=""
                            id="create"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Row className="d-flex flex-col flex-wrap">
                                <Col md="4 mb-3">
                                    <Label className="col-form-label py-0" htmlFor="name">
                                        {t("TITLE")}/ {t("NAME_OF_CREDENTIALS")}
                                    </Label>
                                    <Controller
                                        name="name"
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
                                                type="text"
                                            />
                                        )}
                                    />
                                    <span className="text-danger">
                                        {errors.name && errors.name.message}
                                    </span>
                                </Col>
                                <Col md="4 mb-3">
                                    <Label className="col-form-label py-0" htmlFor="add_bank">
                                        {t("UPLOAD_FILES")}
                                    </Label>
                                    <Controller
                                        name="add_bank"
                                        control={control}
                                        rules={{
                                            required: "This field is required.",
                                        }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
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
                                        {errors.add_bank && errors.add_bank.message}
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
                        </Form>
                    </CardBody>
                    <CardFooter className="py-3 text-center text-md-start">
                        <button
                            form="create"
                            type="submit"
                            className="btn btn-success"
                            color="success"
                            disabled={isSubmit}
                        >
                            {t("UPLOAD")}
                        </button>
                        <Button
                            className="btn ms-2"
                            style={{ backgroundColor: "#CCC" }}
                            onClick={handleClear}
                        >
                            {t("RESET")}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="d-flex align-items-center justify-content-center py-2  mb-2">
                    OR
                </div>
                <BankAccountForm setBankList={setBankList} />
            </Col>
        </>
    )
}

export default BankDetailsForm
