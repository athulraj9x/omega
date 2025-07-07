import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  getLeagueDataWithPriority,
  setLeaguePriority,
} from "../../../../redux/action";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Button, Input, Label, Media } from "reactstrap";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDoneOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const ManageLeagueAccordingly = (props) => {

  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const [inputbox,setInputBox]=useState(null)

  const [sportData, setSportData] = useState([]);
  const [inputValues, setInputValues] = useState();
  const [errors, setErrors] = useState();
  const [indexError, setIndexErrors] = useState();
  const [toogleButton, setToogleButton] = useState();
  const [focusErrorIndex, setFocusErrorIndex] = useState(null);
  const [disableBasedOnError, setDisableBasedOnError] = useState(null);

  const [inputBoxEditable, setInputBoxEditable] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [validatingLoading, setValidatingLoading] = useState(false);
  const [validatingIndex, setValidatingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [initialPrioritySportsData, setInitialPrioritySportsData] =
    useState(null);
  const [initialPrioritySportsDataError, setInitialPrioritySportsDataError] =
    useState(null);

  const toggleDateUpdated = () => {
    setDataUpdated(!dataUpdated);
    return;
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(
        getLeagueDataWithPriority({
          data: props?.id,
          callback: (data) => {
            if (data) {
              setSportData(data.data);
            }
          },
        })
      );
      setIsLoading(false);
    };
    fetchData();
  }, [props.id]);

  useEffect(() => {
    setInputValues(Array(sportData?.length).fill(""));
    setIndexErrors(Array(sportData?.length).fill(false));
    setDisableBasedOnError(Array(sportData?.length).fill(false));
    setInputBoxEditable(Array(sportData?.length).fill(false));
    setErrors(Array(sportData?.length).fill({ index: -1, message: "" }));

    // const sportPriorities = sportData?.map(
    //   (sport) => sport?.homeView?.priority
    // );
    // setInitialPrioritySportsData(sportPriorities);
  }, [sportData]);

  const handleEdit = (index) => {
    const editIndex = [inputBoxEditable];
    editIndex[index] = true;
    setInputBoxEditable(editIndex);
    return;
  };
  const handleEditOff = (index) => {
    const editIndex = [inputBoxEditable];
    editIndex[index] = false;
    setInputBoxEditable(editIndex);
    return;
  };

  const handleEditToggle = (event, index, sportsId,leagueId, currentStatus) => {
    if (inputValues[index] === "") {
      const updatedErrors = [...errors];
      updatedErrors[index] = { index: index, message: "cannot be Empty" };
      setErrors(updatedErrors);
    } else {
      // Perform toggle action only if input is not empty
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: "",
      };
      setErrors(newErrors);

      const newInputValues = inputValues[index];
      const requestBody = {
        status: currentStatus,
        priority: newInputValues,
        sportId: sportsId,
        leagueId:leagueId
      };

      dispatch(setLeaguePriority({
        data: requestBody,
        callback: (data) => {
          if (data?.meta?.code === 200) {
            dispatch(
              // getLeagueDataWithPriority({
                getLeagueDataWithPriority({
                  data: props?.id,
                callback: (data) => {
                  if (data) {
                    setTimeout(() => {
                      setSportData(data.data);
                      setValidatingLoading(false);
                      setFocusErrorIndex(false);
                      setToogleButton(null);

                      const newInputValues = [null];
                      newInputValues[index] = newInputValues;
                      setInputValues(newInputValues);
                      handleEditOff(index);
                    }, 1000);
                  }
                },
              })
            );
          }
        },
      }));
    }

    setValidatingIndex(null);
    setValidatingLoading(false);
  };

  const handleToggle = (event, index, sportsId,leagueId) => {
    const newInputValues = inputValues[index];
    const requestBody = {
      status: event.target.checked,
      priority: newInputValues,
      sportId: sportsId,
      leagueId:leagueId
    };

    dispatch(setLeaguePriority({
      data: requestBody,
      callback: (data) => {
        if (data?.meta?.code === 200) {
          dispatch(
            getLeagueDataWithPriority({
              data: props?.id,
            // getLeagueDataWithPriority({
              callback: (data) => {
                if (data) {
                  setTimeout(() => {
                    setSportData(data.data);
                    setValidatingLoading(false);
                    setFocusErrorIndex(false);
                    setToogleButton(null);
                    const newInputValues = [null];
                    newInputValues[index] = newInputValues;
                    setInputValues(newInputValues);
                    setValidatingIndex(null);
                    setValidatingLoading(false);
                    handleEditOff(index);
                  }, 1000);
                }
              },
            })
          );
        }
      },
    }));
  }


  const handleInputChange = (event, index) => {
    // setFocusIndex(index);

    // IF THE VALUE IS GREATER THEN TOTAL SPORTS COUNT
    // WILL RETURN THIS MESSAGE WITH SPORTS COUNT
    if (event.target.value > sportData?.leagues?.length) {
      setFocusErrorIndex(index);
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: `Total Sports count is ${sportData?.leagues?.length}`,
      };
      setErrors(newErrors);
      return;
    }

    // VALIDATION IF THE VALUE IS LESSTHEN 1
    // DATA WILL NOT UPDATED THIS WILL RETURN THE VALUE BY SHOWING THIS ERROR MESSAGE
    if (event.target.value < 1) {
      setFocusErrorIndex(index);
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: "Invalid Input",
      };
      setErrors(newErrors);
      const newInputValues = [...inputValues];
      newInputValues[index] = "";
      setInputValues(newInputValues);
      return;
    }

    //CHECK THE USER ENTERED VALUE IS ALREADY EXIST OR NOT
    if (inputValues.includes(event.target.value)) {
      const indexOnError = inputValues.indexOf(event.target.value);
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: `Value is already exist ${indexOnError + 1}`,
      };
      // FINDING INDEX ERROR AND SHOW IN A BORDER FOR FIND EASILY
      const indexErrors = [...indexError];
      indexErrors[indexOnError] = true;

      setFocusErrorIndex(index);
      setIndexErrors(indexErrors);
      setErrors(newErrors);
      return;
    } else {
      setIndexErrors("");
    }

    //CHECK THE USER ENTERED VALUE IS ALREADY EXIST OR NOT
    // Filter out null values from inputValue

    const newInputValues = [null]; //SET PREVIOUS VALUE AS NULL
    newInputValues[index] = event.target.value; // ADD NEW VALUE INTO THE INDEX
    setToogleButton(index);
    setFocusErrorIndex("");
    const newErrors = [...errors];
    newErrors[index] = false;
    setInputValues(newInputValues); //UPDATE THE STATE WITH THE NEW VALUES
    setErrors(newErrors);
  };


  const handleInputBox = (event,index) => {
    if(event.target.value !== null){
      setInputBox(event.target.value)
    }


    if (event.target.value > sportData?.leagues?.length) {
      setFocusErrorIndex(index);
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: `Total Sports count is ${sportData?.leagues?.length}`,
      };
      setErrors(newErrors);
      return;
    }

  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle} size="xl">
    <ModalHeader toggle={props.toggle}>Sports Management</ModalHeader>
    <ModalBody>
      <div className="row">
        {sportData?.leagues?.map((league, index) => (
          <div className="col-md-6 border border-1" key={league._id}>
            <div className="card" style={{ cursor: 'pointer' }} 
            // onClick={() => handleLeagueClick(league)}
            >
              <div className="card-body">
                <h6 className="card-title">{league.name}</h6>
                <p className="card-text">League Code: {league?.leagueCode}</p>
                <p className="card-text">Priority: {league?.homeView?.priority || 'Not setted'}</p>


                <div className="border p-1 rounded card-body border-0">
                  <Media
                    body
                    className={`d-flex flex-column align-leagues-center justify-content-end`}
                  >
                    {league?.homeView?.priority ? (
                      <div className="d-flex">
                        <p className="text-dark m-0">
                          Priority {league?.homeView?.priority}
                        </p>
                        <FaEdit
                          onClick={() =>
                            handleEdit(
                              index,
                              league?.homeView?.priority,
                              league?.homeView?.status
                            )
                          }
                          style={{
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                          size={24}
                        />
                      </div>
                    ) : (
                      <p>&nbsp;</p>
                    )}
                    {((toogleButton === index && focusErrorIndex !== index) ||
                      league?.homeView?.status === true) && (
                      <>
                        <Label className={`m-0 card-switch`}>
                          <Input
                            type="checkbox"
                            defaultChecked={league?.homeView?.status}
                            onChange={(event) =>
                              handleToggle(
                                event,
                                index,
                                props.id,
                                league._id,
                                league?.homeView?.status
                              )
                            }
                            disabled={false}
                          />
                          <span className="switch-state" />
                        </Label>
                      
                      </>
                    )}
                  </Media>
                </div>

                <div
                  className="card-footer border-0 pt-0"
                  style={{ marginTop: "0" }}
                >
                  {(league?.homeView?.priority === undefined ||
                    inputBoxEditable[index] === true) && (
                    <div>
                      {inputBoxEditable[index] === true && (
                        <div
                          style={{
                            marginLeft: "20px",
                            cursor: "pointer",
                            position: "relative",
                          }}
                          className="d-flex justify-content-end"
                        >
                          <MdDoneOutline
                            onClick={(event) =>
                              handleEditToggle(
                                event,
                                index,
                                props.id,
                                league._id,
                                league?.homeView?.status
                              )
                            }
                            size={24}
                          />
                          <IoMdCloseCircle
                            onClick={() => setInputBoxEditable(false)}
                            size={24}
                          />
                        </div>
                      )}
                      
                      <Input
                        className={`border ${
                          indexError[index] ? "border-3 border-danger" : ""
                        }`}
                        type="number"
                        value={inputValues[index] || ""}
                        onChange={(e) => handleInputChange(e, index)}
                        maxLength={sportData?.length}
                      />

                      {errors[index] && (
                        <div className="error-message text-danger">
                          {errors[index].message}
                        </div>
                      )}
                    </div>
                  )}
                </div>



              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalBody>
    <ModalFooter>
      {/* Footer content goes here */}
    </ModalFooter>
  </Modal>
);
};
export default ManageLeagueAccordingly;
