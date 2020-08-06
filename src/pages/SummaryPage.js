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

  return (
    <div className="summary-page-container">
      {!topFiveTableData || !mapData ? (
        <Loader />
      ) : (
        <>
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
