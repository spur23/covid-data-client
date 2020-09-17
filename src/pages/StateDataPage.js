import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Map from "../components/Map";
import LineGraphs from "../components/LineGraphs";
import PieChart from "../components/PieChart";
import Loader from "../components/Loader";
import Buttons from "../components/Buttons";
import KeyData from "../components/KeyData";

import "./StateDataPage.css";

import {
  fetchStateData,
  fetchHistoricalData,
  fetchSelectedStateCurrentData,
  fetchCDCProvisionalData,
  setLoadingFalse,
  setLoadingTrue,
} from "../redux/actions/actionCreator";
import functions from "../utils";

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
  const covidDemographicData = useSelector(
    (state) => state.covidDemographicData
  );
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(setLoadingTrue());
    dispatch(fetchStateData(state[0].state));
    dispatch(fetchHistoricalData(state[0].abbreviation));
    dispatch(fetchSelectedStateCurrentData(stateId));
    dispatch(fetchCDCProvisionalData(state[0].state));
    dispatch(setLoadingFalse());
  }, []);

  const onButtonClick = (e) => {
    const btn = e.target.id;
    setActiveButton(btn);
  };

  const currentData =
    !historicalData || !selectedStateCurrentData
      ? null
      : {
          activeCases: functions.numberWithCommas(
            selectedStateCurrentData.positive -
              selectedStateCurrentData.recovered -
              selectedStateCurrentData.death
          ),
          recoveries: functions.numberWithCommas(
            selectedStateCurrentData.recovered
          ),
          deaths: functions.numberWithCommas(selectedStateCurrentData.death),
          inIcu: functions.numberWithCommas(
            selectedStateCurrentData.inIcuCurrently
          ),
          hospitalized: functions.numberWithCommas(
            selectedStateCurrentData.hospitalizedCurrently
          ),
          totalCases: functions.numberWithCommas(
            selectedStateCurrentData.positive
          ),
        };

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
              <div className="key-data-container">
                {!historicalData || !selectedStateCurrentData ? null : (
                  <KeyData
                    historicalData={historicalData}
                    currentData={currentData}
                  />
                )}
              </div>
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
