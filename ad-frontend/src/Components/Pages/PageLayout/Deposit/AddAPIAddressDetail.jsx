import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Button, Card, CardBody, Col, Form, Input, Label, Row } from "reactstrap";
import { isValidUSDTAddress } from "../../../../validations/validateUSDT";
import { useDispatch } from "react-redux";
import { addBank } from "../../../../redux/action";

const cryptoOptions = [{ label: "USDT", value: "USDT" }];

const AddAPIAddressDetail = ({ setDataReceived }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const selectedCrypto = watch("cryptoName");

  useEffect(() => {
    if (selectedCrypto) {
      setValue("cryptoSymbol", selectedCrypto.value);
    } else {
      setValue("cryptoSymbol", "");
    }
  }, [selectedCrypto, setValue]);

  const onSubmit = (formData) => {
    if (formData?.cryptoAddress) {
      const validateUSDT = isValidUSDTAddress(formData?.cryptoAddress);
      if (validateUSDT) {
        const data = {
          accountName: formData?.cryptoSymbol,
          APIAddress: formData?.cryptoAddress, // recently changed the cryptoaddress to api to apiaddress for more consistency
          bankName: formData?.cryptoWalletName,
          bankServiceType: "Crypto",
          type: "Crypto",
          title: formData?.cryptoName?.value,
        };

        dispatch(
          addBank({
            data,
            callback: (data) => {
              if (data?.meta?.code === 200) {
                reset({
                  cryptoName: null,
                  cryptoSymbol: "",
                  cryptoAddress: "",
                  cryptoWalletName: "",
                });
                setDataReceived(new Date());
              }
            },
          })
        );
      }
    }
  };

  return (
    <div className="border border-1 rounded">
      <h2 className="p-2">{t("ADD_CRYPTO_DETAILS")}</h2>
      <Col sm="12" className="px-1 bg-add-bank-relative">
        <Card className="px-2">
          <CardBody>
            <Form className="needs-validation" noValidate id="cryptoForm" onSubmit={handleSubmit(onSubmit)}>
              <Row className="d-flex flex-col flex-wrap">
                {/* Crypto Name (Dropdown) */}
                <Col md="4 mb-3">
                  <Label className="col-form-label py-0">{t("CRYPTO_NAME")}</Label>
                  <Controller
                    name="cryptoName"
                    control={control}
                    rules={{ required: "This field is required." }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={cryptoOptions}
                        className="mySelect"
                        placeholder={t("SELECT_CRYPTO")}
                        onChange={(option) => field.onChange(option)}
                      />
                    )}
                  />
                  <span className="text-danger">{errors.cryptoName && errors.cryptoName.message}</span>
                </Col>

                {/* Crypto Symbol (Auto-filled) */}
                <Col md="4 mb-3">
                  <Label className="col-form-label py-0">{t("CRYPTO_SYMBOL")}</Label>
                  <Controller
                    name="cryptoSymbol"
                    control={control}
                    render={({ field }) => (
                      <input {...field} className="form-control" type="text" readOnly placeholder={t("AUTO_FILLED")} />
                    )}
                  />
                </Col>

                {/* Crypto Address (User Input) */}
                <Col md="4 mb-3">
                  <Label className="col-form-label py-0">{"API Address Key"}</Label>
                  <Controller
                    name="cryptoAddress"
                    control={control}
                    rules={{ required: "This field is required." }}
                    render={({ field }) => (
                      <input {...field} placeholder={t("ENTER_CRYPTO_API_ADDRESS")} className="form-control" type="text" />
                    )}
                  />
                  <span className="text-danger">{errors.cryptoAddress && errors.cryptoAddress.message}</span>
                </Col>

                {/* Crypto Wallet Name */}
                <Col md="4 mb-3">
                  <Label className="col-form-label py-0">{t("CRYPTO_WALLET_NAME")}</Label>
                  <Controller
                    name="cryptoWalletName"
                    control={control}
                    rules={{ required: "This field is required." }}
                    render={({ field }) => (
                      <input {...field} placeholder={t("CRYPTO_WALLET_NAME")} className="form-control" type="text" />
                    )}
                  />
                  <span className="text-danger">{errors.cryptoWalletName && errors.cryptoWalletName.message}</span>
                </Col>
              </Row>

              {/* Submit and Reset Buttons */}
              <Row className="mt-3">
                <Col>
                  <Button type="submit" color="success">{t("SUBMIT")}</Button>
                  <Button className="btn ms-2" onClick={() => reset()}>{t("RESET")}</Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default AddAPIAddressDetail;