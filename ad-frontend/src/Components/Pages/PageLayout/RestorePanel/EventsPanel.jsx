import React from "react";
import "../../../../assets/scss/pages/_restorePanel.scss";

const EventsPanel = ({
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
          events_name: event?.name,
          events_slugName: event?.name,
          events_code: event?.id,
          events_eventDate: date,
        },
      ]);
    } else {
      let eventData = selectedEvents?.filter(
        (events) => events?.events_code !== event?.id
      );
      setSelectedEvents(eventData);
    }
  };
  return (
    <>
      {/* {event?.childs?.map((eve, index) => {
        return ( */}
      <tr>
        <td style={{ width: "50px", textAlign: "center" }} className="relative">
          <label className="checkbox-container" style={{ margin: "0px" }}>
            <input
              // id="customCheckbox"
              type="checkbox"
              name="game1"
              className="checkbox-events"
              checked={selectedIds.includes(event.event.id)} // Use the checked prop to control the checkbox
              onChange={(e) => {
                onChangeCheckedBox(e, event.event, event.event?.id); // Call the internal function
                onChange(event.event?.id); // Call the external onChange prop if passed
              }}
            />
            <div className="checkmark"></div>
          </label>
        </td>
        <td className="h6">{event.event?.name}</td>
        <td className="text-success h6">
          {new Date(event.event?.openDate).toLocaleString()}
        </td>
      </tr>
      {/* //   );
      // })} */}
    </>
  );
};

export default EventsPanel;
