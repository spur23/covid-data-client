import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";

const KeyData = ({ historicalData, currentData }) => {
  return (
    <>
      <div>Active Cases: {currentData.activeCases}</div>
      <div>Recoveries: {currentData.recoveries}</div>
      <div>Deaths: {currentData.deaths}</div>
      <div>In ICU: {currentData.inIcu}</div>
      <div>Hospitalized: {currentData.hospitalized}</div>
      <div>Total Cases: {currentData.totalCases}</div>
      <div>
        Postive Cases 7 Day Trend:{" "}
        {historicalData[0].positiveIncreaseRA7 >
        historicalData[6].positiveIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowUp} style={{ color: "red" }} />
        ) : historicalData[0].positiveIncreaseRA7 <
          historicalData[6].positiveIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowDown} style={{ color: "green" }} />
        ) : (
          <FontAwesomeIcon icon={faEquals} style={{ color: "blue" }} />
        )}
      </div>
      <div>
        Deaths 7 Day Trend:{" "}
        {historicalData[0].deathIncreaseRA7 >
        historicalData[6].deathIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowUp} style={{ color: "red" }} />
        ) : historicalData[0].deathIncreaseRA7 <
          historicalData[6].deathIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowDown} style={{ color: "green" }} />
        ) : (
          <FontAwesomeIcon icon={faEquals} style={{ color: "blue" }} />
        )}
      </div>
      <div>
        Hospitalized Incr. 7 Day Trend:{" "}
        {historicalData[0].hospitalizedIncreaseRA7 >
        historicalData[6].hospitalizedIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowUp} style={{ color: "red" }} />
        ) : historicalData[0].hospitalizedIncreaseRA7 <
          historicalData[6].hospitalizedIncreaseRA7 ? (
          <FontAwesomeIcon icon={faArrowDown} style={{ color: "green" }} />
        ) : (
          <FontAwesomeIcon icon={faEquals} style={{ color: "blue" }} />
        )}
      </div>
    </>
  );
};

export default KeyData;
