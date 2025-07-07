import React from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { Badges, H4 } from '../../../../AbstractElements';
import SvgIcon from '../SvgIcon';
import { useSelector } from 'react-redux';
import { getBankingData, getLayers, getUserExposure, addPermission } from "../../../../redux/action";
import { Actions, PAGINATION, layerRoles, NoDataFound } from "../../../../Constant";

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import DepositModal from '../../../Pages/PageLayout/modal/DepositModal';
import CreditReference from '../../../Pages/PageLayout/users/CreditReference';
import ShareModal from '../../../Pages/PageLayout/modal/ShareModal';
import SettlementAmountModal from '../../../Pages/PageLayout/modal/SettlementAmountModal';
import SettlementHistoryModal from '../../../Pages/PageLayout/modal/SettlementHistoryModal';
import { Loader } from 'react-bootstrap-typeahead';
import { t } from 'i18next';


const BankingCard = ({
  data,
  exp,
  index,
  names,
  username,
  creditReference,
  _id,
  balance,
  mobileNo,
  sportShares,
  casinoShares,
  role }) => {
  const dispatch = useDispatch();
  const [depositModal, setdepositModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [modalData, setModaldata] = useState({});
  const [sharesModal, setSharesModal] = useState(false);
  const [settlementAmountModal, setsettlementAmountModal] = useState(false);
  const [settlementHistoryModal, setsettlementHistoryModal] = useState(false);
  const [userExposure, setUserExposure] = useState({});

  const handleDeposit = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId, type: "deposit" });
    setdepositModal(true);
  };
  const handleWidrawal = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId, type: "withdrawl" });
    setWithdrawalModal(true);
  };
  const handleShares = (sportShares, casinoShares) => {
    setModaldata({ sportShares, casinoShares });

    setSharesModal(true);
  };
  const handleSettlementAmountModal = (
    balance,
    mobile,
    userId,
    username,
    settlement
  ) => {
    setModaldata({ balance, mobile, userId, username, settlement });
    setsettlementAmountModal(true);
  };
  const handleSettlementHistoryModal = (balance, mobile, userId) => {
    setModaldata({ balance, mobile, userId });
    setsettlementHistoryModal(true);
  };

  useEffect(() => {
    dispatch(
      getUserExposure({
        callback: (data) => {
          setUserExposure(data);
        },
      })
    );
  }, []);


  const bankingData = useSelector((state) => state?.GetBankingData?.bankingData?.data);
  const loading = useSelector((state) => state?.GetBankingData?.loading);


  return (
    <>
      <Card className='widget-1'>
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        )}


        <CardBody className='p-0'>
          <div className='widget-content flex-grow-1 overflow-auto w-100'>
            <table className='table table-bordered'>
              <tbody>
                <tr className="text-left align-middle py-2" key={index}>
                  <td style={{ width: '12rem', minWidth: '11rem' }} className=" py-2">
                    <div className="name align-middle d-flex">
                      <span>
                        <Badges
                          attrBadge={{
                            color: `${role === layerRoles?.USER
                              ? "success"
                              : "info"
                              }`,
                          }}
                        >
                          {` ${role === layerRoles?.USER
                            ? "U"
                            : role === layerRoles?.AGENT
                              ? "AG"
                              : role === layerRoles?.MASTER
                                ? "MS"
                                : role === layerRoles?.SUPER_MASTER
                                  ? "SM"
                                  : role === layerRoles?.ADMIN
                                    ? "AD"
                                    : "SA"
                            }`}
                        </Badges>
                      </span>

                      {data.role === layerRoles?.USER ? (
                        <span className="ms-2 text-nowrap">
                          {names}
                        </span>
                      ) : (
                        <Link
                          className="ms-2 text-nowrap text-dark"
                          to={`/users/${_id}/${role}`}
                        >
                          {names}
                        </Link>
                      )}
                    </div>
                  </td>
                  <td style={{ width: '8rem', minWidth: '7rem' }} className="align-middle py-2">{username}</td>
                  <td style={{ width: '16 rem', minWidth: '12rem' }} className="align-middle py-2">
                    <CreditReference
                      defaultValue={creditReference}
                      userId={_id}
                    />
                  </td>
                  <td style={{ width: '10rem', minWidth: '8rem' }} className="align-middle py-2">{balance}</td>
                  {/* {/ <td className="align-middle py-1">{data?.credit}</td> /} */}

                  <td style={{ width: '4rem' }} className="py-2  ">
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      <Button
                        onClick={() =>
                          handleDeposit(
                            balance,
                            mobileNo,
                            _id
                          )
                        }
                        className="px-2 py-1"
                        color="success"
                      >
                        D
                      </Button>

                      <Button
                        onClick={() =>
                          handleWidrawal(
                            balance,
                            mobileNo,
                            _id
                          )
                        }
                        className="px-2 py-1"
                        color="primary"
                      >
                        W
                      </Button>
                    </div>
                  </td>
                  <td style={{ width: '10rem', minWidth: '6rem' }}> {balance - creditReference}</td>
                  <td style={{ width: '10rem' }}> {exp?.exposure ? exp?.exposure : 0} </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      <button
                        className="settlement-btn btn  px-3 py-2 border border-success bg-light h-25 w-100 "
                        onClick={() =>
                          handleSettlementAmountModal(
                            balance,
                            mobileNo,
                            _id,
                            username,
                            balance - creditReference
                          )
                        }
                      >
                        {balance - creditReference}
                      </button>
                      <button
                        className="settlement-history-btn btn px-3 py-2 border border-success bg-light h-25"
                        onClick={() =>
                          handleSettlementHistoryModal(
                            balance,
                            mobileNo,
                            _id
                          )
                        }
                      >
                        H
                      </button>
                    </div>
                  </td>
                  <td className="py-2 ">
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      <Button
                        onClick={() =>
                          handleShares(
                            sportShares,
                            casinoShares
                          )
                        }
                        className="px-2 py-1 h-25"
                        color="success"
                      >
                        S
                      </Button>

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      {
        depositModal && (
          <DepositModal
            isOpen={depositModal}
            title={"DEPOSIT OF"}
            toggler={setdepositModal}
            modalData={modalData}
            deposit={true}
            size="md"
          />
        )
      }
      {
        withdrawalModal && (
          <DepositModal
            isOpen={withdrawalModal}
            title={"WITHDRAWAL OF"}
            toggler={setWithdrawalModal}
            modalData={modalData}
            deposit={false}
            size="md"
          />
        )
      }
      {
        sharesModal && (
          <ShareModal
            isOpen={sharesModal}
            title={"Shares "}
            toggler={setSharesModal}
            modalData={modalData}
            size="md"
          />
        )
      }
      {settlementAmountModal && (
        <SettlementAmountModal
          isOpen={settlementAmountModal}
          title={"Permissions OF "}
          toggler={setsettlementAmountModal}
          modalData={modalData}
          size="md"
        />
      )}
      {settlementHistoryModal && (
        <SettlementHistoryModal
          isOpen={settlementHistoryModal}
          title={"Permissions OF "}
          toggler={setsettlementHistoryModal}
          modalData={modalData}
          size="md"
        />
      )}
    </>
  );
};

export default BankingCard;
