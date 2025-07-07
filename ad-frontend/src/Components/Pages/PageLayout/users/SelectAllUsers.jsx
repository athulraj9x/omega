import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLayers } from "../../../../redux/action";
import "./style.css";
import { notifySuccess, notifyWarning } from "../../../../utils/helper";

const SelectAllUsers = ({
  currentClickedUser,
  setLoading,
  selectAllUsers,
  setSelectAllUsers,
  setSelectedIdsClientSettlement,
}) => {
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (event) => {
    const randomNumber = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    const isChecked = event.target.checked;

    if (isChecked) {
      setLoading(true);
      notifyWarning("Entire users are selecting...");
      setTimeout(() => {
        setSelectAll(isChecked);
        dispatch(
          getLayers({
            buildTreeFrom: currentClickedUser,
            search: "",
            userType: 1,
            selectedCurrency: undefined,
            perPage: null,
            page: null,
            allUsers: true,
            callback: (data) => {
              setLoading(false);
              if (data?.data?.length) {
                const selectedIdsClientSettlement = data?.data[0].map(
                  (item) => {
                    return {
                      id: item?._id,
                      currency: item?.currencyData,
                      clientBalance: item?.clientBalance,
                      clientPl:
                        (item?.balance || 0) +
                        (item?.clientBalance || 0) -
                        item?.creditReference,
                    };
                  }
                );
                notifySuccess(
                  `Entire users ${
                    selectedIdsClientSettlement?.length || 0
                  } are selected...`
                );
                setSelectedIdsClientSettlement([]);
                setSelectAllUsers(selectedIdsClientSettlement);
              }
            },
          })
        );
      }, randomNumber);
    } else {
      setSelectAllUsers([]);
    }
  };

  useEffect(() => {
    const flag = selectAllUsers?.length > 0;
    setSelectAll(flag);
  }, [selectAllUsers]);

  return (
    <div style={{ margin: "0", display: "inline-block" }}>
      <span className="text-dark pointer path-text">Select All Users</span>
      <label className="container-custom123 d-flex">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
        <div className="checkmark-custom123"></div>
        {selectAllUsers?.length > 0 && (
          <span style={{ fontSize: "15px" }}>
            Count : {selectAllUsers?.length}
          </span>
        )}
      </label>
    </div>
  );
};

export default SelectAllUsers;
