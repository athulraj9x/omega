import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
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

const ListBankAccount = ({ bankList, openDeleteModal }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 1500); 
    };
    return (
        <div
            className="overflow-auto"
            style={{
                maxHeight: "550px",
                overflowY: "auto",
            }}
        >
            {bankList?.length > 0 ? (
                bankList.map((bank_data, index) => (
                    <Card key={index} className="px-2">
                        <CardBody>
                            <Row className="d-flex flex-column">
                                <Col md="4 font-bold">
                                    <h1>{bank_data?.accountName || "UPI"}</h1>
                                </Col>
                                {bank_data?.imageUrl && (
                                    <Col md="4 mb-3">
                                        <img
                                            src={bank_data?.imageUrl}
                                            alt="Preview"
                                            style={{
                                                maxWidth: "100%",
                                                height: "250px",
                                                width: "250px",
                                                border: "10px solid #ccc",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </Col>
                                )}
                                {bank_data.accountNumber && (
                                    <Col md="4 mb-3 font-bold">
                                        <p>{bank_data.accountNumber}</p>
                                    </Col>
                                )}
                                {bank_data.upiId && (
                                    <Col md="4 mb-3 font-bold">
                                        <p>{bank_data.upiId}</p>
                                    </Col>
                                )}
                                {(bank_data?.accountType === "wallet" && bank_data?.bankName) && (
                                    <Col md="4 mb-1 font-bold">
                                        <p>Wallet Name : {bank_data?.bankName}</p>
                                    </Col>
                                )}
                                {bank_data?.accountType && (
                                    <Col md="4 mb-1 font-bold">
                                        <p>Account Type: {bank_data?.accountType}</p>
                                    </Col>
                                )}
                                {bank_data?.apiAddress && (
                                    <Col md="4 mb-3 font-bold">
                                        <label>API Address &crarr;</label>
                                        <div
                                            className={`wallet-box ${copied === bank_data._id ? "copied" : ""}`}
                                            onClick={() => copyToClipboard(bank_data.apiAddress, bank_data._id)}
                                            style={{
                                                padding: "10px",
                                                border: "2px solid #ccc",
                                                borderRadius: "5px",
                                                backgroundColor: copied === bank_data._id ? "#d4edda" : "#f8f9fa",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                textAlign: "center",
                                                transition: "background-color 0.3s ease",
                                            }}
                                        >
                                            {copied === bank_data._id ? "Copied!" : bank_data?.apiAddress}
                                        </div>
                                    </Col>
                                )}
                            </Row>
                            <Button onClick={() => openDeleteModal(bank_data._id)}>
                                {t("DELETE")}
                            </Button>
                        </CardBody>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardBody>{t("NO_BANK_DETAILS")}</CardBody>
                </Card>
            )}
        </div>
    );
};

export default ListBankAccount
