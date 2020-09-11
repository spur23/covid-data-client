import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentData,
  setMapData,
  setTopFiveTables,
  fetchHistoricalData,
  setLoadingTrue,
  setLoadingFalse,
  resetState,
} from "../redux/actions/actionCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";

import functions from "../utils/index";

import Table from "../components/Table";
import Buttons from "../components/Buttons";
import LineGraphs from "../components/LineGraphs";
import Map from "../components/Map";

import Loader from "../components/Loader";
import "./SummaryPage.css";

const SummaryPage = ({ navigate }) => {
  const dispatch = useDispatch();
  const currentStateData = useSelector((state) => state.currentStateData);
  const currentUSData = useSelector((state) => state.currentUSData);
  const historicalData = useSelector((state) => state.historicalData);
  const stateKey = useSelector((state) => state.stateKey);
  const mapData = useSelector((state) => state.mapData);
  const topFiveTableData = useSelector((state) => state.topFiveTableData);
  const loading = useSelector((state) => state.loading);
  const [activeButton, setActiveButton] = useState("activeCases");

  useEffect(() => {
    dispatch(setLoadingTrue());
    // dispatch(resetState());
    if (!currentStateData || !currentUSData) {
      dispatch(fetchCurrentData());
      dispatch(setLoadingFalse());
      return;
    }
    dispatch(fetchHistoricalData("United States"));
    dispatch(setMapData(currentStateData, stateKey));
    dispatch(setTopFiveTables(currentStateData, stateKey));
    dispatch(setLoadingFalse());
  }, [currentStateData, currentUSData, dispatch, stateKey]);

  const onStateClick = (e) => {
    dispatch(setLoadingTrue());
    navigate(`/data/${e.target.id}`);
  };

  const onButtonClick = (e) => {
    const btn = e.target.id;
    setActiveButton(btn);
  };

  const renderFooter = !currentUSData ? null : (
    <h6>
      {" "}
      Data provided through The COVID Tracking Project at The Atlantic, as of{" "}
      {functions.formatDate(currentUSData[0].date)}
    </h6>
  );

  const renderUSData =
    !currentUSData || !historicalData ? null : (
      <>
        <div>
          Active Cases:{" "}
          {functions.numberWithCommas(
            currentUSData[0].positive -
              currentUSData[0].recovered -
              currentUSData[0].death
          )}
        </div>
        <div>
          Recoveries: {functions.numberWithCommas(currentUSData[0].recovered)}
        </div>
        <div>Deaths: {functions.numberWithCommas(currentUSData[0].death)}</div>
        <div>
          In ICU: {functions.numberWithCommas(currentUSData[0].inIcuCurrently)}
        </div>
        <div>
          Hospitalized:{" "}
          {functions.numberWithCommas(currentUSData[0].hospitalizedCurrently)}
        </div>
        <div>
          Total Cases: {functions.numberWithCommas(currentUSData[0].positive)}
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

  const buttonUSData = functions.createUSButtonArray(
    onButtonClick,
    activeButton
  );

  return (
    <div className="summary-page-container">
      {!topFiveTableData || !mapData ? (
        <Loader />
      ) : (
        <>
          <div className="summary-main-container">
            <div className="data-container">
              <h4>Key Data</h4>
              <div className="key-data-container">{renderUSData}</div>
            </div>
            <div className="map-container">
              <Buttons data={buttonUSData} />
              <Map
                data={mapData}
                selection={activeButton}
                onClick={onStateClick}
                type="US"
              />
            </div>
            <div className="table-container">
              <h4>Top Five States</h4>
              <Table
                className="positive-table"
                data={topFiveTableData.fivePositive}
                header="Top Five Total Cases"
                onClick={onStateClick}
              />
              <Table
                className="death-table"
                data={topFiveTableData.fiveDeaths}
                header="Top Five Total Deaths"
                onClick={onStateClick}
              />
            </div>
          </div>
          <LineGraphs data={historicalData} />
          <div>{renderFooter}</div>
        </>
      )}
    </div>
  );
};

export default SummaryPage;
