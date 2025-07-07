import React, { useEffect, useState ,memo} from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import {
  deleteUserBet,
  getBetStatus,
  resetPassword,
} from "../../../../redux/action";
import {playNotificationSound} from "../../../../utils/helper"


const VoidInvalidModal = memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

   const [betStatus, setBetStatus] = useState("");

  const handleBetStatus = (status) => {
    let data;
    setBetStatus(status);
    if(!status){
      if (props?.modalData?.length > 0) {
        data = { bet: props?.modalData };
      } else {
        let bets = [];
        bets.push(props?.modalData);
        data = { bet: bets };
      }
      dispatch(
        deleteUserBet({
          data,
          callback: (data) => {
            if (data?.meta?.code === 200) {
             props.setBetIds((prev) => [...prev, props?.modalData?._id]);
             props.fn();
             playNotificationSound("delete");
            }
          },
        })
      );
    }
    else{
     data={}
      try
     { data.bet_id = props?.modalData;
    data.status = status;}
    catch(err){
      console.log(err)
    }

    dispatch(
      getBetStatus({
        data,
        callback: (data) => {
          if (data.code === 200) {
            props.setBetIds((prev) => [...prev, props.modalData]);
          }
        },
      })
    );
    }
    props.toggler(false);
  };


  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={props.toggler}
        centered
        size={props.size}
        className=""
      >
        <Modal.Header closeButton className="px-1 text-dark" color="light dark">
          <Modal.Title className="fs-6 ">
            <span>{props.title}</span>
          </Modal.Title>
        </Modal.Header>
        <hr className="m-0 border border-[#a1a1a1] opacity-25" />
        <Modal.Body>
        <Col className="">
            <p>{ props?.betdata?.eventId?.name ? props?.betdata?.eventId?.name+ '  of ' + props?.betdata?.userId?.username : ""}</p>
            </Col>
        </Modal.Body>
        <Modal.Footer className="py-1">
          <Row className="d-flex w-100">
            
            <Col className="d-flex justify-content-end gap-2">
              {props?.typeofBet ==="6" ? <Button
                onClick={() => handleBetStatus()}
                className="rounded w-25 px-3 py-2 text-light justify-content-center m-1"
                color="warning"
              >
                {t("DELETE")}
              </Button> : 
              <>
                 <Button
                onClick={() => handleBetStatus("3")}
                className="rounded w-25 px-3 py-2 text-light justify-content-center m-1"
                color="primary"
              >
                {t("VOID")}
              </Button>
              <Button
                onClick={() => handleBetStatus("4")}
                className="rounded w-25 px-3 py-2 text-light justify-content-center m-1"
                color="warning"
              >
                {t("INVALID")}
              </Button>
              </>
             }
              
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default VoidInvalidModal;
