import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  getSportsDataWithPriority,
  setSportsPriority,
} from "../../../../redux/action";
import { Breadcrumbs } from "../../../../AbstractElements";
import usePageTitle from "../../../../Hooks/usePageTitle";
import { Button, Input, Label, Media } from "reactstrap";
import { FaEdit } from "react-icons/fa";
import LoaderAnimation from "./LoaderAnimation";
import { IoMdCloseCircle } from "react-icons/io";
import { MdDoneOutline } from "react-icons/md";
import ManageLeagueAccordingly from "./ManageLeagueAccordingly";

const SportsPriorityManager = () => {
  const title = usePageTitle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  const [sportsId, setsportsId] = useState(null);
  const [handleManageEventToggle, setHandleManageEventToggle] = useState(false);

  const [initialPrioritySportsData, setInitialPrioritySportsData] =
    useState(null);
  const [initialPrioritySportsDataError, setInitialPrioritySportsDataError] =
    useState(null);

  const toggleDateUpdated = () => {
    setDataUpdated(!dataUpdated);
    return;
  };
  const handleManageLeague = (id) => {
    setsportsId(id);
    setHandleManageEventToggle(true)
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(
        getSportsDataWithPriority({
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
  }, []);

  // useEffect(() => {
  // let arr = allSportsData?.sportsData?.slice().sort((a, b) => {
  //   const priorityA = SportPriority[a.slugName] || 9999;
  //   const priorityB = SportPriority[b.slugName] || 9999;
  //   return priorityA - priorityB || a.slugName.localeCompare(b.slugName);
  // });
  // setSportData(arr);
  // }, [allSportsData]);
  // const [prioritySportData, setPrioritySportData] = useState([]);
  // const handleToggle = (sportsId) => {

  //   let arr = [];
  //   sportData.forEach((element) => {
  //     if (element._id === sportsId) {
  //       arr.push(element);
  //     }
  //   });

  //   setPrioritySportData([...new Set([...prioritySportData, ...arr])]);
  // };

  useEffect(() => {
    setInputValues(Array(sportData?.length).fill(""));
    setIndexErrors(Array(sportData?.length).fill(false));
    setDisableBasedOnError(Array(sportData?.length).fill(false));
    setInputBoxEditable(Array(sportData?.length).fill(false));
    setErrors(Array(sportData?.length).fill({ index: -1, message: "" }));

    const sportPriorities = sportData?.map(
      (sport) => sport?.homeView?.priority
    );
    setInitialPrioritySportsData(sportPriorities);
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

  const handleEditToggle = (event, index, sportsId, currentStatus) => {
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
        id: sportsId,
      };

      dispatch(
        setSportsPriority({
          data: requestBody,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              dispatch(
                getSportsDataWithPriority({
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
        })
      );
    }

    setValidatingIndex(null);
    setValidatingLoading(false);
  };

  const handleToggle = (event, index, sportsId, currentStatus) => {
    setValidatingIndex(index);
    setValidatingLoading(true);
    if (inputValues[index] === "") {
      const newErrors = [...errors];
      newErrors[index] = true;
      setErrors(newErrors);

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
        status: !currentStatus,
        priority: newInputValues,
        id: sportsId,
      };

      dispatch(
        setSportsPriority({
          data: requestBody,
          callback: (data) => {
            if (data?.meta?.code === 200) {
              dispatch(
                getSportsDataWithPriority({
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
        })
      );
    }
    setTimeout(() => {
      setValidatingIndex(null);
      setValidatingLoading(false);
    }, 800);
  };

  const handleInputChange = (event, index) => {
    // setFocusIndex(index);

    // IF THE VALUE IS GREATER THEN TOTAL SPORTS COUNT
    // WILL RETURN THIS MESSAGE WITH SPORTS COUNT
    if (event.target.value > sportData?.length) {
      setFocusErrorIndex(index);
      const newErrors = [...errors];
      newErrors[index] = {
        index: index,
        message: `Total Sports count is ${sportData?.length}`,
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


  const handleToogleClose = () => {
    setHandleManageEventToggle(false)
    setsportsId(null)
  }

  return (
    // <div className="container mt-4">
    //   <Fragment>
    //     <Breadcrumbs
    //       className="mt-4"
    //       mainTitle={t("SPORTS MANAGEMENT TABLE")}
    //       title={title?.title}
    //       parent={title?.parent}
    //     />
    //     <div className="row g-2">
    //       {isLoading ? (
    //         <div className="col-6 col-sm-4 col-md-2">
    //           <div className="card">
    //             <div className="card-header cardBg p-2 mb-3 text-center border-0">
    //               <LoaderAnimation />
    //             </div>
    //             <div className="border p-1 rounded card-body border-0">
    //               <Media
    //                 body
    //                 className={`d-flex flex-column align-items-center justify-content-end`}
    //               >
    //                 <p>&nbsp;</p>
    //               </Media>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         sportData?.map((item, index) => (
    //           <div class="col-6 col-sm-4 col-md-2">
    //             <div className="card">
    //               <>
    //                 <div className="card-header cardBg p-2 mb-3 text-center border-0">
    //                   {validatingIndex === index &&
    //                   validatingLoading === true ? (
    //                     <LoaderAnimation />
    //                   ) : (
    //                     <>
    //                       <img
    //                         src={require(`../../../../assets/images/sports-icons/${item.slugName}.png`)}
    //                         className="iconCard-img p-md-1  p-lg-2 p-1 "
    //                         alt={item.iconName}
    //                       />
    //                       <p
    //                         className="text-center p-0 m-0"
    //                         style={{ fontSize: "13px" }}
    //                       >
    //                         {item.name}
    //                       </p>
    //                     </>
    //                   )}
    //                 </div>

    //                 <div className="border p-1 rounded card-body border-0">
    //                   <Media
    //                     body
    //                     className={`d-flex flex-column align-items-center justify-content-end`}
    //                   >
    //                     {item?.homeView?.priority ? (
    //                       <>
    //                         <div className="d-flex">
    //                           <p className="text-dark m-0">
    //                             Priority {item?.homeView?.priority}
    //                           </p>

    //                           <FaEdit
    //                             onClick={() =>
    //                               handleEdit(
    //                                 index,
    //                                 item?.homeView?.priority,
    //                                 item?.homeView?.status
    //                               )
    //                             }
    //                             style={{
    //                               marginLeft: "5px",
    //                               cursor: "pointer",
    //                             }}
    //                             size={24}
    //                           />
    //                         </div>
    //                       </>
    //                     ) : (
    //                       <p>
    //                       {/* <p className="text-dark m-0">
    //                       Priority
    //                     </p>  */}
    //                     &nbsp;</p>
    //                     )}
    //                     {((toogleButton === index &&
    //                       focusErrorIndex !== index) ||
    //                       item?.homeView?.status === true) && (
    //                       <Label className={`m-0 card-switch`}>
    //                         <Input
    //                           type="checkbox"
    //                           checked={item?.homeView?.status}
    //                           onChange={(event) =>
    //                             handleToggle(
    //                               event,
    //                               index,
    //                               item._id,
    //                               item?.homeView?.status
    //                             )
    //                           }
    //                           disabled={false}
    //                         />
    //                         <span className="switch-state" />
    //                       </Label>
    //                     )}

    //                     {/* {item?.homeView?.status === true && (
    //                     <Label className={`m-0 card-switch`}>
    //                       <Input
    //                         type="checkbox"
    //                         defaultChecked={item.homeView?.status}
    //                         checked={disableBasedOnError[index]}
    //                         onChange={(event) =>
    //                           handleCurrentToggle(event,index, item.id,item?.homeView?.status)
    //                         }
    //                         disabled={disableBasedOnError[index]}
    //                       />
    //                       <span className="switch-state" />
    //                     </Label>
    //                   )} */}
    //                   </Media>
    //                 </div>

    //                 <div
    //                   className="card-footer border-0 pt-0"
    //                   style={{ marginTop: "0" }}
    //                 >
    //                   {(item?.homeView?.priority === undefined ||
    //                     inputBoxEditable[index] === true) && (
    //                     <div>
    //                       {inputBoxEditable[index] === true && (
    //                         <div
    //                           style={{
    //                             marginLeft: "20px",
    //                             cursor: "pointer",
    //                             position: "relative",
    //                           }}
    //                           className="d-flex justify-content-end"
    //                         >
    //                           <MdDoneOutline
    //                             onClick={(event) =>
    //                               handleEditToggle(
    //                                 event,
    //                                 index,
    //                                 item._id,
    //                                 item?.homeView?.status
    //                               )
    //                             }
    //                             size={24}
    //                           />

    //                           <IoMdCloseCircle
    //                             onClick={() => setInputBoxEditable(false)}
    //                             size={24}
    //                           />
    //                         </div>
    //                       )}
    //                       <Input
    //                         className={`border ${
    //                           indexError[index] ? "border-3 border-danger" : ""
    //                         }`}
    //                         type="number"
    //                         value={inputValues[index] || ""}
    //                         onChange={(e) => handleInputChange(e, index)}
    //                         maxLength={sportData?.length}
    //                       />

    //                       {errors[index] && (
    //                         <div className="error-message text-danger">
    //                           {errors[index].message}
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 </div>
    //               </>
    //             </div>
    //           </div>
    //         ))
    //       )}
    //     </div>
    //   </Fragment>
    // </div>
    <div className="container mt-4">
      <Fragment>
        <Breadcrumbs
          className="mt-4"
          mainTitle={t("SPORTS MANAGEMENT TABLE")}
          title={title?.title}
          parent={title?.parent}
        />
        <div className="row g-2">
          {sportData?.map((item, index) => (
            <div
              className="col-6 col-sm-4 col-md-2"
              style={{
                animation: `cardFadeIn 0.5s ease-out ${index * 0.2}s forwards`,
              }}
            >
              <div
                className="card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="card-header cardBg p-2 mb-3 text-center border-0">
                  {isLoading ? (
                    <LoaderAnimation />
                  ) : (
                    <>
                      <img
                        src={require(`../../../../assets/images/sports-icons/${item.slugName}.png`)}
                        className="iconCard-img p-md-1 p-lg-2 p-1"
                        alt={item.iconName}
                      />
                      <p
                        className="text-center p-0 m-0"
                        style={{ fontSize: "13px" }}
                      >
                        {item.name}
                      </p>
                    </>
                  )}
                </div>

                <div className="border p-1 rounded card-body border-0">
                  <Media
                    body
                    className={`d-flex flex-column align-items-center justify-content-end`}
                  >
                    {item?.homeView?.priority ? (
                      <div className="d-flex">
                        <p className="text-dark m-0">
                          Priority {item?.homeView?.priority}
                        </p>
                        <FaEdit
                          onClick={() =>
                            handleEdit(
                              index,
                              item?.homeView?.priority,
                              item?.homeView?.status
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
                      item?.homeView?.status === true) && (
                      <>
                        <Label className={`m-0 card-switch`}>
                          <Input
                            type="checkbox"
                            defaultChecked={item?.homeView?.status}
                            onChange={(event) =>
                              handleToggle(
                                event,
                                index,
                                item._id,
                                item?.homeView?.status
                              )
                            }
                            disabled={false}
                          />
                          <span className="switch-state" />
                        </Label>
                        <Button color="primary mt-2" onClick={()=>handleManageLeague(item._id)} outline>
                          Manage League
                        </Button>
                      </>
                    )}
                  </Media>
                </div>

                <div
                  className="card-footer border-0 pt-0"
                  style={{ marginTop: "0" }}
                >
                  {(item?.homeView?.priority === undefined ||
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
                                item._id,
                                item?.homeView?.status
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
          ))}
        </div>
      </Fragment>


        {handleManageEventToggle &&(     
          <ManageLeagueAccordingly
            id={sportsId}
            isOpen={handleManageEventToggle}
            toggle={handleToogleClose}
          />
        )}
    
    </div>

  );
};

export default SportsPriorityManager;
