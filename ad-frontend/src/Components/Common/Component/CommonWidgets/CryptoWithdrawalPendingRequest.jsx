import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CryptoPendingWithdrawalRequestComponent = ({ whiteLabelData, data }) => {
    const { t } = useTranslation();
    const shouldRender = whiteLabelData?.some(
        (item) =>
            item.whiteLabelType === "B2C"
            &&
            item.whiteLabelBankServices &&
            ["Bank/Crypto", "Crypto"].includes(item.whiteLabelBankServices)
    ) && data?.cryptoPending > 0;

    if (!shouldRender) return null;

    return (
        <div>
            <Link to={"/crypto-withdrawal-list"}>
                <>
                    <h4 className="fs-2" style={{ color: data?.title.includes("Withdrawal") ? "red" : "green" }}>
                        {data?.cryptoPending}
                    </h4>
                    <span className="f-light fs-6">{t("Crypto Pending")}</span>
                </>
            </Link>
        </div>
    );
};

export default CryptoPendingWithdrawalRequestComponent;
