import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStateData,
  fetchHistoricalData,
  fetchSelectedStateCurrentData,
  setLoadingFalse,
  setLoadingTrue,
} from "../redux/actions/actionCreator";
import "./StateDataPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";

import functions from "../utils";

import Map from "../components/Map";
import LineGraphs from "../components/LineGraphs";
import Loader from "../components/Loader";
import Buttons from "../components/Buttons";

const StateDataPage = ({ stateId }) => {
  const dispatch = useDispatch();
  const stateKey = useSelector((state) => state.stateKey);
  const stateGeoData = useSelector((state) => state.selectedStateGeoData);
  const stateMapData = useSelector((state) => state.selectedStateMapData);
  const stateCovidData = useSelector(
    (state) => state.selectedStateCountyCovidData
  );
  const historicalData = useSelector((state) => state.historicalData);
  const [activeButton, setActiveButton] = useState("cases");
  const state = stateKey.filter((el) => el.abbreviation === stateId);
  const selectedStateCurrentData = useSelector(
    (state) => state.selectedStateCurrentData
  );
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(setLoadingTrue());
    dispatch(fetchStateData(state[0].state));
    dispatch(fetchHistoricalData(state[0].abbreviation));
    dispatch(fetchSelectedStateCurrentData(stateId));
    dispatch(setLoadingFalse());
  }, []);

  // if (!stateGeoData && !stateMapData && !stateCovidData) {
  //   dispatch(setLoadingTrue());
  // } else {
  //   dispatch(setLoadingFalse());
  // }

  const onButtonClick = (e) => {
    const btn = e.target.id;
    setActiveButton(btn);
  };

  const renderUSData =
    !historicalData || !selectedStateCurrentData ? null : (
      <>
        <div>
          Active Cases:{" "}
          {functions.numberWithCommas(
            selectedStateCurrentData.positive -
              selectedStateCurrentData.recovered -
              selectedStateCurrentData.death
          )}
        </div>
        <div>
          Recoveries:{" "}
          {functions.numberWithCommas(selectedStateCurrentData.recovered)}
        </div>
        <div>
          Deaths: {functions.numberWithCommas(selectedStateCurrentData.death)}
        </div>
        <div>
          In ICU:{" "}
          {functions.numberWithCommas(selectedStateCurrentData.inIcuCurrently)}
        </div>
        <div>
          Hospitalized:{" "}
          {functions.numberWithCommas(
            selectedStateCurrentData.hospitalizedCurrently
          )}
        </div>
        <div>
          Total Cases:{" "}
          {functions.numberWithCommas(selectedStateCurrentData.positive)}
        </div>
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

  const buttonStateData = [
    {
      class: activeButton === "cases" ? "active" : null,
      id: "cases",
      text: "Cases",
      onClick: onButtonClick,
    },
    {
      class: activeButton === "deaths" ? "active" : null,
      id: "deaths",
      text: "Deaths",
      onClick: onButtonClick,
    },
  ];

  return (
    <div className="summary-page-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="summary-main-container">
            <div className="data-container">
              <h4>Key Data</h4>
              <div className="key-data-container">{renderUSData}</div>
            </div>
            <div className="map-container">
              <Buttons data={buttonStateData} />
              {!stateMapData || stateMapData.length === 0 ? (
                <Loader />
              ) : (
                <Map
                  geoData={stateGeoData}
                  mapData={stateMapData}
                  data={stateCovidData}
                  selection={activeButton}
                />
              )}
            </div>
          </div>
          <LineGraphs data={historicalData} />
        </>
      )}
    </div>
  );
};

export default StateDataPage;
