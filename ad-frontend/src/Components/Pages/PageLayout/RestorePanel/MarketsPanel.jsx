import React from "react";
import "../../../../assets/scss/pages/_restorePanel.scss";

const MarketsPanel = ({
  market,
  index,
  setSelectedMarkets,
  selectedMarkets,
  selectedMarketIds,
  onChange,
}) => {
  const onChangeCheckedBox = (e, market) => {
    if (e.target.checked) {
      setSelectedMarkets((prev) => [...prev, market]);
    } else {
      let marketData = selectedMarkets?.filter(
        (markets) => markets?.marketCode !== market?.marketCode
      );
      setSelectedMarkets(marketData);
    }
  };

  return (
    // <tr key={index}>
    //   <td className="h6">{market?.marketName}</td>
    //   <td className="text-success h6">
    //     {new Date(market?.marketStartTime).toLocaleString()}
    //   </td>
    // </tr>
    // <tr>
    <tr key={index}>
      <td style={{ width: "50px", textAlign: "center" }} className="relative">
        <label className="checkbox-container" style={{ margin: "0px" }}>
          <input
            // id="customCheckbox"
            type="checkbox"
            name="game1"
            className="checkbox-events"
            checked={selectedMarketIds?.includes(market.marketCode)} // Use the checked prop to control the checkbox
            onChange={(e) => {
              onChangeCheckedBox(e, market); // Call the internal function
              onChange(market.marketCode); // Call the external onChange prop if passed
            }}
          />
          <div className="checkmark"></div>
        </label>
      </td>
      <td className="h6">{market?.marketName}</td>
      <td className="text-success h6">
        {market?.marketStartTime !== undefined ?new Date(market?.marketStartTime).toLocaleString():"-"}
      </td>
    </tr>
  );
};

export default MarketsPanel;
