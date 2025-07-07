import React, { Fragment, useState, useEffect } from "react";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { useTranslation } from "react-i18next";
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
import { Controller, useForm, FormProvider } from "react-hook-form";
import { notifyWarning } from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  getBank,
  addBank,
  deleteBankDetailsAction,
} from "../../../../redux/action";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Common/Component/Modals/ConfirmModal";
import BankAccountForm from "./AddBankAccountForm";
import { useNavigate } from "react-router";
import BankDetailsForm from "./BankDetailsForm";
import AddAPIAddressDetail from "./AddAPIAddressDetail";
import ListBankAccount from "./ListBankAccount";

const AddBankDetail = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm();

  const [dataReceived, setDataReceived] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility

  const [selectedBankId, setSelectedBankId] = useState(null); // Store ID of the bank to be deleted
  //  const whiteLabelType = useSelector((state)=>state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]?.whiteLabelType);
  const whiteLabelData = useSelector((state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel?.[0]);
  useEffect(() => {
    // Redirect when whiteLabelType is defined and not B2C
    if (!whiteLabelData && whiteLabelData?.whiteLabelType !== "B2C") {
      navigate("/dashboard"); // Redirect to a "Not Authorized" page or any other route
    }
  }, [whiteLabelData, navigate]);


  console.log({ whiteLabelData })

  const displayValue = (value) => {
    toast(value);
  };
  const {
    handleSubmit: handleBankSubmit,
    control: bankControl,
    formState: { errors: bankErrors },
    reset
  } = useForm();
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
        setImagePreview(null);
      }
    }
    else {
      setImagePreview(null);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    reset();
    setIsSubmit(false);
  };

  const handleDelete = () => {
    if (selectedBankId && selectedBankId !== null) {
      let payload = {
        id: selectedBankId,
      };
      dispatch(
        deleteBankDetailsAction({
          data: payload,
          callback: (data) => {
            if (data.meta.code === 200) {
              dispatch(
                getBank({
                  callback: (data) => {
                    if (data.meta.code === 200) {
                      setBankList(data?.data);
                    }
                  },
                })
              );
            }
          },
        })
      );
      setIsModalOpen(false);
    } else {
      return displayValue("Required Id");
    }
  };

  const onBankSubmit = (data) => {
    if (imagePreview) {
      const datas = {
        type: "QRCODE",
        title: data?.name,
        image: imagePreview,
      };
      setIsSubmit(true);
      dispatch(
        addBank({
          data: datas,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              handleClear();
              setIsSubmit(false);
              dispatch(
                getBank({
                  callback: (data) => {
                    setBankList(data?.data);
                  },
                })
              );
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

  useEffect(() => {
    let isMounted = true;  // Track whether the component is mounted

    dispatch(
      getBank({
        callback: (data) => {
          // Only update the state if the component is still mounted
          if (isMounted) {
            setBankList(data?.data);
          }
        },
      })
    );
    // Cleanup function to mark the component as unmounted
    return () => {
      isMounted = false;
    };
  }, [dataReceived, dispatch]);

  const openDeleteModal = (bankId) => {
    setSelectedBankId(bankId); // Set the bank ID to delete
    setIsModalOpen(true); // Open the modal
  };

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={whiteLabelData?.whiteLabelBankServices}
        title={title?.title}
        parent={title?.parent}
      />

      <Row>

        {whiteLabelData && whiteLabelData?.whiteLabelBankServices === "Bank/Crypto" ? (
          <>
            {(bankList?.filter(element => element?.accountType === "wallet").length === 0
            ) ? (
              <AddAPIAddressDetail setDataReceived={setDataReceived} />
            ) : null}


            <BankDetailsForm
              handleSubmit={handleBankSubmit}
              onSubmit={onBankSubmit}
              control={bankControl}
              errors={bankErrors}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              isSubmit={isSubmit}
              handleClear={handleClear}
              setBankList={setBankList}
            />
            <ListBankAccount
              bankList={bankList}
              openDeleteModal={openDeleteModal}
            />

          </>
        ) : whiteLabelData && whiteLabelData?.whiteLabelBankServices === "Crypto" ? (
          <>

            {(bankList?.filter(element => element?.accountType === "wallet").length === 0
            ) ? (
              <AddAPIAddressDetail setDataReceived={setDataReceived} />
            ) : null}

            <ListBankAccount
              bankList={bankList}
              openDeleteModal={openDeleteModal}
            />
          </>

        ) : (
          <>
            <BankDetailsForm
              handleSubmit={handleBankSubmit}
              onSubmit={onBankSubmit}
              control={bankControl}
              errors={bankErrors}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              isSubmit={isSubmit}
              handleClear={handleClear}
              setBankList={setBankList}
            />

            <ListBankAccount
              bankList={bankList}
              openDeleteModal={openDeleteModal}
            />

          </>
        )}

      </Row>

      {/* Modal Outside the .map() */}
      {isModalOpen && <ConfirmModal
        open={isModalOpen}
        setOpen={() => setIsModalOpen(false)}
        modalAction={handleDelete}
        title={t("ARE_YOU_SURE")}
      />}
    </Fragment>
  );
};

export default AddBankDetail;
