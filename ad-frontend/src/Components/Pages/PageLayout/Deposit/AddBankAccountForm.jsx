import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { addBank,getBank, } from "../../../../redux/action";
import { useDispatch,  } from "react-redux";


const BankAccountForm = ({ setBankList }) => {

  const dispatch= useDispatch()
  const { t } = useTranslation();
  
  // Initialize state for each input field and validation error
  const [formInput, setFormInput] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountType: "saving"
  });
  
  
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [upiId, setUpiId]= useState("")
  const [upiError, setUpiError]=useState("");

  const validateForm = () => {
    let formErrors = {};
  
    // Check each field in formInput state for errors
    if (!formInput.accountNumber) formErrors.accountNumber = "Account Number is required.";
    if (!formInput.accountName) formErrors.accountName = "Account Name is required.";
    if (!formInput.bankName) formErrors.bankName = "Bank Name is required.";
    if (!formInput.ifscCode) formErrors.ifscCode = "IFSC Code is required.";
  
    return formErrors;
  };


  const handleKeyDown = (e) => {
    // Block unwanted keys during keydown
    if (
      e.key === " " ||  // Space
      e.key === "_" ||
      e.key  ==="-" || 
      e.key ==="." ||
      e.key=== "+" ||
      e.key==="e" || 
      e.key=== "E" ||
      e.key === "ArrowDown" ||  // Arrow Down
      e.key === "ArrowUp" ) {
      e.preventDefault(); // Block the key press
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form
    const formErrors = validateForm(); 
    // If no errors, proceed to handle the data
    if (Object.keys(formErrors).length === 0) {
      const payload={
         type: "ACCOUNTDETAILS",
         ...formInput
      } 
      setIsSubmit(true);
      dispatch(
        addBank({
          data: payload, 
        callback: (data)=>{
          if(data.meta.code===200){
           dispatch( getBank({
            callback: (data) => {
            setBankList(data?.data);
          },}))
            handleClear();
          }
        }}));
        handleClear();
        setIsSubmit(false);
    } else {
      setErrors(formErrors);
    }
  };


    
const handleClear = () => {
  // Reset form input fields
  setFormInput({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountType: "saving"
  });
  
  // Reset form submission status and validation errors
  setIsSubmit(false);
  setErrors({});
};

const HandleUPIIdSubmission=()=>{
  
  if(!upiId){
    setUpiError("Field Cant Be Empty");
    return;
  }
  if(upiId.length>100){
    setUpiError("Cant Accept More than 100 characters");
    return;
  }
 
  const payload={
    type: "UPIID",
    upiId:upiId
    
 }
  setIsSubmit(true);
      dispatch(
        addBank({
          data: payload, 
        callback: (data)=>{
          if(data.meta.code){
            handleClear();
            setUpiId("")
          }else{
            handleClear();
            setUpiId("")
          }
         dispatch( getBank({
          callback: (data) => {
            if(data.meta.code===200){
              setBankList(data?.data);
            } 
        },}))
        }}));
    setIsSubmit(false);       
}
    const EnterUPI=(e)=>{
      if(upiError){
        setUpiError("");
      }
      setUpiId(e.target.value);
    }
  

  return (
    
      <Card>
        <Form onSubmit={handleSubmit}>
        <CardBody>
        
          <Row>
            {/* Account Number */}
            <Col md="4 mb-3">
              <Label className="col-form-label py-0" htmlFor="accountNumber">
                Account Number
              </Label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter account number"
                value={formInput.accountNumber}
                onChange={(e) => setFormInput({
                  ...formInput,
                  accountNumber: e.target.value
                })}
                onKeyDown={handleKeyDown}
              />
              <span className="text-danger">{errors.accountNumber}</span>
            </Col>

            {/* Account Name */}
            <Col md="4 mb-3">
              <Label className="col-form-label py-0" htmlFor="accountName">
                Account Name
              </Label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter account name"
                value={formInput.accountName}
                onChange={(e) => setFormInput({
                  ...formInput,
                  accountName: e.target.value
                })}
              />
              <span className="text-danger">{errors.accountName}</span>
            </Col>

            {/* Bank Name */}
            <Col md="4 mb-3">
              <Label className="col-form-label py-0" htmlFor="bankName">
                Bank Name
              </Label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter bank name"
                value={formInput.bankName}
                onChange={(e) => setFormInput({
                  ...formInput,
                  bankName: e.target.value
                })}
              />
              <span className="text-danger">{errors.bankName}</span>
            </Col>

            {/* IFSC Code */}
            <Col md="4 mb-3">
              <Label className="col-form-label py-0" htmlFor="ifscCode">
                IFSC Code
              </Label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter IFSC code"
                value={formInput.ifscCode}
                onChange={(e) => setFormInput({
                  ...formInput,
                  ifscCode: e.target.value
                })}
              />
              <span className="text-danger">{errors.ifscCode}</span>
            </Col>

            {/* Account Type */}
            <Col md="4 mb-3">
              <Label className="col-form-label py-0" htmlFor="accountType">
                Account Type
              </Label>
              <select
                className="form-control"
                value={formInput.accountType}
                onChange={(e) => setFormInput({
                  ...formInput,
                  accountType: e.target.value
                })}
              >
                <option value="saving">Saving</option>
                <option value="current">Current</option>
              </select>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Button
            type="submit"
            color="success"
            disabled={isSubmit}
          >
            {t("UPLOAD")}
          </Button>
          <Button
            className="ms-2"
            style={{ backgroundColor: "#CCC" }}
            onClick={handleClear}
          >
            {t("RESET")}
          </Button>
        </CardFooter>
        </Form>
        <div className="d-flex align-items-center justify-content-center"><p>OR</p></div>
        <div className=" d-flex p-4">
        
            <Col md="4 mb-3">
              <Label className="col-form-label" htmlFor="ifscCode">
                UPI ID
              </Label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={EnterUPI}
              />
              <p className="text-danger mt-3">{upiError}</p>
              <button className=" btn-success "
              disabled={isSubmit}
              style={{
                border: "none", 
                borderRadius: "8px", 
                padding: "12px 30px" ,
                color: "white"
              }} 
              onClick={HandleUPIIdSubmission}>Add UPI ID</button>
            </Col>
            
        </div>
      </Card>
    
  );
};

export default BankAccountForm;
