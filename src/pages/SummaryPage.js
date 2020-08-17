import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentData,
  setMapData,
  setTopFiveTables,
} from "../redux/actions/actionCreator";
import functions from "../data-calculators";

import Table from "../components/Table";
import GeoChart from "../visualizations/GeoChart";
import Loader from "../components/Loader";
import "./SummaryPage.css";

const SummaryPage = ({ navigate }) => {
  const dispatch = useDispatch();
  const currentStateData = useSelector((state) => state.currentStateData);
  const currentUSData = useSelector((state) => state.currentUSData);
  const stateKey = useSelector((state) => state.stateKey);
  const mapData = useSelector((state) => state.mapData);
  const topFiveTableData = useSelector((state) => state.topFiveTableData);
  const [activeButton, setActiveButton] = useState("activeCases");

  useEffect(() => {
    if (!currentStateData || !currentUSData) {
      dispatch(fetchCurrentData());
      return;
    }

    dispatch(setMapData(currentStateData, stateKey));
    dispatch(setTopFiveTables(currentStateData, stateKey));
  }, [currentStateData, currentUSData, dispatch, stateKey]);

  const tableRowOnClick = (e) => {
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

  const renderUSData = !currentUSData ? null : (
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
    </>
  );

  return (
    <div className="summary-page-container">
      {!topFiveTableData || !mapData ? (
        <Loader />
      ) : (
        <>
          <div className="us-data-container">
            <h4>US Data</h4>
            <div className="us-data">{renderUSData}</div>
          </div>
          <div className="summary-main-container">
            <div className="map-container">
              <div className="button-container">
                <button
                  className={activeButton === "activeCases" ? "active" : null}
                  id="activeCases"
                  onClick={onButtonClick}
                >
                  Active Cases
                </button>
                <button
                  className={activeButton === "recoveries" ? "active" : null}
                  id="recoveries"
                  onClick={onButtonClick}
                >
                  Recoveries
                </button>
                <button
                  className={activeButton === "deaths" ? "active" : null}
                  id="deaths"
                  onClick={onButtonClick}
                >
                  Deaths
                </button>
                <button
                  className={activeButton === "inICU" ? "active" : null}
                  id="inICU"
                  onClick={onButtonClick}
                >
                  In ICU
                </button>
                <button
                  className={activeButton === "hospitalized" ? "active" : null}
                  id="hospitalized"
                  onClick={onButtonClick}
                >
                  Hospitalized
                </button>
                <button
                  className={activeButton === "totalCases" ? "active" : null}
                  id="totalCases"
                  onClick={onButtonClick}
                >
                  Total Cases
                </button>
              </div>
              <GeoChart
                data={mapData}
                selection={activeButton}
                onClick={tableRowOnClick}
              />
            </div>
            <Table
              className="positive-table"
              data={topFiveTableData.fivePositive}
              onClick={tableRowOnClick}
            />
            <Table
              className="death-table"
              data={topFiveTableData.fiveDeaths}
              onClick={tableRowOnClick}
            />
          </div>
          <div>{renderFooter}</div>
        </>
      )}
    </div>
  );
};

export default SummaryPage;
