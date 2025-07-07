import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { PAGINATION_ROWS } from "../../../../Constant";
import { useTranslation } from "react-i18next";

const PaginationRow = ({ rowCount, setRowCount, keyVal, setCurrPage }) => {
  const { t } = useTranslation();
  // const handleRowCountChange = (e) => {
  //   // Create a copy of the current state object
  //   const updatedState = { ...rowCount };
  //   // Update the specific key in the copied object
  //   updatedState[keyVal] = parseInt(e.target.value, 10);

  //   // Set the updated object as the new state
  //   setRowCount(updatedState);
  // };

  const handleRowCountChange = (e) => {
    const updatedValue = parseInt(e.target.value, 10);
    setRowCount(updatedValue);
    setCurrPage(1);
  };

  return (
    <div className="row-count-dropdown text-right">
      {/* Added 'text-right' class */}
      <label htmlFor="row-count-select" className="row-label d-none d-md-block">
        {t("ROW_COUNT")}:
      </label>


      <select
        id="row-count-select"
        className="form-control"
        value={keyVal ? rowCount[keyVal] : rowCount}
        onChange={handleRowCountChange}
        style={{ paddingRight: rowCount <= 9 ? "0.75rem" : "1.2rem" }}
      >
        {PAGINATION_ROWS?.map((row, index) => {
          return (
            <option value={row?.value} key={index}>
              {row?.label}
            </option>
          );
        })}
      </select>
      <div className="icon-body">
        <RiArrowDropDownLine className="dropDown-icon " />
      </div>
    </div>
  );
};

export default PaginationRow;
