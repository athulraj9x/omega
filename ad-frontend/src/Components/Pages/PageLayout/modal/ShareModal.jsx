import React, { useState } from 'react';
import { Modal, Button, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'reactstrap';
import ToggleButton from '../../../Common/Component/Buttons/ToggleButton';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { addWithdrawal, postDeposit } from '../../../../redux/action';

const ShareModal = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={props.toggler}
        centered
        size={props.size}
        className=''
      >
        <Modal.Header closeButton className='px-1 text-dark' color='light dark'>
          <Modal.Title className='fs-6 text-uppercase'>{props.title} {""} <span className='text-primary'>dfht</span></Modal.Title>
        </Modal.Header>
        <hr className='m-0 border border-[#a1a1a1] opacity-25' />
        <Modal.Body className={`${props.bodyClass}  p-0`}>


          <div>
            <table responsive className="table table-bordered table-hover p-0  ">
              <thead className="table-light">
                <tr className="text-left">
                  <th >{t("GAME")}</th>
                  <th>{t("SHARES")}</th>
                </tr>
              </thead>
              <tbody className='text-dark '>
                <tr className='fw-semibold'>
                  <td>
                    <Col>{t("SPORTS")}</Col>
                  </td>
                  <td>
                    <Col>{props.modalData?.sportShares ? props.modalData?.sportShares : 0}%</Col>
                  </td>
                </tr>
                <tr className='fw-semibold'>
                  <td>
                    <Col>{t("LIVE_CASINO")}</Col>
                  </td>
                  <td className='fw-2'>
                    <Col>{props.modalData?.casinoShares ? props.modalData?.casinoShares : 0}%</Col>
                  </td>
                </tr>
                <tr className='fw-semibold'>
                  <td>
                    <Col>{t("TEEN_PATTI")}</Col>
                  </td>
                  <td className='fw-2'>
                    <Col>0 %</Col>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal >
    </>
  )

}

export default ShareModal