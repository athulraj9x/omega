import React, { Fragment, useEffect, useState } from "react";
import {
  convertToExcelDynamicFunction,
  notifySuccess,
  notifyWarning,
  toTitleCase,
} from "../../../../utils/helper";
import { clientSettlement } from "../../../../redux/action";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { ExcelPreview } from "./ExcelPreview";

const ClientSettlementPreview = ({
  toggler,
  setShowReviewGroupModal,
  data,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [currentView, setCurrentView] = useState("preview");
  const [currentGroupView, setCurrentGroupView] = useState("");

  const [groupedUsers, setGroupedUsers] = useState([]);
  const [indexOne, setIndexOne] = useState(null);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [excelViewToggle, setExcelViewToggle] = useState(false);
  const [excelViewData, setExcelViewData] = useState([]);

  const switchToPreview = () => {
    setCurrentView("preview");
  };

  const processData = (data) => {
    const result = Object.keys(data).map((groupName) => {
      const groupArray = data[groupName];
      const length = groupArray?.length;

      return {
        groupName,
        length,
        members: groupArray,
      };
    });
    result.sort((a, b) => b?.length - a?.length);

    return result;
  };

  useEffect(() => {
    if (data) {
      const groupedUsers = processData(data);
      setGroupedUsers(groupedUsers);
    }
  }, [data]);

  const selectIndex = (index) => {
    if (index === indexOne) {
      setIndexOne(null);
    } else {
      setIndexOne(index);
    }
  };

  const clientSettlementLayerReview = (e, groupName, data) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentGroupView(groupName);
    setExcelViewToggle(true);

    if (data && data?.members?.length) {
      const selectedIdsClientSettlement = data.members.map((item) => {
        return {
          id: item?._id,
          currency: item?.currencyData,
          clientBalance: item?.clientBalance,
          clientPl:
            (item?.balance || 0) +
            (item?.clientBalance || 0) -
            item?.creditReference,
        };
      });

      if (selectedIdsClientSettlement?.length > 0) {
        dispatch(
          clientSettlement({
            review: true,
            title: groupName ? groupName : "Preview Sheet",
            settlementIds: selectedIdsClientSettlement,
            callback: (data) => {
              if (data?.meta?.code === 200 && data?.data !== null) {
                setExcelViewData(data.data);
                setCurrentView("excel");
                return;
              }
            },
          })
        );

        // setLoading(true);
      } else {
        notifyWarning(t("SELECT_CLIENTS"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      notifyWarning(t("NO CHILD MEMBERS"), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const clientSettlementLayer = (e, groupName, data) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedIdsClientSettlement = data.members.map((item) => {
      return {
        id: item?._id,
        currency: item?.currencyData,
        clientBalance: item?.clientBalance,
        clientPl:
          (item?.balance || 0) +
          (item?.clientBalance || 0) -
          item?.creditReference,
      };
    });

    if (selectedIdsClientSettlement?.length > 0) {
      if (groupName?.length > 0 && selectedIdsClientSettlement?.length > 0) {
        dispatch(
          clientSettlement({
            title: groupName ? groupName : "GROUPED CLIENT PL",
            settlementIds: selectedIdsClientSettlement,
            callback: (data) => {
              if (data?.meta?.code === 200) {
                if (data?.data?.noBalance) {
                  notifySuccess(
                    "The client settlement Excel sheet has been created, except for a few clients whose balance might be less than the client PL.",
                    {
                      position: toast.POSITION.BOTTOM_CENTER,
                      delayTime: 7000, // Delay time in milliseconds
                    }
                  );
                } else {
                  notifySuccess(
                    "Client settlement excelsheet has been created.",
                    {
                      position: toast.POSITION.BOTTOM_CENTER,
                    }
                  );
                }
              }

              if (data?.data?.download_link !== "") {
                saveAs(data?.data?.download_link, `${groupName}.xlsx`);
              }

              // setSelectedIdsClientSettlement([]);
              // setSelectedIds([]);
              // dispatch(
              //   getLayers({
              //     buildTreeFrom: currentClickedUser,
              //     search: searchText,
              //     userType: 1,
              //     selectedCurrency: selectedCurrency.value,
              //     perPage: rowCount,
              //     page: currentPage,
              //     callback: (data) => {
              //       setLayerData(data);
              //       setLatestCreatedBy(data?.meta?.adminData?.username);
              //       // setCurrentUserDetails(data?.meta?.adminData);
              //       setTotalPages(data?.meta?.totalPages);
              //       setCurrentCurrencies(data?.meta.currencies);
              //     },
              //   })
              // );
            },
          })
        );
      } else {
        notifyWarning(t("TITLE_DESCRIPTION"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        // setExcelSheetTitle("");
      }
      // setLoading(true);
    } else {
      notifyWarning(t("SELECT_CLIENTS"), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      // setExcelSheetTitle("");
    }
  };

  const selectMember = (index) => {
    if (index === selectedMemberIndex) {
      setSelectedMemberIndex(null);
    } else {
      setSelectedMemberIndex(index);
    }
  };

  const convertToExcel = (groupName, data) => {
    convertToExcelDynamicFunction(`${groupName} Sheet`, data, groupName);
  };

  return (
    <div>
      {toggler && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 1040,
          }}
          className="modal fade show d-block"
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentView === "preview"
                    ? t("Users By Group")
                    : t("Group View")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReviewGroupModal(false)}
                ></button>
              </div>
              <div>
                {currentView === "preview" ? (
                  <div className="flipped-content">
                    <PreviewContent
                      data={groupedUsers}
                      toggler={toggler}
                      setShowReviewGroupModal={setShowReviewGroupModal}
                      selectIndex={selectIndex}
                      indexOne={indexOne}
                      selectedMemberIndex={selectedMemberIndex}
                      clientSettlementLayerReview={clientSettlementLayerReview}
                      selectMember={selectMember}
                      clientSettlementLayer={clientSettlementLayer}
                      excelViewToggle={excelViewToggle}
                    />
                  </div>
                ) : (
                  <div className="unflipped-content">
                    <ExcelPreview
                      data={excelViewData}
                      onBack={switchToPreview}
                      groupName={currentGroupView}
                      groupPreview = {true}
                      convertToExcel={convertToExcel}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewContent = ({
  onSwitchToExcel,
  data,
  toggler,
  setShowReviewGroupModal,
  selectIndex,
  indexOne,
  selectedMemberIndex,
  clientSettlementLayerReview,
  selectMember,
  clientSettlementLayer,
  excelViewToggle,
}) => {
  return (
    <>
      <div className="container mt-5">
        {/* Modal */}
        {toggler && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)", // Apply blur effect
              zIndex: 1040,
            }}
            className="modal fade show d-block"
          >
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Users By Group</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReviewGroupModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sl. No</th>
                        <th>Group Name</th>
                        <th>Users Count</th>
                        <th>Group Preview</th>
                        <th>Client Settlement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => selectIndex(index)}
                            >
                              {row?.groupName}
                            </span>
                            {indexOne === index && (
                              <ul
                                key={index}
                                style={{
                                  listStyleType: "disc",
                                  paddingLeft: "20px",
                                  cursor: "pointer",
                                }}
                              >
                                {row?.members?.map((user, userIndex) => (
                                  <li
                                    className="mt-1"
                                    key={userIndex}
                                    onClick={() => selectMember(userIndex)}
                                  >
                                    <span className="border">
                                      <span
                                        className="text-md p-2"
                                        style={{
                                          listStyleType: "disc",
                                          padding: "20px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {toTitleCase(user?.username)}
                                      </span>
                                    </span>

                                    {selectedMemberIndex === userIndex &&
                                      user?.children?.length > 0 && (
                                        <ul
                                          className="mt-1"
                                          style={{
                                            listStyleType: "circle",
                                            paddingLeft: "20px",
                                          }}
                                        >
                                          {user.children.map(
                                            (child, childIndex) => (
                                              <li key={childIndex}>
                                                {toTitleCase(child.username)}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                          <td>{row?.length}</td>
                          <td>
                            <button
                              className="btn btn-outline-success justify-content-center p-2 m-2"
                              onClick={(e) =>
                                clientSettlementLayerReview(
                                  e,
                                  row?.groupName,
                                  row
                                )
                              }
                            >
                              Group Settlement preview
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger justify-content-center p-2 m-2"
                              onClick={(e) =>
                                clientSettlementLayer(e, row?.groupName, row)
                              }
                            >
                              Client Settlement
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowReviewGroupModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientSettlementPreview;
