import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Table from "../components/Table";
import Buttons from "../components/Buttons";
import LineGraphs from "../components/LineGraphs";
import PieChart from "../components/PieChart";
import Map from "../components/Map";
import KeyData from "../components/KeyData";
import Loader from "../components/Loader";

import {
  fetchCurrentData,
  setMapData,
  setTopFiveTables,
  fetchHistoricalData,
  fetchCDCProvisionalData,
  setLoadingTrue,
  setLoadingFalse,
} from "../redux/actions/actionCreator";
import functions from "../utils/index";

import "./SummaryPage.css";

const SummaryPage = ({ navigate, basePath }) => {
  const dispatch = useDispatch();
  const currentStateData = useSelector((state) => state.currentStateData);
  const currentUSData = useSelector((state) => state.currentUSData);
  const historicalData = useSelector((state) => state.historicalData);
  const stateKey = useSelector((state) => state.stateKey);
  const mapData = useSelector((state) => state.mapData);
  // const topFiveTableData = useSelector((state) => state.topFiveTableData);
  const covidDemographicData = useSelector(
    (state) => state.covidDemographicData
  );
  const loading = useSelector((state) => state.loading);
  const [activeButton, setActiveButton] = useState("activeCases");

  useEffect(() => {
    dispatch(setLoadingTrue());
    if (!currentStateData || !currentUSData) {
      dispatch(fetchCurrentData());
      dispatch(setLoadingFalse());
      return;
    }
    dispatch(fetchHistoricalData("United States"));
    dispatch(fetchCDCProvisionalData("United States"));
    dispatch(setMapData(currentStateData, stateKey));
    // dispatch(setTopFiveTables(currentStateData, stateKey));
    dispatch(setLoadingFalse());
  }, [currentStateData, currentUSData, dispatch, stateKey]);

  const onStateClick = (e) => {
    dispatch(setLoadingTrue());
    if (basePath === "") {
      navigate(`/${e.target.id}`);
    } else {
      navigate(`/covid-data-client/${e.target.id}`);
    }
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

  const currentData =
    !currentUSData || !historicalData
      ? null
      : {
          activeCases: functions.convertNumberLocal(
            currentUSData[0].positive -
              currentUSData[0].recovered -
              currentUSData[0].death
          ),
          recoveries: functions.convertNumberLocal(currentUSData[0].recovered),
          deaths: functions.convertNumberLocal(currentUSData[0].death),
          inIcu: functions.convertNumberLocal(currentUSData[0].inIcuCurrently),
          hospitalized: functions.convertNumberLocal(
            currentUSData[0].hospitalizedCurrently
          ),
          totalCases: functions.convertNumberLocal(currentUSData[0].positive),
        };

  const buttonUSData = functions.createUSButtonArray(
    onButtonClick,
    activeButton
  );

  const selection = functions.buttonTextMap(activeButton);

  return (
    <div className="summary-page-container">
      {!mapData ? (
        <Loader />
      ) : (
        <>
          <div className="summary-main-container">
            <div className="data-container">
              {!historicalData ? null : (
                <KeyData
                  historicalData={historicalData}
                  currentData={currentData}
                />
              )}
              <PieChart
                data={covidDemographicData}
                dropDownLabel="Gender"
                dropDownSelection="sex"
                dataInfo={{
                  label: "age_group",
                  id: "age_group",
                  value: "covid_19_deaths",
                }}
                title="Deaths By Age Group"
              />
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
            <div className="tables-container">
              <h4>Top Five States</h4>
              <div className="table-container">
                <Table
                  className="data-table"
                  data={mapData}
                  columns={["stateName", activeButton]}
                  columnHeaders={["State", selection]}
                />
                {/* <Table
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
                /> */}
              </div>
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
