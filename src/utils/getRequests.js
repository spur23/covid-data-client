import axios from "axios";

const getStateCountyData = (state) =>
  axios.get(`https://covid-us-state-data.herokuapp.com/api/v1/home/${state}`);

const getStateGeoData = (state) =>
  axios.get(
    `https://covid-us-state-data.herokuapp.com/api/v1/home/us/county/geodata/${state}`
  );

const getStateMapData = (state) =>
  axios.get(
    `https://covid-us-state-data.herokuapp.com/api/v1/home/state/geodata/${state}`
  );

const getCurrentStateData = () =>
  axios.get("https://api.covidtracking.com/api/v1/states/current.json");

const getCurrentUSData = () =>
  axios.get("https://api.covidtracking.com/v1/us/current.json");

const getSelectedStateCurrentData = (state) =>
  axios.get(`https://api.covidtracking.com/v1/states/${state}/current.json`);

const getUSDailyData = () =>
  axios.get(`https://api.covidtracking.com/api/v1/us/daily.json`);

const getStateDailyData = (state) =>
  axios.get(`https://api.covidtracking.com/api/v1/states/${state}/daily.json`);

const getRequests = {
  getStateCountyData,
  getStateGeoData,
  getStateMapData,
  getCurrentStateData,
  getCurrentUSData,
  getSelectedStateCurrentData,
  getUSDailyData,
  getStateDailyData,
};

export default getRequests;
