import React from "react";
import "../../../../assets/scss/pages/_restorePanel.scss";

const HorseRacePanel = ({
  event,
  setSelectedEvents,
  selectedEvents,
  checked,
  selectedIds,
  onChange,
}) => {
  const onChangeCheckedBox = (e, event, date) => {
    if (e.target.checked) {
      setSelectedEvents((prev) => [
        ...prev,
        {
          from: event?.timeRange?.from,
          to: event?.timeRange?.to,
        },
      ]);
    } else {
    }
  };

  return (
    <tr>
      <td style={{ width: "50px", textAlign: "center" }} className="relative">
        <label className="checkbox-container" style={{ margin: "0px" }}>
          <input
            // id="customCheckbox"
            type="checkbox"
            name="game1"
            className="checkbox-events"
            checked={selectedIds.includes(event?.id)} // Use the checked prop to control the checkbox
            onChange={(e) => {
              onChangeCheckedBox(e, event, event?.id); // Call the internal function
              onChange(event?.id); // Call the external onChange prop if passed
            }}
          />
          <div className="checkmark"></div>
        </label>
      </td>
      <td className="h6">
        <span>{event?.timeRange?.from}</span>
        <span>{` - `}</span>
        <span>{event?.timeRange?.to}</span>
      </td>

      <td className="text-success h6">{event?.marketCount}</td>
    </tr>
  );
};

export default HorseRacePanel;
